const CACHE_NAME = 'my-cam-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './manifest.json',
    './camera_logo192.png',
    './camera_logo512.png'
];

// 설치 및 캐싱
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('파일 캐싱 중...');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

// 요청 가로채기 (오프라인 지원)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                return response || fetch(event.request);
            })
    );
});
