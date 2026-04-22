const CACHE_NAME = 'vent-pro-offline-v1';
const ASSETS = ['./','./index.html','./styles.css','./data.js','./app.js','./manifest.json'];
self.addEventListener('install', e => {e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS))); self.skipWaiting();});
self.addEventListener('activate', e => {e.waitUntil(self.clients.claim());});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(resp => {
    const copy = resp.clone();
    caches.open(CACHE_NAME).then(c => c.put(e.request, copy));
    return resp;
  }).catch(() => caches.match('./index.html'))));
});
