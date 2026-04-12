// Dick v11 - Vercel Webhook Edition
// IronBridge Commander - LAW 22: use msg.chat.id

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(200).send('OK');
  
  const TG = process.env.IB_BOT;
  const UP_URL = process.env.UPSTASH_REST_URL;
  const UP_TOKEN = process.env.UPSTASH_REST_TOKEN;
  
  const update = req.body;
  if (!update?.message) return res.status(200).send('OK');
  
  const msg = update.message;
  const chatId = msg.chat.id; // LAW 22
  const text = msg.text || '';
  
  // Log
  await fetch(UP_URL + '/lpush/ironbridge:dick:log/' + encodeURIComponent(JSON.stringify({ts:Date.now(),from:chatId,text})), {
    headers: { Authorization: 'Bearer ' + UP_TOKEN }
  }).catch(()=>{});
  
  let reply = 'Received: ' + text;
  
  if (text === '/ping') reply = 'PONG';
  else if (text === '/status') reply = 'DICK ONLINE v11 Vercel';
  else if (text === '/help') reply = '/ping /status /army /brief';
  else if (text === '/army') {
    const r = await fetch(UP_URL + '/get/ironbridge:army:status', { headers: { Authorization: 'Bearer ' + UP_TOKEN } });
    const d = await r.json();
    reply = 'Army: ' + JSON.stringify(d.result || 'none');
  }
  else if (text === '/brief') {
    const r = await fetch(UP_URL + '/get/ironbridge:thanos:brief', { headers: { Authorization: 'Bearer ' + UP_TOKEN } });
    const d = await r.json();
    reply = 'Brief: ' + JSON.stringify(d.result || 'none');
  }
  
  await fetch('https://api.telegram.org/bot' + TG + '/sendMessage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: reply })
  });
  
  res.status(200).send('OK');
}
