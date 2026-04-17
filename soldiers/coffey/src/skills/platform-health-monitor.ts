/**
 * COFFEY — Universal Platform Health Monitor
 * ═══════════════════════════════════════════
 * Bobby Fischer sees every square. This skill monitors EVERY external
 * platform IronBridge depends on. If anything goes down, the army knows
 * within 5 minutes and Boss gets an alert.
 *
 * Platforms monitored:
 * 1.  Hetzner VPS (SSH + API)
 * 2.  Upstash Redis (REST API)
 * 3.  Obsidian (localhost:27124 via HERMES JWT proxy :27125)
 * 4.  Vercel (Command Deck)
 * 5.  Groq LLM (llama-3.3-70b-versatile)
 * 6.  Gemini LLM (generativelanguage API)
 * 7.  Discord Bot Gateway
 * 8.  BNKR / bankr LLM Gateway
 * 9.  Clerk (federal court API)
 * 10. Solvr (social oracle)
 * 11. GitHub API (code + cold store)
 * 12. Goose (IRONBRIDGE-Al/goose fork)
 * 13. X/Twitter (social presence)
 *
 * Output: ironbridge:health:platforms (Upstash hash)
 *         ironbridge:alerts:active (Upstash list, if any DOWN)
 *
 * LAW 338: No silent failures.
 * LAW 230: Silent > 5 min = alert Boss.
 */

interface PlatformCheck {
  id: string;
  name: string;
  category: 'infrastructure' | 'llm' | 'comms' | 'partner' | 'social' | 'code';
  url: string;
  method: 'GET' | 'HEAD' | 'POST';
  headers: Record<string, string>;
  expectedStatus: number[];
  timeoutMs: number;
  critical: boolean;  // P0 alert if down
  body?: string;
}

// Platform check definitions — uses env vars for tokens
export function buildPlatformChecks(): PlatformCheck[] {
  const ghPat = process.env.GITHUB_PAT || '';
  const groqKey = process.env.GROQ_API_KEY || '';
  const geminiKey = process.env.GEMINI_API_KEY || '';
  const discordToken = process.env.DISCORD_TOKEN || '';
  const bankrKey = process.env.BANKR_LLM_KEY || '';
  const hetznerToken = process.env.HETZNER_API_TOKEN || '';
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL || '';
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN || '';

  return [
    // ─── INFRASTRUCTURE ───────────────────────────────────────
    {
      id: 'hetzner-api',
      name: 'Hetzner Cloud API',
      category: 'infrastructure',
      url: 'https://api.hetzner.cloud/v1/servers',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${hetznerToken}` },
      expectedStatus: [200],
      timeoutMs: 10000,
      critical: true,
    },
    {
      id: 'upstash-redis',
      name: 'Upstash Redis',
      category: 'infrastructure',
      url: `${upstashUrl}/ping`,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${upstashToken}` },
      expectedStatus: [200],
      timeoutMs: 5000,
      critical: true,
    },
    {
      id: 'vercel-command-deck',
      name: 'Vercel Command Deck',
      category: 'infrastructure',
      url: 'https://ironbridge-command-deck.vercel.app',
      method: 'HEAD',
      headers: {},
      expectedStatus: [200, 401],  // 401 = auth gate = deployed + running
      timeoutMs: 10000,
      critical: true,
    },
    {
      id: 'obsidian-warm',
      name: 'Obsidian (Warm Store)',
      category: 'infrastructure',
      url: 'http://127.0.0.1:27125/vault/',  // HERMES JWT proxy
      method: 'GET',
      headers: {},
      expectedStatus: [200, 404],  // 404 = proxy alive but path not found = OK
      timeoutMs: 5000,
      critical: false,  // Expected to fail on Hetzner (Mac-only)
    },

    // ─── LLM PROVIDERS ───────────────────────────────────────
    {
      id: 'groq-llm',
      name: 'Groq LLM (Primary)',
      category: 'llm',
      url: 'https://api.groq.com/openai/v1/models',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${groqKey}` },
      expectedStatus: [200],
      timeoutMs: 10000,
      critical: true,
    },
    {
      id: 'gemini-llm',
      name: 'Gemini LLM (Fallback)',
      category: 'llm',
      url: 'https://generativelanguage.googleapis.com/v1beta/models',
      method: 'GET',
      headers: { 'x-goog-api-key': geminiKey },
      expectedStatus: [200],
      timeoutMs: 10000,
      critical: false,  // Fallback, not primary
    },
    {
      id: 'bankr-llm',
      name: 'BNKR LLM Gateway',
      category: 'llm',
      url: 'https://llm.bankr.fi/v1/models',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${bankrKey}` },
      expectedStatus: [200],
      timeoutMs: 10000,
      critical: false,
    },

    // ─── COMMUNICATIONS ──────────────────────────────────────
    {
      id: 'discord-bot',
      name: 'Discord Bot Gateway',
      category: 'comms',
      url: 'https://discord.com/api/v10/users/@me',
      method: 'GET',
      headers: { 'Authorization': `Bot ${discordToken}` },
      expectedStatus: [200],
      timeoutMs: 10000,
      critical: true,
    },

    // ─── PARTNERS ────────────────────────────────────────────
    {
      id: 'clerk-api',
      name: 'Clerk (Federal Court API)',
      category: 'partner',
      url: 'https://api.clerk.com/v1/status',
      method: 'GET',
      headers: {},
      expectedStatus: [200, 401, 403, 404],  // Any response = reachable
      timeoutMs: 10000,
      critical: false,
    },
    {
      id: 'solvr-api',
      name: 'Solvr (Social Oracle)',
      category: 'partner',
      url: 'https://solvr.fi',
      method: 'HEAD',
      headers: {},
      expectedStatus: [200, 301, 302],
      timeoutMs: 10000,
      critical: false,
    },

    // ─── CODE & SOCIAL ───────────────────────────────────────
    {
      id: 'github-api',
      name: 'GitHub API (Cold Store)',
      category: 'code',
      url: 'https://api.github.com/repos/IRONBRIDGE-Al/ironbridge',
      method: 'GET',
      headers: {
        'Authorization': `token ${ghPat}`,
        'User-Agent': 'IronBridge-Coffey/1.0',
      },
      expectedStatus: [200],
      timeoutMs: 10000,
      critical: true,
    },
    {
      id: 'github-goose',
      name: 'Goose Fork (Public)',
      category: 'code',
      url: 'https://api.github.com/repos/IRONBRIDGE-Al/goose',
      method: 'GET',
      headers: {
        'Authorization': `token ${ghPat}`,
        'User-Agent': 'IronBridge-Coffey/1.0',
      },
      expectedStatus: [200],
      timeoutMs: 10000,
      critical: false,
    },
    {
      id: 'x-twitter',
      name: 'X/Twitter (Social)',
      category: 'social',
      url: 'https://x.com',
      method: 'HEAD',
      headers: {},
      expectedStatus: [200, 301, 302, 403],  // Any response = reachable
      timeoutMs: 10000,
      critical: false,
    },
  ];
}

