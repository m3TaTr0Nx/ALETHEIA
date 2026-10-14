(()=> {
  const KEY_PREFIX="aletheia";
  let installPrompt=null;

  const tray=document.createElement("div");
  tray.setAttribute("role","group");
  tray.setAttribute("aria-label","Aletheia application controls");
  tray.style.cssText="position:fixed;right:10px;bottom:10px;z-index:40;display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end;max-width:min(92vw,680px);padding:7px;background:#11110fe8;border:1px solid #3b382e;border-radius:12px;backdrop-filter:blur(12px)";

  function button(label,fn){
    const b=document.createElement("button");
    b.type="button"; b.textContent=label;
    b.style.cssText="min-height:40px;padding:.55rem .7rem;border-radius:9px";
    b.addEventListener("click",fn);
    tray.appendChild(b);
    return b;
  }

  const installButton=button("Install Aletheia",async()=>{
    if(!installPrompt) return;
    installPrompt.prompt();
    await installPrompt.userChoice;
    installPrompt=null;
    installButton.hidden=true;
  });
  installButton.hidden=true;

  button("Research Apparatus",()=>{ location.href="./apparatus/"; });

  button("Persistent storage",async()=>{
    if(!navigator.storage?.persist){
      alert("Persistent browser storage is not available in this browser.");
      return;
    }
    const already=await navigator.storage.persisted();
    const granted=already || await navigator.storage.persist();
    alert(granted
      ? "Persistent storage is enabled for this installed site."
      : "The browser did not grant persistent storage. Use Export/Backup for important corpora.");
  });

  button("Backup local state",()=>{
    const state={schema:"aletheia.browser-backup.v1",exportedAt:new Date().toISOString(),localStorage:{}};
    for(let i=0;i<localStorage.length;i+=1){
      const key=localStorage.key(i);
      if(key?.toLowerCase().startsWith(KEY_PREFIX)) state.localStorage[key]=localStorage.getItem(key);
    }
    const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"});
    const a=document.createElement("a");
    a.href=URL.createObjectURL(blob);
    a.download="aletheia-browser-backup-"+Date.now()+".json";
    a.click();
    URL.revokeObjectURL(a.href);
  });

  const restoreInput=document.createElement("input");
  restoreInput.type="file";
  restoreInput.accept=".json,application/json";
  restoreInput.hidden=true;
  restoreInput.addEventListener("change",async()=>{
    const file=restoreInput.files?.[0]; if(!file) return;
    try{
      const payload=JSON.parse(await file.text());
      if(payload.schema!=="aletheia.browser-backup.v1" || !payload.localStorage) throw new Error("Unsupported backup schema.");
      for(const [key,value] of Object.entries(payload.localStorage)) localStorage.setItem(key,String(value));
      location.reload();
    }catch(error){ alert("Restore failed: "+error.message); }
  });
  document.body.appendChild(restoreInput);
  button("Restore backup",()=>restoreInput.click());

  const download=document.createElement("a");
  download.href="./downloads/ALETHEIA_STANDALONE.html";
  download.textContent="Standalone HTML";
  download.download="ALETHEIA_STANDALONE.html";
  download.style.cssText="display:inline-flex;align-items:center;min-height:40px;padding:.55rem .7rem;color:#f0ecdf;background:#10100e;border:1px solid #3b382e;border-radius:9px;text-decoration:none";
  tray.appendChild(download);

  window.addEventListener("beforeinstallprompt",event=>{
    event.preventDefault();
    installPrompt=event;
    installButton.hidden=false;
  });
  window.addEventListener("appinstalled",()=>{ installPrompt=null; installButton.hidden=true; });

  document.body.appendChild(tray);

  navigator.storage?.estimate?.().then(({usage=0,quota=0})=>{
    tray.title=quota ? `Browser storage: ${(usage/1048576).toFixed(1)} MB / ${(quota/1048576).toFixed(0)} MB` : "Aletheia application controls";
  }).catch(()=>{});
})();
