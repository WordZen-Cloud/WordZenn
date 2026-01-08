const cacheName = 'wordzen-arena-v1';
const assets = [
  './',
  './index.html',
  './manifest.json',
  './icon.png' // İkonu da önbelleğe ekledik ki internetsiz görünsün
];

// Dosyaları Önbelleğe Al
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(assets);
    })
  );
});

// Eski Önbellekleri Temizle (Güncelleme yapınca eskisini siler)
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== cacheName)
        .map(key => caches.delete(key))
      );
    })
  );
});

// İnternet Kontrollü Fetch (Arena modu için önemli)
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request).catch(() => {
        // Eğer bir dosya bulunamazsa ve internet yoksa ana sayfayı döndür
        if (e.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
