// Railway Proxy v2 - server-side (LAW 319)
// No tokens reach browser
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,X-IB-PIN");
  if (req.method === "OPTIONS") return res.status(200).end();
  var pin = req.headers["x-ib-pin"] || req.query.pin;
  if (pin !== process.env.IB_PIN) return res.status(403).json({error:"DENIED"});
  var T = process.env.RAILWAY_TOKEN;
  if (!T) return res.status(500).json({error:"RAILWAY_TOKEN missing"});
  var PID = "84730a82-9a41-46af-af8f-563e18d0cd25";
  try {
    var q = "query{project(id:\""+PID+"\"){services{edges{node{id name updatedAt deployments(first:1){edges{node{id status createdAt}}}}}}}}";
    var r2 = await fetch("https://backboard.railway.app/graphql/v2",{method:"POST",headers:{"Authorization":"Bearer "+T,"Content-Type":"application/json"},body:JSON.stringify({query:q})});
    var d = await r2.json();
    if(d.errors) return res.status(502).json({error:"Railway API error"});
    var soldiers = d.data.project.services.edges.map(function(e){
      var s=e.node,dep=s.deployments.edges[0]?s.deployments.edges[0].node:null;
      return{id:s.id,name:s.name,status:dep?dep.status:"NO_DEPLOY",deployedAt:dep?dep.createdAt:null};
    });
    return res.status(200).json({ok:true,ts:new Date().toISOString(),count:soldiers.length,soldiers:soldiers});
  } catch(e){return res.status(500).json({error:e.message});}
}
