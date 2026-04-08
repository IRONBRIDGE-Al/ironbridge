// api/railway-proxy.js
// Server-side proxy for Railway GraphQL API
// RAILWAY_TOKEN is never exposed to the client
const https = require('https');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://ironbridge-jade.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

  const RAILWAY_TOKEN = process.env.RAILWAY_TOKEN;
  if (!RAILWAY_TOKEN) { res.status(500).json({ error: 'Railway not configured' }); return; }

  // Verify PIN before proxying
  const IB_PIN = process.env.IB_PIN;
  const pin = req.headers['x-ib-pin'] || req.body?.pin;
  if (IB_PIN && pin !== IB_PIN) { res.status(401).json({ error: 'Unauthorized' }); return; }

  try {
    const body = JSON.stringify(req.body);
    const options = {
      hostname: 'backboard.railway.com',
      path: '/graphql/v2',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + RAILWAY_TOKEN,
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const result = await new Promise((resolve, reject) => {
      const proxyReq = https.request(options, (proxyRes) => {
        let data = '';
        proxyRes.on('data', (chunk) => { data += chunk; });
        proxyRes.on('end', () => { try { resolve(JSON.parse(data)); } catch(e) { resolve({ raw: data }); } });
      });
      proxyReq.on('error', reject);
      proxyReq.write(body);
      proxyReq.end();
    });

    res.status(200).json(result);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
};