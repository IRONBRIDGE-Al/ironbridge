// /api/dick.js -- Vercel Edge Function
// Dick v9.2 -- TG webhook handler
// Tokens from Vercel env vars. Never in source.

export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ok:true,v:'dick-v9.2',status:'online'}),
      {headers:{'Content-Type':'application/json'}});
  }
  var BOT = process.env.IB_BOT || '';
  var CHAT = process.env.IB_CHAT_ID || '';
  var body;
  try { body = await req.json(); } catch(e) {
    return new Response(JSON.stringify({ok:true}),{headers:{'Content-Type':'application/json'}});
  }
  if (!body || !body.message || !body.message.text) {
    return new Response(JSON.stringify({ok:true}),{headers:{'Content-Type':'application/json'}});
  }
  var msg = body.message;
  var fromId = msg.from ? String(msg.from.id) : '';
  if (fromId !== CHAT) {
    return new Response(JSON.stringify({ok:true}),{headers:{'Content-Type':'application/json'}});
  }
  var t = (msg.text || '').toLowerCase().trim();
  var reply = '';
  if (t === '/status' || t === 'status') {
    reply = 'DICK v9.2 ONLINE | Vercel Edge | PRIVACY-SECURITY-MEMORY | S21 | Boss->Thanos->Dick->Army';
  } else if (t === '/help' || t === 'help') {
    reply = 'Commands: /status /help /brief /ping';
  } else if (t === '/brief' || t === 'brief') {
    reply = 'DICK v9.2 | Vercel Edge | Laws:314 | Sanctum Protocol ACTIVE | S21';
  } else if (t === '/ping' || t === 'ping') {
    reply = 'PONG v9.2 | ' + new Date().toISOString();
  } else {
    reply = 'DICK v9.2 ack: ' + msg.text;
  }
  var url = 'https://api.telegram.org/bot' + BOT + '/sendMessage';
  try {
    await fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({chat_id: CHAT, text: reply})
    });
  } catch(e) { /* silent */ }
  return new Response(JSON.stringify({ok:true}),{headers:{'Content-Type':'application/json'}});
}
