(function() {
  "use strict";
  function loadLiveStatus() {
    fetch("/api/status").then(function(r){return r.json();}).then(function(d){
      var army = d.army || {};
      Object.keys(army).forEach(function(name) {
        var info = army[name];
        var cls = info.status==="ALIVE"?"live":info.status==="STALE"?"standby":"down";
        var lbl = info.status==="ALIVE"?"LIVE":info.status==="STALE"?"STALE":"DOWN";
        document.querySelectorAll(".ab").forEach(function(badge){
          var p=badge.parentElement;
          if(p&&p.innerText&&p.innerText.toLowerCase().indexOf(name)>-1){
            badge.className="ab "+cls; badge.innerText=lbl;
            badge.title=name+": "+(info.age?info.age+"s ago":"no heartbeat");
          }
        });
      });
      var alive=Object.values(army).filter(function(a){return a.status==="ALIVE";}).length;
      var el=document.getElementById("agent-count");
      if(el) el.innerText=alive+" / "+Object.keys(army).length;
    }).catch(function(e){console.warn("[CC]",e.message);});
  }
  loadLiveStatus();
  setInterval(loadLiveStatus,60000);
  window.ccDecide=function(decision,item){
    var pin=window._p||prompt("Owner PIN:");
    if(!pin) return; window._p=pin;
    fetch("/api/approve",{method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({decision:decision,item:item,pin:pin,action:"gate-decision"})
    }).then(function(r){return r.json();}).then(function(d){
      alert(d.ok?"Sent: "+decision+" on "+item:"Error: "+(d.error||"fail"));
    }).catch(function(e){alert("Failed: "+e.message);});
  };
})()