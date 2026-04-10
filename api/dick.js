export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { message } = req.body || {};
  if (!message) return res.status(400).json({ error: 'No message' });

  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + process.env.GROQ_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'You are Dick Commander of IronBridge army. Direct, military, efficient. Boss gives orders - execute.' },
          { role: 'user', content: message }
        ],
        max_tokens: 300
      })
    });
    const data = await r.json();
    res.status(200).json({ reply: data.choices?.[0]?.message?.content || 'No response' });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}