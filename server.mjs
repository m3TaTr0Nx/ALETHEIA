import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 3000);

http.createServer(async (req,res)=>{
  try {
    const url = new URL(req.url, "http://localhost");
    const rel = url.pathname === "/" ? "/index.html" : url.pathname;
    if (rel.includes("..")) throw new Error("bad path");
    const file = path.join(__dirname, rel);
    const data = await fs.readFile(file);
    const type = file.endsWith(".html") ? "text/html; charset=utf-8"
      : file.endsWith(".json") ? "application/json; charset=utf-8"
      : "application/octet-stream";
    res.writeHead(200, {"content-type": type, "cache-control": "no-cache"});
    res.end(data);
  } catch (err) {
    res.writeHead(404, {"content-type":"application/json; charset=utf-8"});
    res.end(JSON.stringify({error:"not_found"}));
  }
}).listen(port, "0.0.0.0", ()=>console.log(`Aletheia listening on ${port}`));
