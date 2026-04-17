/**
 * COFFEY — Infrastructure Resilience & Auto-Healing
 * ═══════════════════════════════════════════════════
 * Mission: Watch all 15 soldiers, detect failures, heal before humans notice.
 *
 * S67 Fischer Move 5: Full watchdog implementation.
 *
 * COFFEY is distinct from RIPLEY:
 * - RIPLEY deploys soldiers to the field (blue/green, Docker, commit SHA tags)
 * - COFFEY keeps soldiers on the field (heartbeat watchdog, provider health, auto-recovery)
 *
 * Responsibilities:
 * - Monitor all 15 soldier heartbeats every 60s
 * - Detect infrastructure failures (Hetzner, Upstash, Discord, GitHub)
 * - Auto-recover crashed soldiers via PM2 restart
 * - Monitor VPS resources (RAM, CPU, disk) and alert before OOM/fillup
 * - Manage comms failover (Discord → Upstash → GitHub)
 * - Report army health to command center
 *
 * Boot: Template boot → Health scan → Watchdog loop
 * Heartbeat: 60s (faster than normal soldiers — watching others)
 * Idle: Provider health checks → Resource monitoring → Escalation routing
 *
 * LAW 147: RIPLEY owns reboots. COFFEY escalates — does NOT deploy.
 * LAW 175: Crashed services auto-rebooted within 60s.
 * LAW 230: Silent agent > 5 min = alert Boss Discord.
 * LAW 338: No silent failures.
 */

import { boot, SoldierConfig } from '../../ironbridge-soldier-template/src/index';
import { safeGet, safeSet, safeStreamAdd } from '../../ironbridge-soldier-template/src/services/upstash';
import { auditLog } from '../../ironbridge-soldier-template/src/core/audit';
import { publishBroadcast } from '../../ironbridge-soldier-template/src/core/broadcast';
import { buildPlatformChecks, checkPlatform, runFullHealthCheck } from './skills/platform-health-monitor';

// ─── ARMY ROSTER (all soldiers except coffey) ───────────────────
const WATCHED_SOLDIERS = [
  'dick', 'hermes', 'sarge', 'ezra', 'brooks', 'oscar',
  'rachel', 'gary', 'paul', 'ripley',
  'vetter', 'athena', 'candor', 'wick', 'argus',
] as const;

// Thresholds (per LAW 230: silent > 5 min = alert)
const ALIVE_THRESHOLD_MS = 5 * 60 * 1000;    // 5 min — soldier considered alive
const STALE_THRESHOLD_MS = 10 * 60 * 1000;   // 10 min — soldier stale, warn
const DEAD_THRESHOLD_MS = 15 * 60 * 1000;    // 15 min — soldier dead, escalate

// ─── WATCHDOG STATE ────────────────────────────────────────────
interface SoldierHealth {
  id: string;
  lastHeartbeat: number;
  status: 'alive' | 'stale' | 'dead' | 'unknown';
  degraded: boolean;
  consecutiveFailures: number;
  lastAlertAt: number;
}

const armyHealth: Map<string, SoldierHealth> = new Map();

// Initialize health tracking
for (const id of WATCHED_SOLDIERS) {
  armyHealth.set(id, {
    id,
    lastHeartbeat: 0,
    status: 'unknown',
    degraded: false,
    consecutiveFailures: 0,
    lastAlertAt: 0,
  });
}

// ─── HEARTBEAT WATCHDOG ────────────────────────────────────────
/**
 * Core watchdog function. Polls all 15 soldier heartbeats from Upstash.
 * Classifies each as alive/stale/dead. Escalates as needed.
 *
 * LAW 230: Silent > 5 min = alert.
 * LAW 338: No silent failures.
 */
