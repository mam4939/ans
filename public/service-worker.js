// basic service worker caching static assets - replace with workbox for production
const CACHE = 'ans-static-v1';
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(['/','/manifest.json','/styles/globals.css'])));
});
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
