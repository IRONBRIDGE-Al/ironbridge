export default async function handler(req, res) {
  const BOT = process.env.TELEGRAM_BOT_TOKEN;
  const OWNER = process.env.TELEGRAM_CHAT_ID;
  const UPSTASH_URL = process.env.UPSTASH_URL;
  const UPSTASH_TOKEN = process.env.UPSTASH_TOKEN;

  async function redisGet(key) {
    const r = await fetch(UPSTASH_URL + '/get/' + encodeURIComponent(key), {
      headers: { Authorization: 'Bearer ' + UPSTASH_TOKEN }
    });
    const d = await r.json();
    if (!d.result) return null;
    try { return JSON.parse(d.result); } catch(e) { return d.result; }
  }

  async function tgAlert(msg) {
    await fetch('https://api.telegram.org/bot' + BOT + '/sendMessage', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: OWNER, text: msg, parse_mode: 'HTML' })
    });
  }

  const issues = [];

  // Check Dome freshness
  const dome = await redisGet('ironbridge:dome:status');
  const domeAge = dome ? (Date.now() - new Date(dome.ts)) / 60000 : 9999;
  if (domeAge > 10) issues.push('ROOT: Sarge/Dome silent ' + Math.round(domeAge) + 'min\nFIX: Ripley redeploys sarge\nLAW: 148');

  // Check brief freshness
  const brief = await redisGet('ironbridge:thanos:brief');
  const briefAge = brief ? (Date.now() - new Date(brief.written_at)) / 60000 : 9999;
  if (briefAge > 35) issues.push('ROOT: Nova brief stale ' + Math.round(briefAge) + 'min\nFIX: Ripley redeploys nova\nLAW: 149');

  // Check audit freshness
  const audit = await redisGet('ironbridge:audit:latest');
  const auditAge = audit ? (Date.now() - new Date(audit.timestamp)) / 60000 : 9999;
  if (auditAge > 10) issues.push('ROOT: Spooner audit stale ' + Math.round(auditAge) + 'min\nFIX: Ripley redeploys spooner\nLAW: 134');

  if (issues.length > 0) {
    const msg = '<b>VERCEL WATCHDOG -- RAILWAY MAY BE DOWN</b>\n' + issues.join('\n---\n') + '\nVercel Dick available: ironbridge-jade.vercel.app/api/dick?cmd=status';
    await tgAlert(msg);
  }

  return res.status(200).json({ ok: true, issues: issues.length, domeAge: Math.round(domeAge), briefAge: Math.round(briefAge) });
}