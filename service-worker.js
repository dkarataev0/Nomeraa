const CACHE='nomeraa-v5-1-fix';
const ASSETS=['./?v=5.1','./index.html?v=5.1','./manifest.webmanifest?v=5.1','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>e.waitUntil(
  caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())
));
self.addEventListener('activate',e=>e.waitUntil(
  caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())
));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(
    fetch(e.request).then(resp=>{
      const cp=resp.clone();
      caches.open(CACHE).then(c=>c.put(e.request,cp));
      return resp;
    }).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html?v=5.1')))
  );
});
