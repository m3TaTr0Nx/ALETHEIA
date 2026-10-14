import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

function inside(root, candidate){
  const resolved=path.resolve(root,candidate);
  const base=path.resolve(root)+path.sep;
  if(resolved!==path.resolve(root) && !resolved.startsWith(base)) throw new Error("path_outside_diazai_mount");
  return resolved;
}

export class DiazAIReadOnlyProvider {
  constructor({root,indexPath=null,maxReadBytes=8*1024*1024}={}){
    if(!root) throw new Error("diazai_root_required");
    this.root=path.resolve(root);
    this.indexPath=indexPath;
    this.maxReadBytes=maxReadBytes;
    this.mode="read-only";
  }

  async stat(relativePath){
    const file=inside(this.root,relativePath);
    const s=await fs.stat(file);
    return {relativePath,size:s.size,isFile:s.isFile(),isDirectory:s.isDirectory(),mode:this.mode};
  }

  async readText(relativePath,{maxBytes=this.maxReadBytes}={}){
    const file=inside(this.root,relativePath);
    const s=await fs.stat(file);
    if(!s.isFile()) throw new Error("not_a_file");
    if(s.size>maxBytes) throw new Error("read_limit_exceeded");
    return fs.readFile(file,"utf8");
  }

  async readJson(relativePath,options={}){
    return JSON.parse(await this.readText(relativePath,options));
  }

  async hashFile(relativePath,{maxBytes=64*1024*1024}={}){
    const file=inside(this.root,relativePath);
    const s=await fs.stat(file);
    if(!s.isFile()) throw new Error("not_a_file");
    if(s.size>maxBytes) throw new Error("hash_limit_exceeded");
    const data=await fs.readFile(file);
    return crypto.createHash("sha256").update(data).digest("hex");
  }

  async loadIndex(){
    if(!this.indexPath) throw new Error("diazai_index_path_not_configured");
    const index=await this.readJson(this.indexPath);
    return {mode:this.mode,indexPath:this.indexPath,index};
  }

  async lookupClaim(claimId){
    const loaded=await this.loadIndex();
    const candidates=loaded.index.canonical_math??loaded.index.claims??[];
    const hit=candidates.find(item=>{
      if(Array.isArray(item)) return item[0]===claimId;
      return item.id===claimId||item.claim_id===claimId;
    });
    return hit?{mode:this.mode,claimId,record:hit}:null;
  }

  capabilities(){
    return {
      read:true,
      listIndex:true,
      hash:true,
      write:false,
      delete:false,
      promoteCanon:false,
      mutateCanon:false
    };
  }
}

export function createDiazAIProviderFromEnv(env=process.env){
  if(!env.DIAZAI_CANON_ROOT) return null;
  return new DiazAIReadOnlyProvider({
    root:env.DIAZAI_CANON_ROOT,
    indexPath:env.DIAZAI_CANON_INDEX||null
  });
}
