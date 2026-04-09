export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL || '';
  const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || '';
  if (!UPSTASH_URL) return res.status(500).json({error:'Redis not configured'});

  const SOLDIERS = ['dick','oscar','brooks','rachel','nova','gary','paul','ezra',
    'ripley','sarge','spooner','hancock','toby','cipher','aegis','sentinel'];

  async function redisGet(key) {
    const r = await fetch(UPSTASH_URL+'/get/'+encodeURIComponent(key),
      {headers:{'Authorization':'Bearer '+UPSTASH_TOKEN}});
    const d = await r.json();
    return d.result;
  }

  const army = {};
  const STALE_MS = 5 * 60 * 1000;
  for (const s of SOLDIERS) {
    try {
      const hb = await redisGet('ironbridge:heartbeat:'+s);
      if (!hb) { army[s] = {status:'DEAD', age: null}; continue; }
      const data = JSON.parse(hb);
      const age = Date.now() - data.ts;
      army[s] = {status: age < STALE_MS ? 'ALIVE' : 'STALE', age: Math.floor(age/1000), version: data.version || '?'};
    } catch(e) { army[s] = {status:'ERR', age:null}; }
  }

  // Get AEGIS audit status
  let aegisStatus = null;
  try {
    const as = await redisGet('ironbridge:aegis:army-status');
    if (as) aegisStatus = JSON.parse(as);
  } catch(e) {}

  // Get law status
  let lawStatus = null;
  try {
    const ls = await redisGet('ironbridge:aegis:law-status');
    if (ls) lawStatus = JSON.parse(ls);
  } catch(e) {}

  res.status(200).json({
    ts: Date.now(),
    army,
    aegisStatus,
    lawStatus,
    alive: Object.values(army).filter(a=>a.status==='ALIVE').length,
    total: SOLDIERS.length
  });
}