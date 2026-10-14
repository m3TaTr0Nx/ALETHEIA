import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildApparatusDemo } from "./src/demo/apparatus-demo.mjs";
import { scoreGraphs, subsetTightness } from "./src/graph/multiscale.mjs";
import { buildGlassMatrix, buildCoreGlassChannels } from "./src/glass/lcm60-glass.mjs";
import { DIAZAI_DEMO_CANON } from "./src/diazai/static-canon.mjs";

const __dirname=path.dirname(fileURLToPath(import.meta.url));
const port=Number(process.env.PORT||3000);
const MAX_BODY=2*1024*1024;
const MIME={
  ".html":"text/html; charset=utf-8",
  ".js":"text/javascript; charset=utf-8",
  ".mjs":"text/javascript; charset=utf-8",
  ".css":"text/css; charset=utf-8",
  ".json":"application/json; charset=utf-8",
  ".svg":"image/svg+xml; charset=utf-8"
};

function sendJson(res,status,payload){
  const body=JSON.stringify(payload);
  res.writeHead(status,{"content-type":"application/json; charset=utf-8","cache-control":"no-store","x-content-type-options":"nosniff"});
  res.end(body);
}

async function readJson(req){
  let size=0; const chunks=[];
  for await(const chunk of req){
    size+=chunk.length;
    if(size>MAX_BODY)throw new Error("request_body_too_large");
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8")||"{}");
}

async function serveFile(res,file){
  const data=await fs.readFile(file);
  res.writeHead(200,{"content-type":MIME[path.extname(file)]??"application/octet-stream","cache-control":"no-cache","x-content-type-options":"nosniff"});
  res.end(data);
}

function safePath(urlPath){
  const decoded=decodeURIComponent(urlPath);
  if(decoded.includes(".."))throw new Error("bad_path");
  return decoded;
}

http.createServer(async(req,res)=>{
  try{
    const url=new URL(req.url,"http://localhost");

    if(req.method==="GET"&&url.pathname==="/api/health"){
      return sendJson(res,200,{ok:true,service:"aletheia",apparatus:true,version:"0.2.0-alpha"});
    }
    if(req.method==="GET"&&url.pathname==="/api/apparatus/demo"){
      return sendJson(res,200,buildApparatusDemo());
    }
    if(req.method==="GET"&&url.pathname==="/api/apparatus/glass"){
      return sendJson(res,200,buildGlassMatrix(buildCoreGlassChannels(),60));
    }
    if(req.method==="GET"&&url.pathname==="/api/apparatus/canon"){
      return sendJson(res,200,DIAZAI_DEMO_CANON);
    }
    if(req.method==="POST"&&url.pathname==="/api/apparatus/score"){
      const body=await readJson(req);
      if(!body.left||!body.right)throw new Error("left_and_right_graphs_required");
      return sendJson(res,200,scoreGraphs(body.left,body.right));
    }
    if(req.method==="POST"&&url.pathname==="/api/apparatus/tightness"){
      const body=await readJson(req);
      if(!body.graph||!Array.isArray(body.nodeIds))throw new Error("graph_and_nodeIds_required");
      return sendJson(res,200,subsetTightness(body.graph,body.nodeIds,{includeCarrier:!!body.includeCarrier}));
    }

    let pathname=url.pathname;
    if(pathname==="/apparatus"||pathname==="/apparatus/")pathname="/public/research-apparatus.html";
    if(pathname==="/")pathname="/index.html";
    const file=path.join(__dirname,safePath(pathname));
    await serveFile(res,file);
  }catch(error){
    if(error.code==="ENOENT")return sendJson(res,404,{error:"not_found"});
    sendJson(res,400,{error:"request_failed",message:error.message});
  }
}).listen(port,"0.0.0.0",()=>console.log(`Aletheia listening on ${port}`));
