const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const stickerEl = document.getElementById('movable-sticker');
const stickerBar = document.getElementById('sticker-bar');
const statusText = document.getElementById('status-text');

// 뷰티 관련 요소
const beautySliderBox = document.getElementById('beauty-slider-box');
const beautyRange = document.getElementById('beauty-range');

// 팝업 관련
const adModal = document.getElementById('ad-modal');
const btnCloseAd = document.getElementById('btn-close-ad');

// 버튼들
const btnBeauty = document.getElementById('btn-beauty');
const btnPremium = document.getElementById('btn-premium');
const btnShutter = document.getElementById('btn-shutter');
const stickerBtns = document.querySelectorAll('.sticker-btn');

let isBeautyMode = false;
let isPremiumMode = false;

// 카메라 초기화
async function initCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user' }, audio: false
        });
        video.srcObject = stream;
    } catch (err) { alert("카메라 권한을 켜주세요!"); }
}

function checkConnection() {
    if (navigator.onLine) {
        statusText.innerText = "🟢 온라인";
        btnPremium.disabled = false;
    } else {
        statusText.innerText = "🔴 오프라인";
        btnPremium.disabled = true;
        if (isPremiumMode) togglePremiumUI(false);
    }
}

// ---------------------------------------------
// [핵심 1] 뽀샤시 필터 계산 함수
// ---------------------------------------------
function applyFilter() {
    if (isBeautyMode) {
        // 슬라이더 값 (0 ~ 100)
        const level = beautyRange.value;
        
        // 필터 공식:
        // brightness: 1(기본) ~ 1.2 (20% 밝게)
        // blur: 0px ~ 2px (피부 뭉개기)
        // saturate: 1 ~ 1.1 (생기 조금)
        // contrast: 1 ~ 0.9 (대비 낮춰서 잡티 가림)
        
        const brightness = 1 + (level * 0.002); 
        const blur = level * 0.02; 
        const saturate = 1 + (level * 0.001);
        const contrast = 1 - (level * 0.001);

        // 비디오에 필터 적용 문자열 생성
        const filterString = `brightness(${brightness}) blur(${blur}px) saturate(${saturate}) contrast(${contrast})`;
        video.style.filter = filterString;
        return filterString; // 저장할 때 쓰려고 리턴
    } else {
        video.style.filter = 'none';
        return 'none';
    }
}

// 뽀샤시 버튼 클릭
btnBeauty.addEventListener('click', () => {
    isBeautyMode = !isBeautyMode;
    
    if (isBeautyMode) {
        btnBeauty.classList.add('active-btn');
        btnBeauty.innerText = "✨ 뽀샤시 ON";
        beautySliderBox.classList.remove('hidden'); // 슬라이더 보이기
        applyFilter(); // 현재 슬라이더 값으로 바로 적용
    } else {
        btnBeauty.classList.remove('active-btn');
        btnBeauty.innerText = "✨ 뽀샤시";
        beautySliderBox.classList.add('hidden'); // 슬라이더 숨기기
        applyFilter(); // 필터 끄기
    }
});

// 슬라이더 움직일 때마다 실시간 적용
beautyRange.addEventListener('input', () => {
    if (isBeautyMode) applyFilter();
});

// ---------------------------------------------
// [핵심 2] 스티커 및 드래그 로직 (이전과 동일)
// ---------------------------------------------
stickerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => stickerEl.innerText = e.target.innerText);
});

let isDragging = false;
let startX, startY, initialLeft, initialTop;

// 마우스 & 터치 이벤트 통합
const startDrag = (e) => {
    if(!isPremiumMode) return;
    e.preventDefault();
    isDragging = true;
    
    let clientX = e.touches ? e.touches[0].clientX : e.clientX;
    let clientY = e.touches ? e.touches[0].clientY : e.clientY;
    startX = clientX; startY = clientY;
    
    const rect = stickerEl.getBoundingClientRect();
    const parentRect = document.getElementById('camera-wrap').getBoundingClientRect();
    initialLeft = rect.left - parentRect.left;
    initialTop = rect.top - parentRect.top;

    document.addEventListener('touchmove', moveDrag, {passive: false});
    document.addEventListener('mousemove', moveDrag);
    document.addEventListener('touchend', endDrag);
    document.addEventListener('mouseup', endDrag);
};

const moveDrag = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    let clientX = e.touches ? e.touches[0].clientX : e.clientX;
    let clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    stickerEl.style.transform = 'none';
    stickerEl.style.left = `${initialLeft + (clientX - startX)}px`;
    stickerEl.style.top = `${initialTop + (clientY - startY)}px`;
};

const endDrag = () => {
    isDragging = false;
    document.removeEventListener('touchmove', moveDrag);
    document.removeEventListener('mousemove', moveDrag);
    document.removeEventListener('touchend', endDrag);
    document.removeEventListener('mouseup', endDrag);
};

stickerEl.addEventListener('touchstart', startDrag, {passive: false});
stickerEl.addEventListener('mousedown', startDrag);


// ---------------------------------------------
// UI 및 저장 로직
// ---------------------------------------------
btnPremium.addEventListener('click', () => {
    if (!navigator.onLine) { alert("인터넷 필요!"); return; }
    if (isPremiumMode) togglePremiumUI(false);
    else adModal.classList.remove('hidden');
});

btnCloseAd.addEventListener('click', () => {
    adModal.classList.add('hidden');
    togglePremiumUI(true);
});

function togglePremiumUI(isOn) {
    isPremiumMode = isOn;
    if (isOn) {
        stickerEl.classList.remove('hidden');
        stickerBar.classList.remove('hidden');
        btnPremium.classList.add('premium-active');
    } else {
        stickerEl.classList.add('hidden');
        stickerBar.classList.add('hidden');
        btnPremium.classList.remove('premium-active');
    }
}

// 셔터 (저장 시 필터 적용)
btnShutter.addEventListener('click', () => {
    const ctx = canvas.getContext('2d');
    const vw = video.videoWidth;
    const vh = video.videoHeight;
    canvas.width = vw; canvas.height = vh;

    // 거울 모드
    ctx.translate(vw, 0);
    ctx.scale(-1, 1);

    // [중요] 현재 적용된 필터값을 캔버스에도 똑같이 적용
    if (isBeautyMode) {
        ctx.filter = applyFilter(); // 현재 계산된 필터 문자열 가져오기
    } else {
        ctx.filter = 'none';
    }

    ctx.drawImage(video, 0, 0, vw, vh);
    ctx.filter = 'none'; // 스티커에는 필터 안 먹게 초기화

    // 스티커 그리기
    if (isPremiumMode) {
        const wrapRect = document.getElementById('camera-wrap').getBoundingClientRect();
        const stickerRect = stickerEl.getBoundingClientRect();
        
        const screenLeft = stickerRect.left - wrapRect.left; 
        const screenTop = stickerRect.top - wrapRect.top;
        const centerX = screenLeft + (stickerRect.width / 2);
        const centerY = screenTop + (stickerRect.height / 2);
        
        const canvasX = (1 - (centerX / wrapRect.width)) * vw; 
        const canvasY = (centerY / wrapRect.height) * vh;

        ctx.translate(canvasX, canvasY);
        ctx.scale(-1, 1);
        ctx.font = `${stickerRect.height * (vw / wrapRect.width)}px serif`;
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(stickerEl.innerText, 0, 0);
    }

    const link = document.createElement('a');
    link.download = `photo_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
});

window.addEventListener('online', checkConnection);
window.addEventListener('offline', checkConnection);
initCamera();
checkConnection();
