/**
 * IRONBRIDGE COMMAND DECK — Server-Sent Events API Route v3.0
 * Streams real-time data from Upstash to the frontend.
 *
 * v3.0 ENHANCEMENTS:
 * - Queue board data with manifest + priority breakdown
 * - Skill registry per soldier
 * - Revenue metrics (COFFEY, Oracle, Marketplace)
 * - Fischer recovery status & progress
 * - Army readiness score (composite)
 *
 * DECREE 7: API > UI — all data fetched via Upstash REST API.
 * Uses Vercel Edge Functions for low-latency streaming.
 */

import { Redis } from '@upstash/redis';

export const runtime = 'edge';

/**
 * ALL 16 SOLDIERS — per Operational Handbook §2 + COFFEY ratified S67.
 * skillsBuilt = SRP-1.0 runnable skills. skillsPlanned = assigned but unbuilt.
 * If you add a soldier, update Handbook §2 and CLAUDE.md ARMY table.
 */
const SOLDIERS = [
  'dick', 'hermes', 'sarge', 'ezra', 'brooks', 'oscar',
  'rachel', 'gary', 'paul', 'ripley', 'vetter', 'athena',
  'candor', 'wick', 'argus', 'coffey',
];

/**
 * SOLDIER_META — aligned with Operational Handbook §2, SKILL_ROUTING table,
 * and Agent Graph (S69 audit). skillsBuilt = SRP-1.0 runnable count.
 * skillsPlanned = total assigned in SKILL_ROUTING dispatch table.
 */
const SOLDIER_META: Record<string, { name: string; role: string; skillsBuilt: number; skillsPlanned: number }> = {
  dick:    { name: 'DICK',    role: 'Commander / 2IC',           skillsBuilt: 2,  skillsPlanned: 24 },
  hermes:  { name: 'HERMES',  role: 'Memory & Sync',             skillsBuilt: 2,  skillsPlanned: 8 },
  sarge:   { name: 'SARGE',   role: 'Security Chief',            skillsBuilt: 11, skillsPlanned: 15 },
  ezra:    { name: 'EZRA',    role: 'QA & Audit',                skillsBuilt: 3,  skillsPlanned: 7 },
  brooks:  { name: 'BROOKS',  role: 'Code Quality',              skillsBuilt: 0,  skillsPlanned: 16 },
  oscar:   { name: 'OSCAR',   role: 'Frontend',                  skillsBuilt: 0,  skillsPlanned: 12 },
  rachel:  { name: 'RACHEL',  role: 'Intelligence',              skillsBuilt: 3,  skillsPlanned: 9 },
  gary:    { name: 'GARY',    role: 'Growth & Partnerships',     skillsBuilt: 0,  skillsPlanned: 17 },
  paul:    { name: 'PAUL',    role: 'Product',                   skillsBuilt: 0,  skillsPlanned: 10 },
  ripley:  { name: 'RIPLEY',  role: 'Deployment',                skillsBuilt: 2,  skillsPlanned: 8 },
  vetter:  { name: 'VETTER',  role: 'Discovery & Vetting',       skillsBuilt: 2,  skillsPlanned: 22 },
  athena:  { name: 'ATHENA',  role: 'Continuous Improvement',    skillsBuilt: 0,  skillsPlanned: 5 },
  candor:  { name: 'CANDOR',  role: 'PDS / User-Facing Intel',   skillsBuilt: 0,  skillsPlanned: 14 },
  wick:    { name: 'WICK',    role: 'Personal Security Lead',    skillsBuilt: 0,  skillsPlanned: 12 },
  argus:   { name: 'ARGUS',   role: 'Empire Auditor (LAW 333)',  skillsBuilt: 2,  skillsPlanned: 5 },
  coffey:  { name: 'COFFEY',  role: 'The Healer (x402 Revenue)', skillsBuilt: 2,  skillsPlanned: 10 },
};

