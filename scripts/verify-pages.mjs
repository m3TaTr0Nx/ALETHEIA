import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..","_site");
async function read(rel){return fs.readFile(path.join(root,rel),"utf8")}
async function exists(rel){try{await fs.stat(path.join(root,rel));return true}catch{return false}}
function assert(ok,message){if(!ok)throw new Error(message)}

const index=await read("index.html");
const apparatus=await read("apparatus/index.html");
const apparatusJs=await read("assets/research-apparatus-static.js");
const demo=JSON.parse(await read("data/apparatus-demo.json"));
const standalone=await read("downloads/ALETHEIA_STANDALONE.html");
const manifest=JSON.parse(await read("manifest.webmanifest"));

for(const marker of ["Use highlight","Custom substitution fabric","Terminology sweep","Graph / hypergraph projection"]){
  assert(index.includes(marker),`PWA root missing: ${marker}`);
}
assert(index.includes("./service-worker.js"),"PWA root does not register service worker.");
assert(index.includes("./apparatus/"),"PWA root does not link to apparatus.");
assert(apparatus.includes("Aletheia Research Apparatus"),"Static apparatus HTML missing title.");
assert(!apparatusJs.includes('fetch("/api/'),"Static apparatus still depends on server API.");
assert(demo.minimumPairwiseSimilarity>0.75,"Static demo threshold is not above 0.75.");
assert(standalone.includes("Use highlight"),"Standalone file lost classic corpus explorer.");
assert(standalone.includes("Embedded Aletheia Research Apparatus"),"Standalone file does not embed apparatus.");
assert(!standalone.includes('fetch("/api/apparatus'),"Standalone apparatus still depends on server.");
assert(manifest.display==="standalone","Manifest display mode is not standalone.");
assert(await exists("icons/icon-192.png"),"192px icon missing.");
assert(await exists("icons/icon-512.png"),"512px icon missing.");
const icon192=await fs.readFile(path.join(root,"icons/icon-192.png"));
const icon512=await fs.readFile(path.join(root,"icons/icon-512.png"));
assert(icon192.subarray(1,4).toString()==="PNG","192px icon is not a PNG.");
assert(icon512.subarray(1,4).toString()==="PNG","512px icon is not a PNG.");
console.log(JSON.stringify({ok:true,minimumPairwiseSimilarity:demo.minimumPairwiseSimilarity,files:"verified"},null,2));
