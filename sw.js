// Bilardomax Ligi: önce internetten en güncel sayfayı ister (tarayıcı önbelleğini atlar); internet yoksa kayıtlı kopyayı gösterir.
const ONBELLEK = 'bilardomax-v2';
const DOSYALAR = ['./', 'index.html', 'logo.png', 'manifest.webmanifest', 'icon-192.png', 'favicon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(ONBELLEK).then(c => c.addAll(DOSYALAR.map(u => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== ONBELLEK).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin || u.pathname.endsWith('.json')) return;
  e.respondWith(fetch(e.request, { cache: 'no-cache' }).then(r => { const k = r.clone(); caches.open(ONBELLEK).then(c => c.put(e.request, k)); return r; }).catch(() => caches.match(e.request)));
});
