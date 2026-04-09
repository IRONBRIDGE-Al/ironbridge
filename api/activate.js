export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin','*');
  if (req.method !== 'POST') return res.status(405).end();
  const { key, caller } = req.body || {};
  const K1 = process.env.MASTER_KEY_1 || '';
  const K2 = process.env.MASTER_KEY_2 || '';
  if (!key || (key !== K1 && key !== K2)) return res.status(401).json({error:'unauthorized'});
  const GH_PAT = process.env.IB_GH_TOKEN || '';
  let prompt = 'Boot IronBridge. You are Thanos. Read ops/S16-SESSION-PROMPT.md from IRONBRIDGE-Al/ironbridge-memory first.';
  try {
    const pr = await fetch('https://api.github.com/repos/IRONBRIDGE-Al/ironbridge-memory/contents/ops/S16-SESSION-PROMPT.md',{
      headers:{'Authorization':'token '+GH_PAT,'Accept':'application/vnd.github.v3+json'}
    });
    const pd = await pr.json();
    if (pd.content) prompt = Buffer.from(pd.content.replace(/\n/g,''),'base64').toString('utf8').substring(0,4000);
  } catch(e){}
  const TG = process.env.TG_BOT||''; const CHAT = process.env.TG_CHAT||'';
  const who = caller || 'unknown';
  if(TG&&CHAT){
    await fetch('https://api.telegram.org/bot'+TG+'/sendMessage',{
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({chat_id:CHAT,text:'[MASTER KEY ACTIVATED] by '+who+' at '+new Date().toISOString()+'\nThanos boot injected. Session starting.'})      
    });
  }
  res.status(200).json({activated:true,caller:who,ts:Date.now(),promptLen:prompt.length});
}