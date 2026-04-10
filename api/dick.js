export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(200).json({ok:true,v:'dick-v9.0-webhook'});
  var BOT = process.env.IB_BOT || '';
  var CHAT = process.env.IB_CHAT_ID || '';
  var body = req.body;
  if (!body || !body.message) return res.status(200).json({ok:true});
  var msg = body.message;
  if (!msg.text) return res.status(200).json({ok:true});
  var fromId = msg.from ? String(msg.from.id) : '';
  if (fromId !== CHAT) return res.status(200).json({ok:true});
  var t = (msg.text || '').toLowerCase().trim();
  var reply = '';
  if (t === '/status' || t === 'status') {
    reply = 'DICK v9.0 ONLINE | Vercel Webhook | PRIVACY-SECURITY-MEMORY | S21';
  } else if (t === '/help' || t === 'help') {
    reply = 'Commands: /status /help /brief /ping';
  } else if (t === '/brief' || t === 'brief') {
    reply = 'DICK v9.0 BRIEF | Vercel | Boss->Thanos->Dick->Army | S21';
  } else if (t === '/ping' || t === 'ping') {
    reply = 'PONG v9.0 | ' + new Date().toISOString();
  } else {
    reply = 'DICK v9.0 ack: ' + msg.text;
  }
  var url = 'https://api.telegram.org/bot' + BOT + '/sendMessage';
  try {
    await fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({chat_id: CHAT, text: reply})
    });
  } catch(e) { console.error('DICK_ERR:', e.message); }
  return res.status(200).json({ok:true});
}
