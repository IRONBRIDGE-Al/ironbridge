// Session Boot API - assembles boot context server-side (LAW 319)
// Returns THANOS brief, laws, army status, env var check
// ZERO credentials in response
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,X-IB-PIN");
  if (req.method === "OPTIONS") return res.status(200).end();
  var pin = req.headers["x-ib-pin"] || req.query.pin;
  if (pin !== process.env.IB_PIN) return res.status(403).json({error:"ACCESS DENIED"});
  var GH = process.env.IB_GH_TOKEN;
  var RT = process.env.RAILWAY_TOKEN;
  var ORG = "IRONBRIDGE-Al";
  var PID = "84730a82-9a41-46af-af8f-563e18d0cd25";
  var errors = [];
  var context = {};
  // 1. Laws from CLAUDE.md
  try {
    var r1 = await fetch("https://api.github.com/repos/"+ORG+"/ironbridge-memory/contents/CLAUDE.md",
      {headers:{"Authorization":"token "+GH,"Accept":"application/vnd.github.v3.raw"}});
    if (r1.ok) {
      var text = await r1.text();
      var lawLines = text.split("\n").filter(function(l){return /^LAW\s+\d+/i.test(l.trim())});
      var nums = lawLines.map(function(l){return parseInt(l.match(/LAW\s+(\d+)/i)[1])}).sort(function(a,b){return a-b});
      var max = Math.max.apply(null,nums);
      var gaps = [];
      for(var i=nums[0];i<=max;i++){if(nums.indexOf(i)===-1)gaps.push(i)}
      context.laws = {count:lawLines.length,range:nums[0]+"-"+max,gaps:gaps,gapCount:gaps.length,sequential:gaps.length===0,laws:lawLines};
    } else errors.push("CLAUDE.md: "+r1.status);
  } catch(e){errors.push("CLAUDE.md: "+e.message)}
  // 2. Army status
  if (RT) {
    try {
      var q = "query{project(id:\""+PID+"\"){services{edges{node{id name deployments(first:1){edges{node{status createdAt}}}}}}}}";
      var r2 = await fetch("https://backboard.railway.app/graphql/v2",{method:"POST",headers:{"Authorization":"Bearer "+RT,"Content-Type":"application/json"},body:JSON.stringify({query:q})});
      var d = await r2.json();
      if(d.data) context.army = d.data.project.services.edges.map(function(e){var s=e.node;var dep=s.deployments.edges[0]?s.deployments.edges[0].node:null;return{name:s.name,status:dep?dep.status:"NO_DEPLOY",deployedAt:dep?dep.createdAt:null}});
      else errors.push("Railway query error");
    } catch(e){errors.push("Railway: "+e.message)}
  } else errors.push("RAILWAY_TOKEN not configured");
  // 3. Env var check (names only)
  context.envVarsConfigured = {
    IB_PIN:!!process.env.IB_PIN,IB_GH_TOKEN:!!process.env.IB_GH_TOKEN,
    IB_BOT:!!process.env.IB_BOT,IB_CHAT_ID:!!process.env.IB_CHAT_ID,
    RAILWAY_TOKEN:!!process.env.RAILWAY_TOKEN,
    UPSTASH_URL:!!process.env.UPSTASH_URL,UPSTASH_TOKEN:!!process.env.UPSTASH_TOKEN
  };
  return res.status(200).json({ok:true,timestamp:new Date().toISOString(),errors:errors,context:context});
}
