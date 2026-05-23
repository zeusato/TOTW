const CACHE_NAME = 'totw-cache-v1';
const PRECACHE_ASSETS = [
  './',
  'index.html',
  'style.css',
  'app.js',
  'chapters.js',
  'manifest.json',
  'Assets/cover_scene.png',
  'Assets/Map.png',
  'Assets/nemarian_map.png'
];

// Cài đặt Service Worker và lưu cache các tài nguyên cốt lõi
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Pre-caching core assets');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Kích hoạt Service Worker và dọn dẹp các cache cũ nếu có
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Xử lý các yêu cầu tải tài nguyên (Fetch) với chiến lược Stale-While-Revalidate
self.addEventListener('fetch', event => {
  // Chỉ xử lý các yêu cầu HTTP/HTTPS thông thường (bỏ qua chrome-extension, v.v.)
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          // Trả về kết quả từ cache ngay lập tức để tải trang nhanh
          // Đồng thời ngầm gửi request mạng để cập nhật cache (Stale-While-Revalidate)
          fetch(event.request)
            .then(networkResponse => {
              if (networkResponse.status === 200) {
                caches.open(CACHE_NAME).then(cache => cache.put(event.request, networkResponse));
              }
            })
            .catch(() => {/* Bỏ qua lỗi kết nối khi đang offline */});
          return cachedResponse;
        }

        // Nếu tài nguyên chưa có trong cache, tải từ mạng
        return fetch(event.request)
          .then(response => {
            // Lưu cache các tài nguyên nạp động khác (như ảnh chương truyện và nhạc nền)
            if (response.status === 200) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
            }
            return response;
          });
      })
  );
});
