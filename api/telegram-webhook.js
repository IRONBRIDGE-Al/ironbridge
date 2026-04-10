export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(200).json({ ok: true });

  const { message } = req.body || {};
  if (!message?.text || !message?.chat?.id) return res.status(200).json({ ok: true });

  const chatId = message.chat.id.toString();
  const ownerChat = process.env.IB_CHAT_ID;
  
  // Only respond to owner
  if (chatId !== ownerChat) return res.status(200).json({ ok: true });

  const userMsg = message.text;

  try {
    // Call Groq as Dick
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + process.env.GROQ_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'You are Dick Commander, leader of the IronBridge army. You are direct, military-style, efficient. Boss is messaging you on Telegram. Respond concisely and execute orders. Keep responses under 500 chars.' },
          { role: 'user', content: userMsg }
        ],
        max_tokens: 200
      })
    });
    const groqData = await groqRes.json();
    const reply = groqData.choices?.[0]?.message?.content || 'No response from Groq';

    // Send reply to Telegram
    await fetch('https://api.telegram.org/bot' + process.env.IB_BOT + '/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: '🎖️ DICK: ' + reply })
    });

  } catch (e) {
    await fetch('https://api.telegram.org/bot' + process.env.IB_BOT + '/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: '❌ Error: ' + e.message })
    });
  }

  res.status(200).json({ ok: true });
}