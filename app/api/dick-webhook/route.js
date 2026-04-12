// Dick Webhook - Vercel App Router
// app/api/dick-webhook/route.js

const TG_TOKEN = process.env.TG_BOT_TOKEN;

async function sendTG(chatId, text) {
  await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' })
  });
}

export async function POST(request) {
  try {
    const update = await request.json();
    if (update.message?.text) {
      const chatId = update.message.chat.id;
      const text = update.message.text;
      
      if (text === '/ping') {
        await sendTG(chatId, 'PONG 🏓');
      } else if (text === '/status') {
        await sendTG(chatId, '✅ *DICK ONLINE*\nVercel Function\nStatus: OPERATIONAL');
      } else {
        await sendTG(chatId, `Received: ${text}`);
      }
    }
    return Response.json({ ok: true });
  } catch (e) {
    console.error('Error:', e);
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({ status: 'Dick webhook active' });
}
