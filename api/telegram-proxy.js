// Telegram Proxy - server-side (LAW 319)
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,X-IB-PIN");
  if (req.method === "OPTIONS") return res.status(200).end();
  var pin = req.headers["x-ib-pin"] || req.query.pin;
  if (pin !== process.env.IB_PIN) return res.status(403).json({error:"DENIED"});
  var BOT = process.env.IB_BOT;
  var CHAT = process.env.IB_CHAT_ID;
  if (!BOT || !CHAT) return res.status(500).json({error:"TG creds missing"});
  try {
    var body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    var text = body.text;
    var chatId = body.chatId || CHAT;
    if (!text) return res.status(400).json({error:"text required"});
    var r2 = await fetch("https://api.telegram.org/bot"+BOT+"/sendMessage",{
      method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({chat_id:chatId,text:text,parse_mode:"HTML"})
    });
    var d = await r2.json();
    return res.status(200).json({ok:d.ok,messageId:d.result?d.result.message_id:null});
  } catch(e){return res.status(500).json({error:e.message});}
}
