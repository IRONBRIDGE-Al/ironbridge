const https=require('https');
function fetchIntel(){return new Promise((res,rej)=>{
  https.request({hostname:'api.github.com',path:'/repos/IRONBRIDGE-Al/ironbridge-memory/contents/logs/intel',method:'GET',headers:{Authorization:'token '+process.env.GH_TOKEN,'User-Agent':'IronBridge-Oracle/1.0',Accept:'application/vnd.github.v3+json'}},s=>{let d='';s.on('data',c=>d+=c);s.on('end',()=>{try{
    const files=JSON.parse(d);
    const rachels=files.filter(f=>f.name.startsWith('rachel-')).sort((a,b)=>b.name.localeCompare(a.name));
    if(!rachels.length){res({intel:'No intel yet.',timestamp:Date.now()});return;}
    https.request({hostname:'api.github.com',path:'/repos/IRONBRIDGE-Al/ironbridge-memory/contents/logs/intel/'+rachels[0].name,method:'GET',headers:{Authorization:'token '+process.env.GH_TOKEN,'User-Agent':'IronBridge-Oracle/1.0',Accept:'application/vnd.github.v3+json'}},s2=>{let d2='';s2.on('data',c=>d2+=c);s2.on('end',()=>{try{const f=JSON.parse(d2);res({intel:Buffer.from(f.content.replace(/\n/g,''),'base64').toString('utf8'),source:rachels[0].name,timestamp:Date.now()});}catch(e){rej(e);}});}).on('error',rej).end();
  }catch(e){rej(e);}});}).on('error',rej).end();
});}
module.exports=async(req,res)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  if(req.method==='OPTIONS'){res.status(200).end();return;}
  const paid=req.headers['x-payment']||req.query.paid;
  if(!paid){
    res.status(402).json({x402Version:1,error:'Payment Required',accepts:[{scheme:'exact',network:'base-mainnet',maxAmountRequired:'2000',resource:req.url,description:'IronBridge Intel Oracle',mimeType:'application/json',payTo:process.env.WALLET_ADDRESS||'0x0000000000000000000000000000000000000000',maxTimeoutSeconds:300,asset:'0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'}]});
    return;
  }
  try{const data=await fetchIntel();res.status(200).json({...data,oracle:'IronBridge Intel Oracle v1.0',powered_by:'Rachel v2.1'});}
  catch(e){res.status(500).json({error:e.message});}
};