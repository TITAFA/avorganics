const V="avo-v3",SHELL=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{
 const q=e.request;
 if(q.method!=="GET")return;
 if(q.mode==="navigate"){
  e.respondWith(fetch(q).then(r=>{if(r&&r.ok){const cp=r.clone();caches.open(V).then(c=>c.put("index.html",cp));}return r;}).catch(()=>caches.match("index.html")));
  return;}
 e.respondWith(caches.match(q,{ignoreSearch:true}).then(hit=>{
  const net=fetch(q).then(r=>{if(r&&(r.ok||r.type==="opaque")){const cp=r.clone();caches.open(V).then(c=>c.put(q,cp));}return r;}).catch(()=>hit||Response.error());
  return hit||net;}));});
