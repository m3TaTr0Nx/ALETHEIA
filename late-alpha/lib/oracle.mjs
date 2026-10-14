import dns from 'node:dns/promises';
import net from 'node:net';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

const MAX_BYTES = 12 * 1024 * 1024;
const ALLOWED_TYPES = [/^text\//i,/application\/json/i,/application\/(?:xml|xhtml\+xml)/i,/application\/pdf/i,/application\/octet-stream/i];

function isPrivateIPv4(ip) {
  const p = ip.split('.').map(Number);
  return p[0]===10 || p[0]===127 || (p[0]===169&&p[1]===254) || (p[0]===172&&p[1]>=16&&p[1]<=31) || (p[0]===192&&p[1]===168) || p[0]===0 || p[0]>=224;
}
function isPrivateIPv6(ip) {
  const s = ip.toLowerCase();
  return s==='::1' || s==='::' || s.startsWith('fc') || s.startsWith('fd') || s.startsWith('fe8') || s.startsWith('fe9') || s.startsWith('fea') || s.startsWith('feb');
}

export async function validatePublicUrl(input) {
  const u = new URL(input);
  if (!['http:','https:'].includes(u.protocol)) throw new Error('Only http/https URLs are permitted.');
  if (u.username || u.password) throw new Error('Credential-bearing URLs are not permitted.');
  if (['localhost','localhost.localdomain'].includes(u.hostname.toLowerCase())) throw new Error('Local hosts are blocked.');
  const answers = await dns.lookup(u.hostname,{all:true,verbatim:true});
  if (!answers.length) throw new Error('Host did not resolve.');
  for (const a of answers) {
    if (net.isIP(a.address)===4 && isPrivateIPv4(a.address)) throw new Error('Private/reserved IPv4 targets are blocked.');
    if (net.isIP(a.address)===6 && isPrivateIPv6(a.address)) throw new Error('Private/reserved IPv6 targets are blocked.');
  }
  return u;
}

async function fetchChecked(url, hops=0) {
  if (hops>4) throw new Error('Too many redirects.');
  const u = await validatePublicUrl(url);
  const res = await fetch(u,{redirect:'manual',headers:{'user-agent':'AletheiaOracle/0.9 (+research sandbox)'}});
  if ([301,302,303,307,308].includes(res.status)) {
    const loc=res.headers.get('location'); if(!loc) throw new Error('Redirect missing Location header.');
    return fetchChecked(new URL(loc,u).toString(),hops+1);
  }
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  const type=(res.headers.get('content-type')||'application/octet-stream').split(';')[0].trim();
  if (!ALLOWED_TYPES.some(re=>re.test(type))) throw new Error(`Content type ${type} is not allowed in the corpus sandbox.`);
  const len=Number(res.headers.get('content-length')||0); if(len>MAX_BYTES) throw new Error('Remote file exceeds sandbox size limit.');
  const reader=res.body.getReader(); const chunks=[]; let total=0;
  while(true){const {done,value}=await reader.read(); if(done)break; total+=value.byteLength; if(total>MAX_BYTES) throw new Error('Remote file exceeded sandbox size limit while streaming.'); chunks.push(Buffer.from(value));}
  return {url:u.toString(),finalUrl:res.url||u.toString(),type,bytes:Buffer.concat(chunks)};
}

function htmlToText(html) {
  return String(html)
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,' ')
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi,' ')
    .replace(/<[^>]+>/g,' ')
    .replace(/&nbsp;/gi,' ').replace(/&amp;/gi,'&').replace(/&lt;/gi,'<').replace(/&gt;/gi,'>')
    .replace(/\s+/g,' ').trim();
}

export async function oracleFetchToSandbox(url, sandboxRoot) {
  const out=await fetchChecked(url);
  const id=crypto.randomUUID(); const dir=path.join(sandboxRoot,id); await fs.mkdir(dir,{recursive:true});
  const sha=crypto.createHash('sha256').update(out.bytes).digest('hex');
  const ext = out.type.includes('html')?'.html':out.type.includes('json')?'.json':out.type.includes('pdf')?'.pdf':out.type.includes('xml')?'.xml':'.txt';
  const filename=`source${ext}`; await fs.writeFile(path.join(dir,filename),out.bytes);
  let extractedText=null;
  if (out.type.startsWith('text/') || out.type.includes('json') || out.type.includes('xml')) {
    const raw=out.bytes.toString('utf8'); extractedText=out.type.includes('html')?htmlToText(raw):raw;
    await fs.writeFile(path.join(dir,'extracted.txt'),extractedText,'utf8');
  }
  const manifest={sandboxId:id,sourceUrl:url,finalUrl:out.finalUrl,contentType:out.type,bytes:out.bytes.length,sha256:sha,filename,extractedTextAvailable:extractedText!=null,createdAt:new Date().toISOString(),executable:false};
  await fs.writeFile(path.join(dir,'manifest.json'),JSON.stringify(manifest,null,2));
  return {...manifest, extractedText};
}

export async function readSandboxManifest(sandboxRoot,id){
  const clean=String(id).replace(/[^a-zA-Z0-9-]/g,'');
  return JSON.parse(await fs.readFile(path.join(sandboxRoot,clean,'manifest.json'),'utf8'));
}
