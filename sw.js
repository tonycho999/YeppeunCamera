const CACHE_NAME = 'smart-camera-v4'; // 버전을 v4로 올림

// [중요] 여기에 적힌 파일은 "무조건" 폴더에 있어야 합니다. 없으면 앱이 고장납니다.
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './stickers.js',   // 방금 만든 stickers.js 파일이 꼭 있어야 함!
    './manifest.json'
    // 이미지 파일은 캐시 목록에서 일단 뺐습니다. (설치 에러 방지용)
];

// 1. 설치 (Install)
self.addEventListener('install', (event) => {
    console.log('[Service Worker] 설치 시작...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] 필수 파일 캐싱 중...');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .catch((err) => {
                console.error('[Service Worker] 캐싱 실패! 파일이 없거나 경로가 틀렸습니다.', err);
            })
    );
    self.skipWaiting();
});

// 2. 활성화 (Activate) - 구버전 캐시 청소
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});

// 3. 실행 (Fetch) - 오프라인 지원
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // 캐시에 있으면 반환, 없으면 인터넷 연결 시도
                return response || fetch(event.request);
            })
    );
});
