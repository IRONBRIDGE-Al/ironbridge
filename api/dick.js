export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const BOT = process.env.TELEGRAM_BOT_TOKEN;
  const OWNER = process.env.TELEGRAM_CHAT_ID;
  const UPSTASH_URL = process.env.UPSTASH_URL;
  const UPSTASH_TOKEN = process.env.UPSTASH_TOKEN;
  const RAILWAY_TOKEN = process.env.RAILWAY_TOKEN;

  async function tgSend(text) {
    await fetch('https://api.telegram.org/bot' + BOT + '/sendMessage', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: OWNER, text, parse_mode: 'HTML' })
    });
  }

  async function redisGet(key) {
    const r = await fetch(UPSTASH_URL + '/get/' + encodeURIComponent(key), {
      headers: { Authorization: 'Bearer ' + UPSTASH_TOKEN }
    });
    const d = await r.json();
    if (!d.result) return null;
    try { return JSON.parse(d.result); } catch(e) { return d.result; }
  }

  async function getArmy() {
    const q = 'query { project(id: "84730a82-9a41-46af-af8f-563e18d0cd25") { services { edges { node { name serviceInstances { edges { node { latestDeployment { status } } } } } } } } }';
    const r = await fetch('https://backboard.railway.app/graphql/v2', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + RAILWAY_TOKEN },
      body: JSON.stringify({ query: q })
    });
    const d = await r.json();
    const svcs = d.data?.project?.services?.edges || [];
    const up = svcs.filter(e => e.node.serviceInstances.edges[0]?.node.latestDeployment?.status === 'SUCCESS').length;
    const down = svcs.filter(e => e.node.serviceInstances.edges[0]?.node.latestDeployment?.status !== 'SUCCESS').map(e => e.node.name);
    return { total: svcs.length, up, down };
  }

  const cmd = (req.query.cmd || req.body?.cmd || 'status').toLowerCase().trim();

  if (cmd === 'status' || cmd === '/status') {
    const army = await getArmy();
    const dome = await redisGet('ironbridge:dome:status');
    const audit = await redisGet('ironbridge:audit:latest');
    const domeAge = dome ? Math.round((Date.now() - new Date(dome.ts)) / 60000) : 999;
    const findings = audit?.findings?.length || 0;
    const msg = '<b>IRONBRIDGE STATUS (Vercel Dick)</b>\n' +
      'Army: ' + army.up + '/' + army.total + ' UP\n' +
      (army.down.length ? 'DOWN: ' + army.down.join(', ') + '\n' : 'All online\n') +
      'Dome: ' + (dome?.severity || 'UNKNOWN') + ' (' + domeAge + 'min ago)\n' +
      'Audit findings: ' + findings + '\n' +
      'Source: Vercel (Railway-independent)\n' +
      'Time: ' + new Date().toISOString();
    await tgSend(msg);
    return res.status(200).json({ ok: true, msg });
  }

  if (cmd === 'dome' || cmd === '/dome') {
    const dome = await redisGet('ironbridge:dome:status');
    if (!dome) { await tgSend('Dome status unknown'); return res.status(200).json({ ok: true }); }
    let msg = '<b>DOME: ' + dome.severity + '</b>\n';
    (dome.breaches || []).forEach(b => { msg += 'ROOT: ' + b.root + '\nFIX: ' + b.fix + '\n'; });
    if (!dome.breaches?.length) msg += 'All clear.';
    await tgSend(msg);
    return res.status(200).json({ ok: true });
  }

  if (cmd === 'laws' || cmd === '/laws') {
    const laws = await redisGet('ironbridge:laws:latest');
    const msg = '<b>IRONBRIDGE LAWS</b>\nTotal: ' + (laws?.total || 180) + '\nLast updated: ' + (laws?.ts || 'S13') + '\nRead full list: ironbridge-memory/THANOS.md';
    await tgSend(msg);
    return res.status(200).json({ ok: true });
  }

  // Default: ping
  const army = await getArmy();
  await tgSend('<b>Dick (Vercel) online.</b>\nArmy: ' + army.up + '/' + army.total + '\nCommands: /api/dick?cmd=status|dome|laws');
  return res.status(200).json({ ok: true, army });
}