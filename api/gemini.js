// api/gemini.js
// IronBridge Gemini Gateway - Tactical AI Layer
// Uses Boss's Gemini API key from Vercel env vars

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { pin, prompt, system } = req.body || {};
  
  // PIN verification
  const validPin = process.env.IB_PIN || 'ironbridge2026';
  if (pin !== validPin) {
    return res.status(401).json({ error: 'Invalid PIN' });
  }
  
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
  }
  
  try {
    // Call Gemini API
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + geminiKey,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          systemInstruction: system ? { parts: [{ text: system }] } : undefined
        })
      }
    );
    
    const data = await response.json();
    
    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }
    
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
    return res.status(200).json({ response: text });
    
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
