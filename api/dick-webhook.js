// Dick Webhook - Vercel Edge Function
// Receives TG updates via webhook (no polling needed)

export const config = { runtime: 'edge' };

const TG_TOKEN = process.env.TG_BOT_TOKEN || process.env.IB_BOT;
const UPSTASH_URL = process.env.UPSTASH_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REST_TOKEN;

async function sendTG(chatId, text) {
  await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' })
  });
}

async function handleCommand(chatId, text) {
  if (text === '/ping') {
    await sendTG(chatId, 'PONG 🏓');
  } else if (text === '/status') {
    await sendTG(chatId, '✅ *DICK ONLINE*\nVercel Edge Function\nStatus: OPERATIONAL');
  } else if (text === '/help') {
    await sendTG(chatId, '*Dick Commands:*\n/status - Check status\n/ping - Pong test\n/army - Army status');
  } else if (text === '/army') {
    const res = await fetch(`${UPSTASH_URL}/get/ironbridge:army:status`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` }
    });
    const data = await res.json();
    await sendTG(chatId, `*Army:* ${JSON.stringify(data.result || 'No data')}`);
  } else {
    await sendTG(chatId, `Received: ${text}`);
  }
}

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('OK', { status: 200 });
  }
  
  try {
    const update = await req.json();
    if (update.message?.text) {
      await handleCommand(update.message.chat.id, update.message.text);
    }
    return new Response('OK', { status: 200 });
  } catch (e) {
    console.error('Error:', e);
    return new Response('Error', { status: 500 });
  }
}
