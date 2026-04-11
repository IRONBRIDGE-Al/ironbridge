// IRONBRIDGE GEMINI GATEWAY
// Secure API route - keys in env vars only

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  
  const { prompt, pin, context } = req.body;
  
  if (pin !== process.env.IB_PIN) return res.status(401).json({ error: 'Invalid PIN' });
  if (!prompt) return res.status(400).json({ error: 'prompt required' });
  
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
  
  try {
    let fullPrompt = context ? 'CONTEXT:\n' + context + '\n\nREQUEST:\n' + prompt : prompt;
    
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': GEMINI_API_KEY },
        body: JSON.stringify({ contents: [{ parts: [{ text: fullPrompt }] }] })
      }
    );
    
    const data = await response.json();
    if (data.error) return res.status(500).json({ error: data.error.message });
    
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return res.status(200).json({ success: true, response: text, model: 'gemini-2.5-flash' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}