// api/telegram.js - Secure Telegram API Proxy
export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'POST only' }), { status: 405 });
  }

  try {
    const { text, chat_id } = await req.json();
    const targetChat = chat_id || process.env.IB_CHAT_ID;
    
    const res = await fetch('https://api.telegram.org/bot' + process.env.IB_BOT + '/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: targetChat, text })
    });
    const data = await res.json();
    return new Response(JSON.stringify(data), { 
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