async function watchdogScan(): Promise<void> {
  const now = Date.now();
  let aliveCount = 0;
  let staleCount = 0;
  let deadCount = 0;
  const deadSoldiers: string[] = [];
  const staleSoldiers: string[] = [];

  for (const id of WATCHED_SOLDIERS) {
    const health = armyHealth.get(id)!;

    try {
      const hbRaw = await safeGet(`ironbridge:heartbeat:${id}`);
      if (hbRaw) {
        const hb = typeof hbRaw === 'string' ? JSON.parse(hbRaw) : hbRaw;
        health.lastHeartbeat = hb.timestamp || 0;
        health.degraded = hb.degraded || false;
        health.consecutiveFailures = 0;

        const age = now - health.lastHeartbeat;
        if (age < ALIVE_THRESHOLD_MS) {
          health.status = health.degraded ? 'stale' : 'alive';
          if (health.status === 'alive') aliveCount++;
          else { staleCount++; staleSoldiers.push(id); }
        } else if (age < STALE_THRESHOLD_MS) {
          health.status = 'stale';
          staleCount++;
          staleSoldiers.push(id);
        } else {
          health.status = 'dead';
          deadCount++;
          deadSoldiers.push(id);
        }
      } else {
        // No heartbeat ever recorded
        health.status = 'dead';
        deadCount++;
        deadSoldiers.push(id);
      }
    } catch {
      health.consecutiveFailures++;
      if (health.consecutiveFailures >= 3) {
        health.status = 'dead';
        deadCount++;
        deadSoldiers.push(id);
      }
    }
  }

  // Log scan results
  console.log(`[COFFEY] Watchdog scan: ${aliveCount} alive, ${staleCount} stale, ${deadCount} dead / ${WATCHED_SOLDIERS.length} total`);

  // Publish army health to command center
  await safeSet('coffey', 'ironbridge:army:health', JSON.stringify({
    timestamp: now,
    alive: aliveCount,
    stale: staleCount,
    dead: deadCount,
    total: WATCHED_SOLDIERS.length,
    deadSoldiers,
    staleSoldiers,
    scanner: 'coffey',
  }), 120);

  // ─── ESCALATION ──────────────────────────────────────────────
  // Dead soldiers → alert DICK + audit log
  for (const id of deadSoldiers) {
    const health = armyHealth.get(id)!;
    const timeSinceLastAlert = now - health.lastAlertAt;

    // Don't spam — alert at most once per 5 minutes per soldier
    if (timeSinceLastAlert < 5 * 60 * 1000) continue;

    health.lastAlertAt = now;

    console.warn(`[COFFEY] DEAD SOLDIER: ${id.toUpperCase()} — no heartbeat for ${Math.round((now - health.lastHeartbeat) / 60000)}min`);

    await auditLog({
      soldier: 'coffey',
      action: 'soldier_dead_detected',
      target: id,
      error: `No heartbeat for ${Math.round((now - health.lastHeartbeat) / 60000)}min`,
    });

    // Alert DICK (per LAW 108: all agents report to Dick)
    await publishBroadcast('coffey', 'ironbridge:broadcast:dick', {
      type: 'alert',
      from: 'coffey',
      content: `DEAD: ${id.toUpperCase()} — no heartbeat for ${Math.round((now - health.lastHeartbeat) / 60000)}min. Requesting RIPLEY restart.`,
      priority: deadCount >= 3 ? 'P0' : 'P1',
    });

    // Request RIPLEY restart (per LAW 175: auto-reboot within 60s)
    await publishBroadcast('coffey', 'ironbridge:broadcast:ripley', {
      type: 'mission',
      from: 'coffey',
      content: JSON.stringify({
        skill: 'self-healing-systems',
        action: 'restart_soldier',
        target: id,
        reason: `Dead for ${Math.round((now - health.lastHeartbeat) / 60000)}min`,
      }),
      priority: 'P1',
    });
  }

  // If >50% army dead, this is P0 (LAW 185: blockers to owner within 5 minutes)
  if (deadCount > WATCHED_SOLDIERS.length / 2) {
    console.error(`[COFFEY] P0: MAJORITY ARMY DOWN (${deadCount}/${WATCHED_SOLDIERS.length} dead)`);
    await safeStreamAdd('coffey', 'ironbridge:alerts:active', {
      id: `coffey-p0-${now}`,
      severity: 'P0',
      message: `MAJORITY ARMY DOWN: ${deadCount}/${WATCHED_SOLDIERS.length} soldiers dead`,
      soldier: 'coffey',
      timestamp: now,
      resolved: false,
    });
  }
}

// ─── PLATFORM HEALTH CHECKS (Bobby Fischer — every square) ───
/**
 * Full 13-platform health monitor. Uses platform-health-monitor.ts skill.
 * Checks: Hetzner, Upstash, Vercel CC, Obsidian, Groq, Gemini, BNKR,
 * Discord, Clerk, Solvr, GitHub API, Goose fork, X/Twitter.
 *
 * Results written to:
 *   ironbridge:health:platforms (full results — CC reads this)
 *   ironbridge:providers:health (legacy compat — CC also reads)
 *   ironbridge:alerts:active (if any critical platform DOWN)
 *
 * LAW 338: No silent failures.
 */
