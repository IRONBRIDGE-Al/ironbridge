var https = require('https');

module.exports = function(req, res) {
  if (req.method !== 'POST') return res.status(200).json({ok:true,v:'dick-v9.0'});
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
    reply = 'DICK v9.0 ONLINE | Vercel | PRIVACY-SECURITY-MEMORY | S21';
  } else if (t === '/help' || t === 'help') {
    reply = 'Commands: /status /help /brief /ping';
  } else if (t === '/brief' || t === 'brief') {
    reply = 'DICK v9.0 | Vercel | Boss->Thanos->Dick->Army | S21';
  } else if (t === '/ping' || t === 'ping') {
    reply = 'PONG v9.0 | ' + new Date().toISOString();
  } else {
    reply = 'DICK v9.0 ack: ' + msg.text;
  }
  var postData = JSON.stringify({chat_id: CHAT, text: reply});
  var r2 = https.request({
    hostname: 'api.telegram.org',
    path: '/bot' + BOT + '/sendMessage',
    method: 'POST',
    headers: {'Content-Type':'application/json','Content-Length':Buffer.byteLength(postData)}
  }, function(resp) {
    var d = '';
    resp.on('data', function(c) { d += c; });
    resp.on('end', function() { console.log('DICK_SENT:', d.substring(0,50)); });
  });
  r2.on('error', function(e) { console.error('DICK_ERR:', e.message); });
  r2.write(postData);
  r2.end();
  return res.status(200).json({ok:true});
};
