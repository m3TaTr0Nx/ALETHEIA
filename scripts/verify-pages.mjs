import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..","_site");
async function read(rel){return fs.readFile(path.join(root,rel),"utf8")}
async function exists(rel){try{await fs.stat(path.join(root,rel));return true}catch{return false}}
function assert(ok,message){if(!ok)throw new Error(message)}

function crc32(buffer){
  let crc=0xffffffff;
  for(const byte of buffer){
    crc^=byte;
    for(let bit=0;bit<8;bit+=1){
      crc=(crc>>>1) ^ ((crc&1)?0xedb88320:0);
    }
  }
  return (crc^0xffffffff)>>>0;
}

function validatePng(buffer,expectedWidth,expectedHeight){
  const signature=Buffer.from([137,80,78,71,13,10,26,10]);
  assert(buffer.length>32,"PNG is unexpectedly small.");
  assert(buffer.subarray(0,8).equals(signature),"Invalid PNG signature.");
  let offset=8,seenIHDR=false,seenIDAT=false,seenIEND=false;
  while(offset<buffer.length){
    assert(offset+12<=buffer.length,"Truncated PNG chunk header.");
    const length=buffer.readUInt32BE(offset); offset+=4;
    const type=buffer.subarray(offset,offset+4); offset+=4;
    assert(offset+length+4<=buffer.length,"Truncated PNG chunk payload.");
    const data=buffer.subarray(offset,offset+length); offset+=length;
    const storedCrc=buffer.readUInt32BE(offset); offset+=4;
    const calculated=crc32(Buffer.concat([type,data]));
    assert(storedCrc===calculated,`PNG CRC mismatch for ${type.toString("ascii")}.`);
    const name=type.toString("ascii");
    if(name==="IHDR"){
      assert(length===13,"Invalid IHDR length.");
      assert(data.readUInt32BE(0)===expectedWidth,`Unexpected PNG width: ${data.readUInt32BE(0)}`);
      assert(data.readUInt32BE(4)===expectedHeight,`Unexpected PNG height: ${data.readUInt32BE(4)}`);
      seenIHDR=true;
    }else if(name==="IDAT"){
      seenIDAT=true;
    }else if(name==="IEND"){
      assert(length===0,"Invalid IEND length.");
      seenIEND=true;
      assert(offset===buffer.length,"Trailing bytes after IEND.");
      break;
    }
  }
  assert(seenIHDR&&seenIDAT&&seenIEND,"PNG is missing required chunks.");
}


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
validatePng(icon192,192,192);
validatePng(icon512,512,512);
console.log(JSON.stringify({ok:true,minimumPairwiseSimilarity:demo.minimumPairwiseSimilarity,files:"verified"},null,2));
