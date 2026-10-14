const CACHE="aletheia-pages-v0.3";
const CORE=[
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./assets/pwa-enhancements.js",
  "./apparatus/",
  "./apparatus/index.html",
  "./assets/research-apparatus.css",
  "./assets/research-apparatus-static.js",
  "./data/apparatus-demo.json",
  "./downloads/ALETHEIA_STANDALONE.html"
];

self.addEventListener("install",event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)));
  self.skipWaiting();
});

self.addEventListener("activate",event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch",event=>{
  const request=event.request;
  if(request.method!=="GET") return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin) return;

  event.respondWith((async()=>{
    const cache=await caches.open(CACHE);
    const cached=await cache.match(request);
    if(cached){
      fetch(request).then(response=>{
        if(response.ok) cache.put(request,response.clone());
      }).catch(()=>{});
      return cached;
    }
    try{
      const response=await fetch(request);
      if(response.ok) cache.put(request,response.clone());
      return response;
    }catch(error){
      if(request.mode==="navigate") return (await cache.match("./index.html")) || Response.error();
      return Response.error();
    }
  })());
});
