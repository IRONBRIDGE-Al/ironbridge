export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const agents = ['Dick','Oscar','Brooks','Nova','Rachel','Paul','Gary','Ezra'];
  const results = [];

  for (const agent of agents) {
    try {
      const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + process.env.GROQ_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: 'You are ' + agent + '. Say READY in 2 words.' }],
          max_tokens: 10
        })
      });
      const data = await r.json();
      results.push({ agent, status: data.choices?.[0]?.message?.content || 'OFFLINE' });
    } catch(e) {
      results.push({ agent, status: 'OFFLINE', error: e.message });
    }
  }

  res.status(200).json({ army: results });
}