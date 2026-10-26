// Сгенерировано tools/build.js. Версия кэша = хэш сборки.
const VERSION = 'dpvr-e1b402efcc';
const STATIC = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png'];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(STATIC)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k.startsWith('dpvr-') && k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  if (url.pathname.indexOf('/.well-known/') >= 0) return; // Digital Asset Links всегда из сети
  const isPage = req.mode === 'navigate' || url.pathname.endsWith('/') || url.pathname.endsWith('/index.html');
  if (isPage) { // network-first
    e.respondWith(fetch(new Request(req.url, { cache: 'no-store' })).then((r) => { const cp = r.clone(); caches.open(VERSION).then((c) => c.put('index.html', cp)); return r; })
      .catch(() => caches.match('index.html').then((r) => r || caches.match('./'))));
    return;
  }
  e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((r) => {
    if (r.ok) { const cp = r.clone(); caches.open(VERSION).then((c) => c.put(req, cp)); }
    return r;
  })));
});
