export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method === 'GET') return res.status(200).json({ status: 'Dick webhook active' });

  const TG_TOKEN = process.env.TG_BOT_TOKEN;
  
  async function sendTG(chatId, text) {
    await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' })
    });
  }

  try {
    const update = req.body;
    if (update?.message?.text) {
      const chatId = update.message.chat.id;
      const text = update.message.text;
      
      if (text === '/ping') await sendTG(chatId, 'PONG 🏓');
      else if (text === '/status') await sendTG(chatId, '✅ *DICK ONLINE*\\nVercel Function\\nStatus: OPERATIONAL');
      else await sendTG(chatId, `Received: ${text}`);
    }
    res.status(200).json({ ok: true });
  } catch (e) {
    console.error('Error:', e);
    res.status(500).json({ error: e.message });
  }
}