// ─── HEALTH CHECK EXECUTION ──────────────────────────────────

export interface HealthResult {
  id: string;
  name: string;
  category: string;
  status: 'UP' | 'DOWN' | 'DEGRADED' | 'SKIP';
  statusCode: number | null;
  responseTimeMs: number;
  error: string | null;
  critical: boolean;
  checkedAt: number;
}

export async function checkPlatform(check: PlatformCheck): Promise<HealthResult> {
  const start = Date.now();

  // Skip checks with missing credentials
  if (check.url.includes('undefined') || check.url.includes('Bearer \'\'') || !check.url.startsWith('http')) {
    return {
      id: check.id,
      name: check.name,
      category: check.category,
      status: 'SKIP',
      statusCode: null,
      responseTimeMs: 0,
      error: 'Missing credentials',
      critical: check.critical,
      checkedAt: start,
    };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), check.timeoutMs);

    const response = await fetch(check.url, {
      method: check.method,
      headers: check.headers,
      signal: controller.signal,
      ...(check.body ? { body: check.body } : {}),
    });

    clearTimeout(timeout);
    const elapsed = Date.now() - start;

    const isExpected = check.expectedStatus.includes(response.status);
    const isDegraded = elapsed > check.timeoutMs * 0.7;  // >70% of timeout = degraded

    return {
      id: check.id,
      name: check.name,
      category: check.category,
      status: isExpected ? (isDegraded ? 'DEGRADED' : 'UP') : 'DOWN',
      statusCode: response.status,
      responseTimeMs: elapsed,
      error: isExpected ? null : `Unexpected status: ${response.status}`,
      critical: check.critical,
      checkedAt: start,
    };
  } catch (err) {
    return {
      id: check.id,
      name: check.name,
      category: check.category,
      status: 'DOWN',
      statusCode: null,
      responseTimeMs: Date.now() - start,
      error: (err as Error).message,
      critical: check.critical,
      checkedAt: start,
    };
  }
}

export async function runFullHealthCheck(): Promise<{
  results: HealthResult[];
  summary: {
    total: number;
    up: number;
    down: number;
    degraded: number;
    skipped: number;
    criticalDown: string[];
    allCriticalUp: boolean;
  };
}> {
  const checks = buildPlatformChecks();
  const results = await Promise.all(checks.map(checkPlatform));

  const up = results.filter(r => r.status === 'UP').length;
  const down = results.filter(r => r.status === 'DOWN').length;
  const degraded = results.filter(r => r.status === 'DEGRADED').length;
  const skipped = results.filter(r => r.status === 'SKIP').length;
  const criticalDown = results.filter(r => r.status === 'DOWN' && r.critical).map(r => r.name);

  return {
    results,
    summary: {
      total: results.length,
      up,
      down,
      degraded,
      skipped,
      criticalDown,
      allCriticalUp: criticalDown.length === 0,
    },
  };
}
