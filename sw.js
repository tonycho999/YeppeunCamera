// [수정 1] 캐시 이름을 v2로 변경 (그래야 브라우저가 새 파일인 줄 알고 다시 저장함)
const CACHE_NAME = 'smart-camera-v2';

// [수정 2] 캐시할 파일 목록 (stickers.js 추가, 없는 이미지 파일 제거)
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './stickers.js',   // [중요] 이거 없으면 스티커 안 나옴
    './manifest.json'
];

// 1. 설치 (Install) - 파일들 캐싱
self.addEventListener('install', (event) => {
    console.log('[Service Worker] 설치 중...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] 파일 캐싱 완료');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
    // 대기하지 않고 즉시 활성화
    self.skipWaiting();
});

// 2. 활성화 (Activate) - 옛날 캐시(v1) 삭제
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] 활성화...');
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    console.log('[Service Worker] 옛날 캐시 삭제:', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});

// 3. 요청 가로채기 (Fetch) - 오프라인 지원
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // 캐시에 있으면 그거 반환, 없으면 인터넷에서 가져옴
                return response || fetch(event.request);
            })
    );
});
