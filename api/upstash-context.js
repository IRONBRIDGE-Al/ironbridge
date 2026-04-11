// IRONBRIDGE UPSTASH CONTEXT
// Fetches state from Upstash Redis for Gemini context
// Secure - keys in env vars only

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const { pin, keys } = req.method === 'GET' ? req.query : req.body;
  
  if (pin !== process.env.IB_PIN) {
    return res.status(401).json({ error: 'Invalid PIN' });
  }
  
  const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL || 'https://above-python-94996.upstash.io';
  const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
  
  if (!UPSTASH_TOKEN) {
    return res.status(500).json({ error: 'UPSTASH_REDIS_REST_TOKEN not configured' });
  }
  
  try {
    // Default keys to fetch for context
    const keysToFetch = keys ? keys.split(',') : [
      'ironbridge:thanos:brief',
      'ironbridge:session:active',
      'ironbridge:army:status',
      'ironbridge:boot:instructions'
    ];
    
    const results = {};
    
    for (const key of keysToFetch) {
      const response = await fetch(`${UPSTASH_URL}/get/${key}`, {
        headers: { 'Authorization': `Bearer ${UPSTASH_TOKEN}` }
      });
      const data = await response.json();
      results[key] = data.result || null;
    }
    
    return res.status(200).json({
      success: true,
      context: results,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
