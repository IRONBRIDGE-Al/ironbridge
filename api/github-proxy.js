// GitHub Proxy - server-side (LAW 319)
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,X-IB-PIN");
  if (req.method === "OPTIONS") return res.status(200).end();
  var pin = req.headers["x-ib-pin"] || req.query.pin;
  if (pin !== process.env.IB_PIN) return res.status(403).json({error:"DENIED"});
  var GH = process.env.IB_GH_TOKEN;
  if (!GH) return res.status(500).json({error:"IB_GH_TOKEN missing"});
  var ORG = "IRONBRIDGE-Al";
  var headers = {"Authorization":"token "+GH,"Accept":"application/vnd.github.v3+json","User-Agent":"IronBridge-CC"};
  try {
    var action = req.query.action || "read";
    var repo = req.query.repo;
    var path = req.query.path;
    if (!repo) return res.status(400).json({error:"repo required"});
    if (action === "read") {
      if (!path) return res.status(400).json({error:"path required"});
      var r2 = await fetch("https://api.github.com/repos/"+ORG+"/"+repo+"/contents/"+path,
        {headers:Object.assign({},headers,{"Accept":"application/vnd.github.v3.raw"})});
      if (!r2.ok) return res.status(r2.status).json({error:"GitHub "+r2.status});
      var content = await r2.text();
      return res.status(200).json({ok:true,content:content,path:path,repo:repo});
    }
    if (action === "tree") {
      var r3 = await fetch("https://api.github.com/repos/"+ORG+"/"+repo+"/git/trees/main?recursive=1",{headers:headers});
      var d = await r3.json();
      var files = (d.tree||[]).filter(function(f){return f.type==="blob"}).map(function(f){return f.path});
      return res.status(200).json({ok:true,files:files,repo:repo});
    }
    return res.status(400).json({error:"Unknown action. Use: read, tree"});
  } catch(e){return res.status(500).json({error:e.message});}
}
