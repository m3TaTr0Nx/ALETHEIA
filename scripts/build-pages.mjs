import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildApparatusDemo } from "../src/demo/apparatus-demo.mjs";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const out=path.join(root,"_site");

async function read(rel){return fs.readFile(path.join(root,rel),"utf8")}
async function write(rel,content){
  const file=path.join(out,rel);
  await fs.mkdir(path.dirname(file),{recursive:true});
  await fs.writeFile(file,content);
}
async function copy(src,dst){
  await fs.mkdir(path.dirname(path.join(out,dst)),{recursive:true});
  await fs.copyFile(path.join(root,src),path.join(out,dst));
}
function replaceInit(source,body){
  const start=source.indexOf("async function init(){");
  const end=source.lastIndexOf("init();");
  if(start<0||end<0)throw new Error("research apparatus init function not found");
  return source.slice(0,start)+body+"\ninit();\n";
}
function safeScriptLiteral(value){
  return JSON.stringify(value)
    .replaceAll("</script>","<\\/script>")
    .replaceAll("\u2028","\\u2028")
    .replaceAll("\u2029","\\u2029");
}

await fs.rm(out,{recursive:true,force:true});
await fs.mkdir(out,{recursive:true});

const demo=buildApparatusDemo();
await write("data/apparatus-demo.json",JSON.stringify(demo,null,2));

const manifest=await read("pwa/manifest.webmanifest");
const serviceWorker=await read("pwa/service-worker.js");
const enhancements=await read("pwa/enhancements.js");
await write("manifest.webmanifest",manifest);
await write("service-worker.js",serviceWorker);
await write("assets/pwa-enhancements.js",enhancements);
await write("icons/icon-192.png",Buffer.from((await read("pwa/icon-192.base64")).trim(),"base64"));
await write("icons/icon-512.png",Buffer.from((await read("pwa/icon-512.base64")).trim(),"base64"));

const apparatusCss=await read("public/research-apparatus.css");
const apparatusJs=await read("public/research-apparatus.js");
let apparatusHtml=await read("public/research-apparatus.html");

const staticInit=`async function init(){
  try{
    const health={ok:true,diazaiMounted:false};
    $("#healthDot").style.background="#7bd48e";
    $("#healthText").textContent="static PWA · local research demo";
    demo=await fetch("../data/apparatus-demo.json",{cache:"no-store"}).then(r=>{
      if(!r.ok)throw new Error("Could not load local apparatus demo.");
      return r.json();
    });
    const mount={
      configured:false,
      mode:"read-only",
      staticClient:true,
      message:"Attach the optional Docker/Node backend for live DiazAI canon and Wolfram services."
    };
    $("#diazaiMount").textContent=JSON.stringify(mount,null,2);
    renderOverview();
    graphOptions($("#graphSelect"));graphOptions($("#tightGraph"));pairOptions($("#pairSelect"));
    $("#graphSelect").addEventListener("change",renderGraph);
    $("#pairSelect").addEventListener("change",renderMultiscale);
    $("#tightGraph").addEventListener("change",renderMultiscale);
    $("#subsetSelect").addEventListener("change",renderMultiscale);
    $("#glassLeft").addEventListener("change",renderGlassPair);
    $("#glassRight").addEventListener("change",renderGlassPair);
    renderGraph();renderMultiscale();renderGlass();renderCanon();renderClaims();
  }catch(error){
    $("#healthDot").style.background="#f47d83";
    $("#healthText").textContent="static demo failed";
    toast(error.message);
  }
}`;
const staticApparatusJs=replaceInit(apparatusJs,staticInit);

apparatusHtml=apparatusHtml
  .replace('href="/public/research-apparatus.css"','href="../assets/research-apparatus.css"')
  .replace('src="/public/research-apparatus.js"','src="../assets/research-apparatus-static.js"')
  .replace("</head>",'<link rel="manifest" href="../manifest.webmanifest"><meta name="apple-mobile-web-app-capable" content="yes"></head>')
  .replace('<body>','<body><div style="max-width:1500px;margin:8px auto 0;padding:0 14px"><a href="../" style="color:#e4b95f;text-decoration:none">← Classic Corpus Explorer</a></div>');

await write("assets/research-apparatus.css",apparatusCss);
await write("assets/research-apparatus-static.js",staticApparatusJs);
await write("apparatus/index.html",apparatusHtml);

