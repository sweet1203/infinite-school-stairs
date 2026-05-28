/* 대성여고 무한 학교계단 - Service Worker */
const CACHE = 'school-stairs-v12';
const STATIC = [
  './manifest.json',
  './icon.svg',
  './icon-192.png',
  './icon-512.png',
  './char.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(STATIC)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = e.request.url;

  // ── HTML / JS → 항상 네트워크 우선 (최신 버전 보장)
  if (e.request.destination === 'document' || url.endsWith('.html') || url.endsWith('.js')) {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
          return res;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  // ── Firebase / Google Fonts → 네트워크 우선
  if (url.includes('firebase') || url.includes('gstatic') || url.includes('googleapis')) {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
    return;
  }

  // ── 이미지·폰트 등 정적 자산 → 캐시 우선
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
