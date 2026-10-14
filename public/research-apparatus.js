const $=s=>document.querySelector(s), $$=s=>Array.from(document.querySelectorAll(s));
let demo=null;

function pct(x){return `${(100*x).toFixed(1)}%`}
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function bar(label,value){return `<div class="bar-row"><span>${esc(label)}</span><span class="bar-track"><span class="bar-fill" style="display:block;width:${Math.max(0,Math.min(100,value*100))}%"></span></span><strong>${pct(value)}</strong></div>`}
function toast(msg){const e=$("#toast");e.textContent=msg;e.classList.add("on");setTimeout(()=>e.classList.remove("on"),1500)}
function pairName(score){const a=demo.graphs.find(g=>g.id===score.leftGraphId)?.source.title;const b=demo.graphs.find(g=>g.id===score.rightGraphId)?.source.title;return `${a} ↔ ${b}`}
function colorFor(category){return({authority:"#e4b95f",norm:"#f47d83",agent:"#bc9cff",recipient:"#75a7ff",capability:"#5ed5cf",event:"#e9a567",state:"#7bd48e"}[category]||"#9aa8b7")}

function showView(id){$$(".view").forEach(v=>v.classList.toggle("active",v.id===id));$$("#tabs button").forEach(b=>b.classList.toggle("active",b.dataset.view===id))}
$("#tabs").addEventListener("click",e=>{const b=e.target.closest("[data-view]");if(b)showView(b.dataset.view)});

function renderOverview(){
  $("#sourceCards").innerHTML=demo.graphs.map(g=>`<article class="source-card"><span class="tag">${esc(g.source.passage)}</span><h3>${esc(g.source.title)}</h3><p class="small">${esc(g.source.summary)}</p><div><span class="badge">ρ${g.mutation.rho}</span> <span class="badge mutation">μ${g.mutation.mu}</span> <span class="badge">σ${g.mutation.sigma}</span></div><p class="small"><a href="${g.source.url}" target="_blank" rel="noopener">source reference</a></p></article>`).join("");
  $("#minimumScore").textContent=pct(demo.minimumPairwiseSimilarity);
  $("#pairCards").innerHTML=demo.scores.map(s=>`<article class="pair-card"><strong>${esc(pairName(s))}</strong><div class="score">${pct(s.overall)}</div><div class="small">passage ${pct(s.scaleScores.passage)} · proposition ${pct(s.scaleScores.proposition)} · edge ${pct(s.scaleScores.edge)}</div></article>`).join("");
}

function graphOptions(select){
  select.innerHTML=demo.graphs.map(g=>`<option value="${g.id}">${esc(g.source.title)} — ${esc(g.source.passage)}</option>`).join("");
}
function pairOptions(select){
  select.innerHTML=demo.scores.map((s,i)=>`<option value="${i}">${esc(pairName(s))}</option>`).join("");
}

function renderGraph(){
  const graph=demo.graphs.find(g=>g.id===$("#graphSelect").value)||demo.graphs[0];
  $("#graphName").textContent=`${graph.source.title} · ${graph.source.passage}`;
  const svg=$("#graphSvg"), W=920,H=610, nodes=graph.nodes, pos=new Map();
  const groups=[...new Set(nodes.map(n=>n.category))];
  nodes.forEach((n,i)=>{
    const ring=groups.indexOf(n.category)%2;
    const radius=ring?210:155;
    const angle=i/nodes.length*Math.PI*2-.6;
    pos.set(n.id,{x:W/2+radius*Math.cos(angle),y:H/2+radius*Math.sin(angle)});
  });
  const lines=graph.edges.map(e=>{const a=pos.get(e.source),b=pos.get(e.target);return `<line data-edge="${e.id}" x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}"><title>${esc(e.relationClass)} · ${esc(e.sourceRelation)}</title></line>`}).join("");
  const dots=nodes.map(n=>{const p=pos.get(n.id);return `<g data-node="${n.id}" transform="translate(${p.x} ${p.y})"><circle r="13" fill="${colorFor(n.category)}"></circle><text y="-19">${esc(n.label)}</text><text y="30">${esc(n.category)}</text></g>`}).join("");
  svg.innerHTML=`<g>${lines}</g><g>${dots}</g>`;
  svg.querySelectorAll("[data-node]").forEach(el=>el.addEventListener("click",()=>{const n=graph.nodes.find(x=>x.id===el.dataset.node);$("#objectInspector").textContent=JSON.stringify(n,null,2)}));
  svg.querySelectorAll("[data-edge]").forEach(el=>el.addEventListener("click",()=>{svg.querySelectorAll("line").forEach(x=>x.classList.remove("selected"));el.classList.add("selected");const edge=graph.edges.find(x=>x.id===el.dataset.edge);$("#objectInspector").textContent=JSON.stringify(edge,null,2)}));
  const self=demo.selfSimilarity.find(x=>x.graphId===graph.id);
  $("#selfSimilarity").innerHTML=bar("topology",self.topologySelfSimilarity)+bar("relation",self.relationSelfSimilarity)+`<div class="small">${self.fractalCandidate?"recursive self-similarity candidate":"no fractal candidate"} · not a fractal-dimension proof</div>`;
}

