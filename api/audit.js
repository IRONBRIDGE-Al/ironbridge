// /api/audit.js -- Vercel serverless -- proxies Redis audit data to CC
// Keeps UPSTASH_TOKEN server-side. CC calls this. LAW 146.
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const UPSTASH_URL = process.env.UPSTASH_URL;
  const UPSTASH_TOKEN = process.env.UPSTASH_TOKEN;

  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    return res.status(500).json({ error: 'UPSTASH not configured', root: 'UPSTASH_URL or UPSTASH_TOKEN missing from Vercel env', fix: 'Add both vars in Vercel dashboard' });
  }

  const keys = [
    'ironbridge:audit:latest',
    'ironbridge:thanos:brief',
    'ironbridge:hancock:last_clean'
  ];

  const results = {};
  for (const key of keys) {
    try {
      const r = await fetch(UPSTASH_URL + '/get/' + key, {
        headers: { Authorization: 'Bearer ' + UPSTASH_TOKEN }
      });
      const data = await r.json();
      const raw = data.result;
      if (!raw) { results[key] = null; continue; }
      try {
        // Handle both direct JSON and array-wrapped JSON (Upstash quirk)
        const parsed = JSON.parse(raw);
        results[key] = Array.isArray(parsed) ? JSON.parse(parsed[0]) : parsed;
      } catch(e) {
        results[key] = raw;
      }
    } catch(e) {
      results[key] = { error: e.message };
    }
  }

  // Compute staleness
  const now = Date.now();
  const audit = results['ironbridge:audit:latest'];
  const brief = results['ironbridge:thanos:brief'];

  const auditAge = audit && audit.timestamp ? Math.round((now - new Date(audit.timestamp)) / 60000) : null;
  const briefAge = brief && brief.written_at ? Math.round((now - new Date(brief.written_at)) / 60000) : null;

  return res.status(200).json({
    fetched_at: new Date().toISOString(),
    audit: audit,
    audit_age_min: auditAge,
    audit_stale: auditAge === null || auditAge > 6,
    brief: brief,
    brief_age_min: briefAge,
    brief_stale: briefAge === null || briefAge > 30,
    hancock: results['ironbridge:hancock:last_clean']
  });
}