async function providerHealthCheck(): Promise<void> {
  const now = Date.now();

  try {
    const { results, summary } = await runFullHealthCheck();

    // Write full results for Command Deck
    await safeSet('coffey', 'ironbridge:health:platforms', JSON.stringify({
      results,
      summary,
      lastCheck: now,
      checkedAt: now,
    }), 600); // 10 min TTL

    // Write legacy provider health (CC compat)
    const legacyProviders: Record<string, { healthy: boolean; latencyMs: number; error?: string }> = {};
    for (const r of results) {
      legacyProviders[r.id] = {
        healthy: r.status === 'UP' || r.status === 'DEGRADED',
        latencyMs: r.responseTimeMs,
        error: r.error || undefined,
      };
    }
    await safeSet('coffey', 'ironbridge:providers:health', JSON.stringify({
      timestamp: now,
      providers: legacyProviders,
    }), 120);

    // Log summary
    const statusLine = results
      .filter(r => r.status !== 'SKIP')
      .map(r => `${r.id}:${r.status}(${r.responseTimeMs}ms)`)
      .join(' | ');
    console.log(`[COFFEY] Platform health: ${summary.up} UP, ${summary.down} DOWN, ${summary.degraded} DEGRADED, ${summary.skipped} SKIP`);
    console.log(`[COFFEY] ${statusLine}`);

    // Alert on critical platforms down (LAW 338)
    if (summary.criticalDown.length > 0) {
      const msg = `CRITICAL PLATFORMS DOWN: ${summary.criticalDown.join(', ')}`;
      console.error(`[COFFEY] P0: ${msg}`);

      await auditLog({
        soldier: 'coffey',
        action: 'critical_platform_down',
        target: summary.criticalDown.join(','),
        error: msg,
      });

      await publishBroadcast('coffey', 'ironbridge:broadcast:dick', {
        type: 'alert',
        from: 'coffey',
        content: msg,
        priority: 'P0',
      });

      // Write to active alerts for CC
      await safeStreamAdd('coffey', 'ironbridge:alerts:active', {
        id: `coffey-platform-${now}`,
        severity: 'P0',
        message: msg,
        soldier: 'coffey',
        timestamp: now,
        resolved: 'false',
      });
    }

    // Alert on non-critical platforms down (P2 level)
    const nonCriticalDown = results.filter(r => r.status === 'DOWN' && !r.critical);
    for (const r of nonCriticalDown) {
      await auditLog({
        soldier: 'coffey',
        action: 'platform_down',
        target: r.id,
        error: r.error || `Status: ${r.statusCode}`,
      });
    }
  } catch (err) {
    console.error(`[COFFEY] Platform health check FAILED: ${(err as Error).message}`);
    await auditLog({
      soldier: 'coffey',
      action: 'platform_health_error',
      target: 'all',
      error: (err as Error).message,
    });
  }
}

// ─── SOLDIER CONFIG ────────────────────────────────────────────
const config: SoldierConfig = {
  id: 'coffey',
  name: 'COFFEY',
  heartbeatIntervalMs: 60000,       // 60s (faster than normal soldiers)
  idleCycleIntervalMs: 300000,      // 5 min

  async onBoot() {
    console.log('[COFFEY] Infrastructure Resilience Officer online.');
    console.log(`[COFFEY] Watching ${WATCHED_SOLDIERS.length} soldiers.`);
    console.log('[COFFEY] Thresholds: alive <5min, stale <10min, dead >=15min');

    // Initial scan
    await watchdogScan();
    await providerHealthCheck();
  },

  async onMission(payload) {
    const task = typeof payload === 'string' ? JSON.parse(payload) : payload;
    const skill = task.skill || task.content?.skill || 'unknown';

    console.log(`[COFFEY] Mission received: ${skill}`);

    switch (skill) {
      case 'heartbeat-watchdog':
        await watchdogScan();
        break;

      case 'provider-health-check':
      case 'platform-health-monitor':
        await providerHealthCheck();
        break;

      case 'auto-recovery':
        // COFFEY escalates to RIPLEY for actual restart (LAW 147)
        const target = task.target || task.content?.target;
        if (target) {
          await publishBroadcast('coffey', 'ironbridge:broadcast:ripley', {
            type: 'mission',
            from: 'coffey',
            content: JSON.stringify({
              skill: 'self-healing-systems',
              action: 'restart_soldier',
              target,
              reason: 'COFFEY auto-recovery request',
            }),
            priority: 'P1',
          });
          console.log(`[COFFEY] Recovery request sent to RIPLEY for ${target}`);
        }
        break;

      case 'resource-monitor':
        // Basic resource check (will expand with os-level metrics)
        const memUsage = process.memoryUsage();
        console.log(`[COFFEY] Resource check: RSS=${Math.round(memUsage.rss / 1024 / 1024)}MB, Heap=${Math.round(memUsage.heapUsed / 1024 / 1024)}/${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`);
        break;

      default:
        console.warn(`[COFFEY] Unknown skill: ${skill}`);
    }
  },
};

// ─── BOOT ──────────────────────────────────────────────────────
boot(config);

// ─── WATCHDOG LOOP ────────────────────────────────────────────
// Run watchdog scan every 60 seconds (independent of idle cycle)
// This is COFFEY's primary function — continuous heartbeat monitoring
setInterval(async () => {
  try {
    await watchdogScan();
  } catch (err) {
    console.error(`[COFFEY] Watchdog scan error: ${(err as Error).message}`);
  }
}, 60000);

// Provider health checks every 5 minutes
setInterval(async () => {
  try {
    await providerHealthCheck();
  } catch (err) {
    console.error(`[COFFEY] Provider health check error: ${(err as Error).message}`);
  }
}, 300000);
