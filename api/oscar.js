export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const ts = new Date().toISOString();
  const checks = {
    timestamp: ts,
    service: 'oscar',
    platform: 'vercel',
    status: 'SUCCESS',
    checks: {
      env_vars: {
        GROQ_API_KEY: !!process.env.GROQ_API_KEY,
        IB_BOT: !!process.env.IB_BOT,
        IB_CHAT_ID: !!process.env.IB_CHAT_ID,
        UPSTASH_REST_URL: !!process.env.UPSTASH_REST_URL
      },
      runtime: process.version,
      region: process.env.VERCEL_REGION || 'unknown'
    }
  };

  // Alert Boss via Telegram if any env var missing
  const missing = Object.entries(checks.checks.env_vars).filter(([k, v]) => !v).map(([k]) => k);
  if (missing.length > 0 && process.env.IB_BOT && process.env.IB_CHAT_ID) {
    checks.status = 'WARNING';
    checks.missing = missing;
    try {
      await fetch(`https://api.telegram.org/bot${process.env.IB_BOT}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: process.env.IB_CHAT_ID,
          text: `OSCAR ALERT: Missing env vars: ${missing.join(', ')}`,
          parse_mode: 'HTML'
        })
      });
    } catch (e) { checks.tg_error = e.message; }
  }

  res.status(200).json(checks);
}