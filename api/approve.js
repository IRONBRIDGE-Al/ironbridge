export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') return res.status(405).json({error:'POST only'});

  const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL || '';
  const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || '';
  const TG_BOT = process.env.TG_BOT || process.env.IB_BOT || '';
  const TG_CHAT = process.env.TG_CHAT || process.env.IB_CHAT_ID || '';
  const IB_PIN = process.env.IB_PIN || '';

  const {action, decision, item, pin} = req.body || {};
  if (pin !== IB_PIN) return res.status(401).json({error:'Unauthorized'});

  async function redisSet(key, value) {
    await fetch(UPSTASH_URL+'/set/'+encodeURIComponent(key)+'/'+encodeURIComponent(value),
      {headers:{'Authorization':'Bearer '+UPSTASH_TOKEN}});
  }

  const cmd = {action, decision, item, ts: Date.now(), source: 'command-center'};
  await redisSet('ironbridge:inbox:dick', JSON.stringify(cmd));

  // Also notify Dick via TG
  if (TG_BOT && TG_CHAT) {
    const body = JSON.stringify({chat_id:TG_CHAT, text:'[CC] Owner decision: '+decision+' on '+item});
    await fetch('https://api.telegram.org/bot'+TG_BOT+'/sendMessage',
      {method:'POST',headers:{'Content-Type':'application/json'},body});
  }

  res.status(200).json({ok:true, cmd});
}