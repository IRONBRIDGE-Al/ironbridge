// IRONBRIDGE UPSTASH CONTEXT
// Fetches state from Upstash Redis

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  
  const { pin, keys } = req.method === 'GET' ? req.query : req.body;
  
  if (pin !== process.env.IB_PIN) return res.status(401).json({ error: 'Invalid PIN' });
  
  const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL || 'https://above-python-94996.upstash.io';
  const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
  
  if (!UPSTASH_TOKEN) return res.status(500).json({ error: 'UPSTASH not configured' });
  
  try {
    const keysToFetch = keys ? keys.split(',') : [
      'ironbridge:thanos:brief',
      'ironbridge:session:active',
      'ironbridge:army:status'
    ];
    
    const results = {};
    for (const key of keysToFetch) {
      const r = await fetch(UPSTASH_URL + '/get/' + key, {
        headers: { 'Authorization': 'Bearer ' + UPSTASH_TOKEN }
      });
      const d = await r.json();
      results[key] = d.result || null;
    }
    
    return res.status(200).json({ success: true, context: results });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}