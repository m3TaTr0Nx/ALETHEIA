import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {DiazAIReadOnlyProvider} from "../src/diazai/read-only-provider.mjs";

test("DiazAI provider is read-only and rejects traversal",async()=>{
  const root=await fs.mkdtemp(path.join(os.tmpdir(),"aletheia-diazai-"));
  await fs.writeFile(path.join(root,"index.json"),JSON.stringify({canonical_math:[["M11","VERIFIED","LCM/GCD"]]}));
  const p=new DiazAIReadOnlyProvider({root,indexPath:"index.json"});
  assert.equal(p.capabilities().write,false);
  assert.equal((await p.lookupClaim("M11")).record[1],"VERIFIED");
  await assert.rejects(()=>p.readText("../outside.txt"),/path_outside_diazai_mount/);
});

test("DiazAI provider hashes without mutation",async()=>{
  const root=await fs.mkdtemp(path.join(os.tmpdir(),"aletheia-diazai-"));
  await fs.writeFile(path.join(root,"x.txt"),"canon");
  const p=new DiazAIReadOnlyProvider({root});
  const before=await fs.readFile(path.join(root,"x.txt"),"utf8");
  const hash=await p.hashFile("x.txt");
  const after=await fs.readFile(path.join(root,"x.txt"),"utf8");
  assert.equal(before,after);
  assert.equal(hash.length,64);
});
