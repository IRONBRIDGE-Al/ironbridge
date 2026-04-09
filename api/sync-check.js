export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin','*');
  if(req.method==='OPTIONS'){res.status(200).end();return;}
  const GH=process.env.IB_GH_TOKEN||'';
  const UU=process.env.UPSTASH_REDIS_REST_URL||'';
  const UT=process.env.UPSTASH_REDIS_REST_TOKEN||'';
  const report={ts:new Date().toISOString(),stores:{},gaps:[],verdict:'UNKNOWN'};

  // Store 1: CLAUDE.md law count
  try{
    const cr=await fetch('https://api.github.com/repos/IRONBRIDGE-Al/ironbridge-memory/contents/CLAUDE.md',{
      headers:{'Authorization':'token '+GH,'Accept':'application/vnd.github.v3+json'}
    });
    const cd=await cr.json();
    if(cd.content){
      const txt=Buffer.from(cd.content.replace(/\n/g,''),'base64').toString('utf8');
      const nums=new Set();
      for(const m of txt.matchAll(/LAW (\d+):/g)) nums.add(parseInt(m[1]));
      const missing=[];
      for(let i=1;i<=195;i++) if(!nums.has(i)) missing.push(i);
      report.stores.claudeMD={lawCount:nums.size,expected:195,missing,sha:cd.sha.substring(0,8),ok:missing.length===0};
      if(missing.length>0) report.gaps.push('CLAUDE.md missing laws: '+missing.join(','));
    }
  }catch(e){report.stores.claudeMD={error:e.message};}

  // Store 2: Redis thanos:brief
  try{
    const rr=await fetch(UU+'/get/'+encodeURIComponent('ironbridge:thanos:brief'),{headers:{'Authorization':'Bearer '+UT}});
    const rd=await rr.json();
    if(rd.result){
      const b=JSON.parse(rd.result);
      const ageMin=Math.round((Date.now()-new Date(b.written_at).getTime())/60000);
      report.stores.redisBrief={written_at:b.written_at,ageMin,lawCount:b.law_count,ok:ageMin<30};
      if(ageMin>30) report.gaps.push('Redis brief stale: '+ageMin+'min old (Nova down?)');
    } else {
      report.stores.redisBrief={ok:false,error:'NULL - Nova never ran'};
      report.gaps.push('Redis brief NULL - Nova not running');
    }
  }catch(e){report.stores.redisBrief={error:e.message};}

  // Store 3: THANOS.md exists and has session state
  try{
    const tr=await fetch('https://api.github.com/repos/IRONBRIDGE-Al/ironbridge-memory/contents/THANOS.md',{
      headers:{'Authorization':'token '+GH,'Accept':'application/vnd.github.v3+json'}
    });
    const td=await tr.json();
    const hasState=td.content?Buffer.from(td.content.replace(/\n/g,''),'base64').toString('utf8').includes('SESSION STATE'):false;
    report.stores.thanosMD={sha:td.sha&&td.sha.substring(0,8),hasSessionState:hasState,ok:hasState};
    if(!hasState) report.gaps.push('THANOS.md missing SESSION STATE block');
  }catch(e){report.stores.thanosMD={error:e.message};}

  report.verdict=report.gaps.length===0?'ALL_SYNCED':'SYNC_GAP_DETECTED';
  res.status(report.gaps.length>0?200:200).json(report);
}