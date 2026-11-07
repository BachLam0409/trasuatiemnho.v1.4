// Service worker: chạy được offline. Tăng số VERSION mỗi lần cập nhật game để máy tải bản mới.
const VERSION='ttp-v36';
const FILES=['./','./index.html','./manifest.webmanifest','./icon-180.png','./icon-192.png','./icon-512.png','./icon-512-maskable.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>Promise.all(FILES.map(f=>c.add(f).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==VERSION).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
  const nav=r.mode==='navigate';
  // Trang chính: ưu tiên mạng (luôn có bản mới), mất mạng thì dùng bản đã lưu
  if(nav){e.respondWith(fetch(r).then(x=>{const y=x.clone();caches.open(VERSION).then(c=>c.put('./index.html',y));return x}).catch(()=>caches.match('./index.html').then(m=>m||caches.match('./'))));return}
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(x=>{const y=x.clone();caches.open(VERSION).then(c=>c.put(r,y));return x})));
});