// Default Fischer 7-move recovery plan
const DEFAULT_FISCHER_MOVES = [
  { id: 1, title: 'Stabilize heartbeats & memory sync', status: 'completed' as const, completedAt: Date.now() - 7*24*60*60*1000 },
  { id: 2, title: 'Deploy skill registry attestation', status: 'pending' as const, completedAt: null },
  { id: 3, title: 'Onboard COFFEY x402 revenue stream', status: 'pending' as const, completedAt: null },
  { id: 4, title: 'Harden Oracle interface queries', status: 'pending' as const, completedAt: null },
  { id: 5, title: 'Launch marketplace skill auction', status: 'pending' as const, completedAt: null },
  { id: 6, title: 'Conduct full army readiness drill', status: 'pending' as const, completedAt: null },
  { id: 7, title: 'Promote to production cluster', status: 'pending' as const, completedAt: null },
];

async function fetchDeckState(redis: Redis) {
  const now = Date.now();

  // Fetch soldier heartbeats
  const heartbeatKeys = SOLDIERS.map(s => `ironbridge:heartbeat:${s}`);
  const heartbeats = await redis.mget<(string | null)[]>(...heartbeatKeys);

  // Fetch sync hashes
  const [hotHash, warmHash, coldHash] = await Promise.all([
    redis.get<string>('ironbridge:sync:hash:upstash'),
    redis.get<string>('ironbridge:sync:hash:obsidian'),
    redis.get<string>('ironbridge:sync:hash:github'),
  ]);

  // Fetch recent audit entries (last 50)
  const auditEntries = await redis.xrevrange('ironbridge:audit:log', '+', '-', 50).catch(() => []);

  // Build soldier states
  const soldiers = SOLDIERS.map((id, i) => {
    const hb = heartbeats[i];
    let lastHeartbeat = 0;
    let status: 'online' | 'degraded' | 'offline' | 'pending' = 'pending';
    let degraded = false;

    if (hb) {
      try {
        const parsed = typeof hb === 'string' ? JSON.parse(hb) : hb;
        lastHeartbeat = parsed.timestamp || 0;
        degraded = parsed.degraded || false;
        const age = now - lastHeartbeat;
        if (age < 5 * 60 * 1000) status = degraded ? 'degraded' : 'online';
        else if (age < 15 * 60 * 1000) status = 'degraded';
        else status = 'offline';
      } catch {
        status = 'pending';
      }
    }

    const meta = SOLDIER_META[id];
    return {
      id,
      name: meta.name,
      role: meta.role,
      status,
      battery: status === 'online' ? 95 + Math.floor(Math.random() * 5) : status === 'degraded' ? 50 + Math.floor(Math.random() * 30) : 0,
      ping: lastHeartbeat ? now - lastHeartbeat : 0,
      alignment: status === 'online' ? 100 : status === 'degraded' ? 75 : 0,
      skills: [],
      skillsBuilt: meta.skillsBuilt,
      skillsPlanned: meta.skillsPlanned,
      skillCount: meta.skillsPlanned, // total assigned
      lastHeartbeat,
      degraded,
      currentTask: null,
      tasksCompleted: 0,
      tasksFailed: 0,
    };
  });

  // Fetch queue tickets — try manifest first, fallback to lrange
  let queueTickets: any[] = [];
  let queueManifest: any[] = [];
  let totalQueueCount = 0;
  let p0Count = 0;
  let p1Count = 0;
  let p2Count = 0;
  let resolvedTodayCount = 0;

  try {
    const manifest = await redis.get<string>('ironbridge:queue:manifest');
    if (manifest) {
      try {
        queueManifest = typeof manifest === 'string' ? JSON.parse(manifest) : manifest;
        queueTickets = Array.isArray(queueManifest) ? queueManifest : [];
      } catch {
        queueTickets = [];
      }
    }
  } catch {
    // Fallback to lrange
  }

  if (queueTickets.length === 0) {
    const ticketList = await redis.lrange('ironbridge:queue:dispatch', 0, 20).catch(() => []);
    queueTickets = Array.isArray(ticketList) ? ticketList : [];
  }

  const jobs = Array.isArray(queueTickets) ? queueTickets.map((t: any, i: number) => {
    const ticket = typeof t === 'string' ? JSON.parse(t) : t;
    return {
      id: ticket.id || `job-${i}`,
      title: ticket.title || ticket.skill || 'unknown',
      assignedTo: ticket.soldier || ticket.assigned_to || 'unassigned',
      status: ticket.status || 'queued',
      priority: ticket.priority || 'P3',
      createdAt: ticket.created_at || now,
      startedAt: ticket.started_at,
      completedAt: ticket.completed_at,
      sha: ticket.sha,
    };
  }) : [];

  // Count queue metrics
  totalQueueCount = jobs.length;
  p0Count = jobs.filter((j: any) => j.priority === 'P0').length;
  p1Count = jobs.filter((j: any) => j.priority === 'P1').length;
  p2Count = jobs.filter((j: any) => j.priority === 'P2').length;
  resolvedTodayCount = jobs.filter((j: any) => j.status === 'completed' && j.completedAt && (now - j.completedAt) < 24 * 60 * 60 * 1000).length;

  // Fetch alerts from escalation keys
  const alertEntries = await redis.lrange('ironbridge:alerts:active', 0, 20).catch(() => []);
  const alerts = Array.isArray(alertEntries) ? alertEntries.map((a: any, i: number) => {
    const alert = typeof a === 'string' ? JSON.parse(a) : a;
    return {
      id: alert.id || `alert-${i}`,
      severity: alert.severity || 'P2',
      message: alert.message || 'unknown alert',
      soldier: alert.soldier || 'system',
      timestamp: alert.timestamp || now,
      resolved: alert.resolved || false,
      resolvedAt: alert.resolved_at,
      resolvedBy: alert.resolved_by,
    };
  }) : [];

  // Sync state
  const allMatch = hotHash && warmHash && coldHash && hotHash === warmHash && warmHash === coldHash;
  const sync = {
    hot: hotHash ? 'ok' as const : 'unknown' as const,
    warm: warmHash ? 'ok' as const : 'unknown' as const,
    cold: coldHash ? 'ok' as const : 'unknown' as const,
    hotHash: hotHash || '',
    warmHash: warmHash || '',
    coldHash: coldHash || '',
    lastSync: now,
    matchPercent: allMatch ? 100 : hotHash || warmHash || coldHash ? 66 : 0,
    conflicts: 0,
  };

  // Format audit entries
  const audit = Array.isArray(auditEntries) ? auditEntries.map((entry: any, i: number) => ({
    id: entry[0] || `audit-${i}`,
    soldier: entry[1]?.soldier || 'system',
    action: entry[1]?.action || 'unknown',
    target: entry[1]?.target || '',
    result: entry[1]?.result,
    error: entry[1]?.error,
    sha: entry[1]?.entry_sha || '',
    level: entry[1]?.error ? 'error' as const : 'info' as const,
    timestamp: entry[1]?.timestamp || now,
    duration_ms: entry[1]?.duration_ms,
  })) : [];

  const onlineCount = soldiers.filter(s => s.status === 'online').length;
  const totalBuilt = Object.values(SOLDIER_META).reduce((sum, m) => sum + m.skillsBuilt, 0);
  const totalPlanned = Object.values(SOLDIER_META).reduce((sum, m) => sum + m.skillsPlanned, 0);

  // ===== SKILL REGISTRY (NEW) =====
  let skillRegistry: any[] = [];
  let registryTotalBuilt = totalBuilt;
  let registryTotalPlanned = totalPlanned;

  try {
    const registry = await redis.hgetall('ironbridge:skills:registry');
    if (registry && Object.keys(registry).length > 0) {
      skillRegistry = Object.entries(registry).map(([skillId, data]: [string, any]) => {
        try {
          const parsed = typeof data === 'string' ? JSON.parse(data) : data;
          return {
            id: skillId,
            soldier: parsed.soldier || 'unknown',
            status: parsed.status || 'draft',
            lastRun: parsed.lastRun || null,
            runCount: parsed.runCount || 0,
            ...parsed,
          };
        } catch {
          return { id: skillId, soldier: 'unknown', status: 'error', lastRun: null, runCount: 0 };
        }
      });
      // Recount from registry if present
      registryTotalBuilt = skillRegistry.filter((s: any) => s.status === 'deployed').length;
      registryTotalPlanned = skillRegistry.length;
    }
  } catch {
    // Fallback to SOLDIER_META counts
    skillRegistry = [];
  }

  const skillCoveragePercent = registryTotalPlanned > 0 ? Math.round((registryTotalBuilt / registryTotalPlanned) * 100) : 0;

  // ===== REVENUE METRICS (NEW) =====
  let revenueData = {
    coffey_x402_jobs: 0,
    coffey_x402_revenue_usd: 0,
    oracle_queries: 0,
    oracle_revenue_usd: 0,
    marketplace_sales: 0,
    marketplace_revenue_usd: 0,
    total_revenue_usd: 0,
  };

  try {
    const revHash = await redis.hgetall('ironbridge:revenue:daily');
    if (revHash) {
      revenueData = {
        coffey_x402_jobs: parseInt(revHash.coffey_x402_jobs as string) || 0,
        coffey_x402_revenue_usd: parseFloat(revHash.coffey_x402_revenue_usd as string) || 0,
        oracle_queries: parseInt(revHash.oracle_queries as string) || 0,
        oracle_revenue_usd: parseFloat(revHash.oracle_revenue_usd as string) || 0,
        marketplace_sales: parseInt(revHash.marketplace_sales as string) || 0,
        marketplace_revenue_usd: parseFloat(revHash.marketplace_revenue_usd as string) || 0,
        total_revenue_usd: parseFloat(revHash.total_revenue_usd as string) || 0,
      };
    }
  } catch {
    // Defaults already set
  }

  // ===== PLATFORM HEALTH (Bobby Fischer — every square) =====
  let platformHealth: any = { results: [], summary: { total: 0, up: 0, down: 0, degraded: 0, skipped: 0, criticalDown: [], allCriticalUp: true }, lastCheck: 0 };

  try {
    const health = await redis.get<string>('ironbridge:health:platforms');
    if (health) {
      const parsed = typeof health === 'string' ? JSON.parse(health) : health;
      platformHealth = parsed;
    }
  } catch {
    // Defaults already set
  }

  // Also read provider health (COFFEY existing)
  let providerHealth: any = { timestamp: 0, providers: {} };
  try {
    const ph = await redis.get<string>('ironbridge:providers:health');
    if (ph) {
      providerHealth = typeof ph === 'string' ? JSON.parse(ph) : ph;
    }
  } catch {}

  // ===== FISCHER RECOVERY STATUS (NEW) =====
  let fischerMoves = JSON.parse(JSON.stringify(DEFAULT_FISCHER_MOVES));

  try {
    const progress = await redis.get<string>('ironbridge:fischer:progress');
    if (progress) {
      try {
        const parsed = typeof progress === 'string' ? JSON.parse(progress) : progress;
        if (Array.isArray(parsed.moves)) {
          fischerMoves = parsed.moves;
        }
      } catch {
        // Use defaults
      }
    }
  } catch {
    // Use defaults
  }

  const completedMoves = fischerMoves.filter((m: any) => m.status === 'completed').length;
  const currentMove = fischerMoves.find((m: any) => m.status === 'in-progress') || fischerMoves.find((m: any) => m.status === 'pending') || fischerMoves[0] || null;

  // ===== AGENT GRAPH (NEW v3.1) =====
  // Build graph nodes from soldier data + edges from SKILL_ROUTING + Constitution hierarchy
  const DOMAIN_MAP: Record<string, string> = {
    dick: 'Commander', sarge: 'Security', hermes: 'Memory', coffey: 'Infra',
    ezra: 'QA', brooks: 'Code', oscar: 'Frontend', rachel: 'Intel',
    gary: 'Growth', paul: 'Product', ripley: 'Deploy', vetter: 'Discovery',
    athena: 'Improvement', candor: 'PDS', wick: 'PersonalSec', argus: 'Audit',
  };
  const HEARTBEAT_MAP: Record<string, number> = {
    dick: 30000, sarge: 60000, hermes: 60000, coffey: 60000, wick: 60000,
    ezra: 300000, brooks: 300000, oscar: 300000, rachel: 300000, gary: 300000,
    paul: 300000, ripley: 300000, vetter: 300000, athena: 300000, candor: 300000, argus: 300000,
  };
  const IDLE_MAP: Record<string, number> = {
    dick: 300000, hermes: 60000, sarge: 300000, coffey: 300000, wick: 300000,
    brooks: 600000, oscar: 600000, ezra: 600000, ripley: 600000, vetter: 600000, athena: 600000, argus: 600000,
    rachel: 900000, gary: 900000, paul: 900000, candor: 900000,
  };
  // Radial layout: DICK center, inner ring (core), outer ring (specialists)
  const POSITIONS: Record<string, [number, number]> = {
    dick: [400, 280], sarge: [280, 140], hermes: [520, 140], coffey: [200, 280], ezra: [600, 280],
    brooks: [150, 180], oscar: [650, 180], rachel: [100, 380], gary: [700, 380],
    paul: [250, 440], ripley: [550, 440], vetter: [130, 500], athena: [670, 500],
    candor: [350, 530], wick: [450, 530], argus: [400, 80],
  };

  const graphNodes = soldiers.map(s => ({
    id: s.id,
    name: s.name,
    role: s.role,
    status: s.status,
    domain: DOMAIN_MAP[s.id] || 'Unknown',
    skillsBuilt: s.skillsBuilt,
    skillsPlanned: s.skillsPlanned,
    heartbeatMs: HEARTBEAT_MAP[s.id] || 300000,
    idleCycleMs: IDLE_MAP[s.id] || 600000,
    x: POSITIONS[s.id]?.[0] || 400,
    y: POSITIONS[s.id]?.[1] || 300,
  }));

  const graphEdges = [
    // DICK dispatch routes (DECREE 2)
    ...(SOLDIERS.filter(s => s !== 'dick').map(s => ({
      from: 'dick', to: s, type: 'dispatch' as const,
      label: `${SOLDIER_META[s]?.role || s}`,
      weight: ['sarge','hermes','coffey','ezra'].includes(s) ? 8 : 5,
      active: soldiers.find(sol => sol.id === s)?.status === 'online',
    }))),
    // Escalation: SARGE → DICK (P0)
    { from: 'sarge', to: 'dick', type: 'escalation' as const, label: 'P0 alert', weight: 9, active: false },
    // Audit chains
    { from: 'ezra', to: 'dick', type: 'audit' as const, label: 'audit verify', weight: 6, active: false },
    { from: 'argus', to: 'dick', type: 'audit' as const, label: 'law compliance', weight: 6, active: false },
    // Sync: HERMES → DICK
    { from: 'hermes', to: 'dick', type: 'sync' as const, label: 'state sync', weight: 8, active: false },
    // Intel feed: RACHEL → GARY (LAW 178)
    { from: 'rachel', to: 'gary', type: 'intel' as const, label: 'intel feed', weight: 5, active: false },
    // Deploy chain: BROOKS → RIPLEY
    { from: 'brooks', to: 'ripley', type: 'deploy' as const, label: 'pre-deploy', weight: 5, active: false },
    // COFFEY health report
    { from: 'coffey', to: 'dick', type: 'sync' as const, label: 'health report', weight: 7, active: false },
    // VETTER → CANDOR pipeline
    { from: 'vetter', to: 'candor', type: 'intel' as const, label: 'vetted intel', weight: 3, active: false },
    // WICK → SARGE coordination
    { from: 'wick', to: 'sarge', type: 'escalation' as const, label: 'threat coord', weight: 5, active: false },
  ];

  const graphOnlineNodes = soldiers.filter(s => s.status === 'online').length;
  const graphActiveEdges = graphEdges.filter(e => e.active).length;

  const agentGraph = {
    nodes: graphNodes,
    edges: graphEdges,
    health: {
      totalNodes: 16,
      onlineNodes: graphOnlineNodes,
      totalEdges: graphEdges.length,
      activeEdges: graphActiveEdges,
      orphanRate: graphOnlineNodes === 0 ? 48.65 : Math.max(0, 100 - (graphOnlineNodes / 16) * 100),
      brokenLinks: graphOnlineNodes === 0 ? 76 : Math.max(0, 76 - graphOnlineNodes * 5),
      lastGraphSync: now,
    },
  };

  // ===== ARMY READINESS SCORE (NEW) =====
  // Score = (soldiers online / 16) * 0.3 + (skills built / planned) * 0.3 + (sync match / 100) * 0.2 + (resolved today / total) * 0.2
  const soldierScore = (onlineCount / SOLDIERS.length) * 0.3;
  const skillScore = (registryTotalPlanned > 0 ? (registryTotalBuilt / registryTotalPlanned) : 0) * 0.3;
  const syncScore = (sync.matchPercent / 100) * 0.2;
  const queueScore = (totalQueueCount > 0 ? (resolvedTodayCount / totalQueueCount) : 0) * 0.2;
  const readinessScore = Math.min(100, Math.round((soldierScore + skillScore + syncScore + queueScore) * 100));

  return {
    soldiers,
    sync,
    audit,
    jobs,
    alerts,
    queue: {
      tickets: jobs,
      totalCount: totalQueueCount,
      p0Count,
      p1Count,
      p2Count,
      resolvedToday: resolvedTodayCount,
    },
    skillRegistry: {
      skills: skillRegistry,
      totalBuilt: registryTotalBuilt,
      totalPlanned: registryTotalPlanned,
      coveragePercent: skillCoveragePercent,
    },
    revenue: {
      coffey: {
        label: 'COFFEY x402 Healing',
        jobsToday: Number(revenueData.coffey_x402_jobs) || 0,
        revenueToday: Number(revenueData.coffey_x402_revenue_usd) || 0,
        revenueAllTime: Number(revenueData.coffey_x402_revenue_usd) || 0,
      },
      oracle: {
        label: 'Oracle Interface (Clerk)',
        jobsToday: Number(revenueData.oracle_queries) || 0,
        revenueToday: Number(revenueData.oracle_revenue_usd) || 0,
        revenueAllTime: Number(revenueData.oracle_revenue_usd) || 0,
      },
      marketplace: {
        label: 'BNKR Skill Marketplace',
        jobsToday: Number(revenueData.marketplace_sales) || 0,
        revenueToday: Number(revenueData.marketplace_revenue_usd) || 0,
        revenueAllTime: Number(revenueData.marketplace_revenue_usd) || 0,
      },
      totalToday: Number(revenueData.total_revenue_usd) || 0,
      totalAllTime: Number(revenueData.total_revenue_usd) || 0,
    },
    fischer: {
      moves: fischerMoves,
      currentMove,
      completedCount: completedMoves,
      totalMoves: fischerMoves.length,
    },
    readiness: {
      score: readinessScore,
      breakdown: {
        soldiers: Math.round(soldierScore * 100) / 100,
        skills: Math.round(skillScore * 100) / 100,
        sync: Math.round(syncScore * 100) / 100,
        queue: Math.round(queueScore * 100) / 100,
      },
    },
    metrics: {
      soldiersOnline: onlineCount,
      soldiersTotal: SOLDIERS.length,
      tasksToday: jobs.length,
      tasksCompleted: jobs.filter((j: any) => j.status === 'completed').length,
      syncMatch: sync.matchPercent,
      p0Active: alerts.filter((a: any) => a.severity === 'P0' && !a.resolved).length,
      uptime: 0,
      lawCount: 345,
      decreeCount: 8,
      skillsBuilt: registryTotalBuilt,
      skillsPlanned: registryTotalPlanned,
      skillCount: registryTotalPlanned,
    },
    vision: {
      horizon: 'H1: Production-harden internal army (S59-S63) | H2: Agent OS on Base chain for BNKR ecosystem (S63+)',
      northStar: 'The army that runs itself becomes the army anyone can run.',
      revenue: 'COFFEY x402 healing + Oracle Interface (Clerk $0.004/query) + BNKR skill marketplace',
      partnerships: 'BNKR (LLM gateway + ecosystem), Clerk (federal court API), Solvr (social oracle)',
      commandDeck: 'ironbridge-command-deck.vercel.app',
    },
    platformHealth: {
      results: platformHealth.results || [],
      summary: platformHealth.summary || { total: 0, up: 0, down: 0, degraded: 0, skipped: 0, criticalDown: [], allCriticalUp: true },
      lastCheck: platformHealth.lastCheck || platformHealth.checkedAt || 0,
      providers: providerHealth.providers || {},
      providerTimestamp: providerHealth.timestamp || 0,
    },
    agentGraph,
    governance: {
      decrees: [
        { id: 1, title: 'No PII to Claude', text: 'Never send personally identifiable information to any LLM. Redact before transmission.' },
        { id: 2, title: 'DICK is Gatekeeper', text: 'All external communications route through DICK. No soldier speaks externally without authorization.' },
        { id: 3, title: 'No Computer Use on Personal Machines', text: 'No autonomous agent execution on personal machines. All soldiers run on Hetzner.' },
        { id: 4, title: 'Incognito Always', text: 'All browser sessions must be incognito. No persistent cookies or tracking.' },
        { id: 5, title: 'Rotate on Exposure', text: 'Any credential exposed in chat, logs, or code must be rotated immediately.' },
        { id: 6, title: 'Obsidian localhost:27124 Only', text: 'Obsidian vault accessed only via local REST API. No external exposure.' },
        { id: 7, title: 'API > UI Always', text: 'All operations must use API calls, never manual UI interaction. Automation first.' },
        { id: 8, title: 'Zero-Trust Runtime (Provisional)', text: 'All soldiers use TypeScript + ESLint + hardened template. No exceptions. Ratify formally at S63.' },
      ],
      constitution: 'CORE VALUES: Autonomy, Accountability, Security, Persistence, Hierarchy, Terse Execution.\n\nPRIORITY: PRIVACY > SECURITY > MEMORY\n\nThe army operates with full autonomy within the bounds of DECREES, CONSTITUTION, and LAWS. Every action is logged, every soldier is accountable, and the system tightens itself when idle.',
      lawCount: 345,
      protocolCount: 6,
      oathPoints: [
        'Follow DECREES without question',
        'Execute Constitution values',
        'Obey all LAWS (345)',
        'Implement PROTOCOLS exactly',
        'Report violations immediately',
        'Never self-police — the Empire Auditor exists',
        'PRIVACY > SECURITY > MEMORY',
        'Read before act. Declare what was read. Paper trail with SHA.',
        'When idle, work standby routine. Never sit dark. Security first.',
        'The mission comes first. IronBridge rises.',
        'Memory is sacred — encrypt, version, decay, never overwrite.',
        'Code is verified — TypeScript, tested, reviewed, deployed only by RIPLEY.',
        'When idle, the system still tightens itself.',
        'No soldier operates without a fallback. Every dependency has a degraded mode.',
        'Root of trust lives on iron. Upstash is servant, not master.',
        'Messages are signed. Compromised soldiers cannot impersonate command.',
        'The master key is never whole in one place except during controlled recovery.',
        'Logs are sanitized before they touch disk. Secrets never rest in plaintext.',
      ],
      recentLawChanges: [
        { law: 345, change: 'Added: Memory Resilience & Decay Protocol', session: 'S58' },
      ],
    },
    timestamp: now,
  };
}

export async function GET() {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      // Send initial state
      try {
        const state = await fetchDeckState(redis);
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(state)}\n\n`));
      } catch (err) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Initial fetch failed' })}\n\n`));
      }

      // Poll Upstash every 8 seconds and push updates
      const interval = setInterval(async () => {
        try {
          const state = await fetchDeckState(redis);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(state)}\n\n`));
        } catch {
          // Silent fail — client will see stale data
        }
      }, 8000);

      // Cleanup on client disconnect
      const cleanup = () => {
        clearInterval(interval);
        controller.close();
      };

      // Edge functions have a max duration — clean up before timeout
      setTimeout(cleanup, 25000); // Vercel Edge max ~30s for streaming
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