function renderMultiscale(){
  const s=demo.scores[Number($("#pairSelect").value)||0];
  $("#scaleBars").innerHTML=bar("overall",s.overall)+bar("passage",s.scaleScores.passage)+bar("proposition",s.scaleScores.proposition)+bar("edge",s.scaleScores.edge);
  $("#scoreComponents").textContent=JSON.stringify(s.components,null,2);
  const graphId=$("#tightGraph").value||demo.graphs[0].id, subset=$("#subsetSelect").value;
  const r=demo.subsets[graphId][subset];
  $("#tightnessBars").innerHTML=
    bar("structural cohesion",r.structuralCohesion)+
    bar("hierarchy closeness",r.hierarchyCloseness)+
    bar("category purity",r.categoryPurity)+
    bar("semantic/structural",r.semanticStructuralTightness)+
    (r.carrierCompactness==null?"":bar("carrier compactness",r.carrierCompactness));
}

function renderGlass(){
  const g=demo.glass;
  $("#laneRows").innerHTML=g.channels.map(c=>`<div class="lane"><strong>${esc(c.label)}</strong><span class="badge">m=${c.lane}</span><span class="lane-ticks">${Array.from({length:60},(_,i)=>`<i class="tick ${c.ticks.includes(i+1)?"on":""}" title="t=${i+1}"></i>`).join("")}</span><span class="small">${c.fireCount}/60</span></div>`).join("");
  const opts=g.channels.map(c=>`<option value="${c.id}">${esc(c.label)} (m=${c.lane})</option>`).join("");
  $("#glassLeft").innerHTML=opts;$("#glassRight").innerHTML=opts;$("#glassRight").selectedIndex=Math.min(3,g.channels.length-1);
  renderGlassPair();
}
function renderGlassPair(){
  const left=$("#glassLeft").value,right=$("#glassRight").value;
  const pair=demo.glass.pairs.find(p=>(p.left===left&&p.right===right)||(p.left===right&&p.right===left));
  if(!pair){$("#pairGauge").innerHTML="<p class='small'>Select two different channels.</p>";$("#tickGrid").innerHTML="";return}
  $("#pairGauge").innerHTML=`<div class="metric-grid"><div class="metric"><strong>${pair.lcmWhen}</strong><div class="small">LCM · WHEN</div></div><div class="metric"><strong>${pair.gcdWhich}</strong><div class="small">GCD · WHICH</div></div><div class="metric"><strong>${pair.syncCount}</strong><div class="small">sync ticks / 60</div></div><div class="metric"><strong>${pair.pairGauge.normalized.toFixed(3)}</strong><div class="small">Aletheia gauge integral</div></div></div>`;
  const sync=new Set(pair.syncTicks);
  $("#tickGrid").innerHTML=Array.from({length:60},(_,i)=>`<i class="tick ${sync.has(i+1)?"sync":""}" title="t=${i+1}"></i>`).join("");
}

function renderCanon(){
  $("#canonClaims").innerHTML=demo.canon.claims.map(c=>`<article class="canon-card"><strong>${esc(c.id)} · ${esc(c.status)}</strong><p class="small">${esc(c.statement)}</p></article>`).join("");
  const cells=demo.carrierBundle.sheets.flatMap(s=>s.cells).slice(0,16);
  $("#carrierCells").innerHTML=cells.map(c=>`<div class="carrier-cell"><strong>${esc(c.lexeme)}</strong><div>#${c.index729}</div><div>F3⁶ [${c.carrier.address.join(",")}]</div><div>Z9³ [${c.carrier.chart.join(",")}]</div></div>`).join("");
  $("#firewall").textContent=JSON.stringify(demo.firewalls,null,2);
}
function renderClaims(){
  $("#claimCards").innerHTML=demo.claims.map(c=>`<article class="claim-card"><div><span class="badge">${esc(c.class)}</span> <span class="badge">${esc(c.inference.rule)}</span></div><h3>${esc(c.proposition)}</h3><div class="small">status: ${esc(c.epistemicStatus)} · mutation ρ${c.mutation.rho} μ${c.mutation.mu} σ${c.mutation.sigma}</div></article>`).join("");
}

async function init(){
  try{
    const health=await fetch("/api/health").then(r=>r.json());
    $("#healthDot").style.background=health.ok?"#7bd48e":"#f47d83";$("#healthText").textContent=health.ok?"engine online":"engine degraded";
    demo=await fetch("/api/apparatus/demo").then(r=>r.json());
    renderOverview();
    graphOptions($("#graphSelect"));graphOptions($("#tightGraph"));pairOptions($("#pairSelect"));
    $("#graphSelect").addEventListener("change",renderGraph);
    $("#pairSelect").addEventListener("change",renderMultiscale);$("#tightGraph").addEventListener("change",renderMultiscale);$("#subsetSelect").addEventListener("change",renderMultiscale);
    $("#glassLeft").addEventListener("change",renderGlassPair);$("#glassRight").addEventListener("change",renderGlassPair);
    renderGraph();renderMultiscale();renderGlass();renderCanon();renderClaims();
  }catch(error){
    $("#healthDot").style.background="#f47d83";$("#healthText").textContent="failed";
    toast(error.message);
  }
}
init();