let classic=await read("index.html");
classic=classic
  .replace('href="/apparatus"','href="./apparatus/"')
  .replace("</head>",[
    '<link rel="manifest" href="./manifest.webmanifest">',
    '<meta name="apple-mobile-web-app-capable" content="yes">',
    '<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">',
    '<link rel="icon" type="image/png" sizes="192x192" href="./icons/icon-192.png">',
    "</head>"
  ].join(""))
  .replace("</body>",[
    '<script src="./assets/pwa-enhancements.js"></script>',
    '<script>if("serviceWorker" in navigator){window.addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(()=>{}));}</script>',
    "</body>"
  ].join(""));
await write("index.html",classic);
await write("404.html",classic);
await write(".nojekyll","");

const inlineInit=`async function init(){
  try{
    $("#healthDot").style.background="#7bd48e";
    $("#healthText").textContent="standalone · embedded research demo";
    demo=${JSON.stringify(demo)};
    $("#diazaiMount").textContent=JSON.stringify({
      configured:false,
      mode:"read-only",
      standalone:true,
      message:"Live DiazAI/Wolfram services require the optional research backend."
    },null,2);
    renderOverview();
    graphOptions($("#graphSelect"));graphOptions($("#tightGraph"));pairOptions($("#pairSelect"));
    $("#graphSelect").addEventListener("change",renderGraph);
    $("#pairSelect").addEventListener("change",renderMultiscale);
    $("#tightGraph").addEventListener("change",renderMultiscale);
    $("#subsetSelect").addEventListener("change",renderMultiscale);
    $("#glassLeft").addEventListener("change",renderGlassPair);
    $("#glassRight").addEventListener("change",renderGlassPair);
    renderGraph();renderMultiscale();renderGlass();renderCanon();renderClaims();
  }catch(error){
    $("#healthDot").style.background="#f47d83";
    $("#healthText").textContent="standalone demo failed";
    toast(error.message);
  }
}`;
const inlineApparatusJs=replaceInit(apparatusJs,inlineInit);
const apparatusDocument=apparatusHtml
  .replace('<link rel="stylesheet" href="../assets/research-apparatus.css">',`<style>${apparatusCss}</style>`)
  .replace('<script type="module" src="../assets/research-apparatus-static.js"></script>',`<script>${inlineApparatusJs}<\/script>`)
  .replace('<link rel="manifest" href="../manifest.webmanifest">',"")
  .replace('<a href="../" style="color:#e4b95f;text-decoration:none">← Classic Corpus Explorer</a>',"");

let standalone=await read("index.html");
standalone=standalone
  .replace('href="/apparatus" style="display:inline-block;margin-top:8px;color:#d8b86e">Open Research Apparatus →</a>',
    'href="#" id="standaloneApparatusOpen" style="display:inline-block;margin-top:8px;color:#d8b86e">Open Embedded Research Apparatus →</a>')
  .replace("</body>",`
<style>
#standaloneApparatusDialog{width:min(98vw,1500px);height:94vh;padding:0;border:1px solid #3b382e;border-radius:14px;background:#0b0f15}
#standaloneApparatusDialog::backdrop{background:#000b}
#standaloneApparatusFrame{width:100%;height:calc(100% - 48px);border:0;background:#0b0f15}
#standaloneClose{height:40px;margin:4px 8px;float:right}
</style>
<dialog id="standaloneApparatusDialog">
  <button id="standaloneClose" type="button">Close</button>
  <iframe id="standaloneApparatusFrame" title="Embedded Aletheia Research Apparatus"></iframe>
</dialog>
<script>
(()=>{
  const doc=${safeScriptLiteral(apparatusDocument)};
  const dialog=document.getElementById("standaloneApparatusDialog");
  const frame=document.getElementById("standaloneApparatusFrame");
  const open=document.getElementById("standaloneApparatusOpen");
  const close=document.getElementById("standaloneClose");
  open?.addEventListener("click",event=>{
    event.preventDefault();
    if(!frame.srcdoc)frame.srcdoc=doc;
    dialog.showModal();
  });
  close?.addEventListener("click",()=>dialog.close());
})();
</script>
</body>`);
await write("downloads/ALETHEIA_STANDALONE.html",standalone);

await write("version.json",JSON.stringify({
  schema:"aletheia.static-release.v1",
  version:"0.3.0-alpha",
  generatedAt:new Date().toISOString(),
  gitSha:process.env.GITHUB_SHA??null,
  minimumPairwiseSimilarity:demo.minimumPairwiseSimilarity,
  modes:["pwa","standalone-html","optional-backend"]
},null,2));

console.log(`Built ${out}`);
