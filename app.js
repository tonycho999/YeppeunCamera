const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const stickerEl = document.getElementById('movable-sticker'); // 움직이는 스티커
const stickerBar = document.getElementById('sticker-bar'); // 스티커 메뉴
const statusText = document.getElementById('status-text');

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

// 카메라 켜기
async function initCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user' }, audio: false
        });
        video.srcObject = stream;
    } catch (err) { alert("카메라 권한 필요"); }
}

// 인터넷 상태 체크
function checkConnection() {
    if (navigator.onLine) {
        statusText.innerText = "🟢 온라인 (스티커 사용 가능)";
        btnPremium.disabled = false;
    } else {
        statusText.innerText = "🔴 오프라인 (기본 기능만)";
        btnPremium.disabled = true;
        if (isPremiumMode) togglePremiumUI(false);
    }
}

// ---------------------------------------------
// [핵심 1] 스티커 선택 기능
// ---------------------------------------------
stickerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // 버튼 안의 글자(이모지)를 가져와서 스티커에 적용
        const emoji = e.target.innerText;
        stickerEl.innerText = emoji;
    });
});

// ---------------------------------------------
// [핵심 2] 스티커 드래그(Drag) 기능 구현
// ---------------------------------------------
let isDragging = false;
let startX, startY, initialLeft, initialTop;

// 터치 시작 (모바일) 및 마우스 클릭 (PC)
stickerEl.addEventListener('touchstart', dragStart, {passive: false});
stickerEl.addEventListener('mousedown', dragStart);

function dragStart(e) {
    if(!isPremiumMode) return; // 프리미엄 아니면 안 움직임
    e.preventDefault(); // 스크롤 방지
    
    isDragging = true;
    
    // 터치인지 마우스인지 구분해서 좌표 가져오기
    let clientX = e.touches ? e.touches[0].clientX : e.clientX;
    let clientY = e.touches ? e.touches[0].clientY : e.clientY;

    startX = clientX;
    startY = clientY;
    
    // 현재 스티커 위치 저장
    const rect = stickerEl.getBoundingClientRect();
    // 부모(camera-wrap) 기준 위치 계산
    const parentRect = document.getElementById('camera-wrap').getBoundingClientRect();
    
    initialLeft = rect.left - parentRect.left;
    initialTop = rect.top - parentRect.top;

    // 움직임 이벤트 등록
    document.addEventListener('touchmove', drag, {passive: false});
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchend', dragEnd);
    document.addEventListener('mouseup', dragEnd);
}

function drag(e) {
    if (!isDragging) return;
    e.preventDefault();

    let clientX = e.touches ? e.touches[0].clientX : e.clientX;
    let clientY = e.touches ? e.touches[0].clientY : e.clientY;

    let deltaX = clientX - startX;
    let deltaY = clientY - startY;

    // CSS transform 제거하고 left/top으로 직접 제어 (저장시 계산 편하게)
    stickerEl.style.transform = 'none'; 
    stickerEl.style.left = `${initialLeft + deltaX}px`;
    stickerEl.style.top = `${initialTop + deltaY}px`;
}

function dragEnd() {
    isDragging = false;
    document.removeEventListener('touchmove', drag);
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('touchend', dragEnd);
    document.removeEventListener('mouseup', dragEnd);
}

// ---------------------------------------------
// UI 로직 (프리미엄, 뽀샤시)
// ---------------------------------------------

btnBeauty.addEventListener('click', () => {
    isBeautyMode = !isBeautyMode;
    isBeautyMode ? video.classList.add('filter-beauty') : video.classList.remove('filter-beauty');
    btnBeauty.classList.toggle('active-btn');
});

btnPremium.addEventListener('click', () => {
    if (!navigator.onLine) { alert("인터넷 필요!"); return; }
    
    if (isPremiumMode) togglePremiumUI(false); // 끄기
    else adModal.classList.remove('hidden');   // 켜기 (광고먼저)
});

btnCloseAd.addEventListener('click', () => {
    adModal.classList.add('hidden');
    togglePremiumUI(true);
});

function togglePremiumUI(isOn) {
    isPremiumMode = isOn;
    if (isOn) {
        stickerEl.classList.remove('hidden');
        stickerBar.classList.remove('hidden'); // 메뉴바 보이기
        btnPremium.classList.add('premium-active');
        btnPremium.innerText = "🎨 꾸미기 ON";
    } else {
        stickerEl.classList.add('hidden');
        stickerBar.classList.add('hidden');
        btnPremium.classList.remove('premium-active');
        btnPremium.innerText = "🎨 스티커 꾸미기";
    }
}

// ---------------------------------------------
// [핵심 3] 사진 저장 (위치 계산 포함)
// ---------------------------------------------
btnShutter.addEventListener('click', () => {
    const ctx = canvas.getContext('2d');
    
    // 비디오 원본 크기
    const vw = video.videoWidth;
    const vh = video.videoHeight;
    canvas.width = vw;
    canvas.height = vh;

    // 1. 비디오 그리기 (거울모드)
    ctx.translate(vw, 0);
    ctx.scale(-1, 1);
    if (isBeautyMode) ctx.filter = 'brightness(1.1) contrast(0.95) saturate(1.1) blur(1px)';
    ctx.drawImage(video, 0, 0, vw, vh);
    ctx.filter = 'none';

    // 2. 스티커 그리기 (현재 화면 위치를 비디오 좌표로 변환)
    if (isPremiumMode) {
        const wrapRect = document.getElementById('camera-wrap').getBoundingClientRect();
        const stickerRect = stickerEl.getBoundingClientRect();
        
        // 화면상에서의 비율 계산 (0.0 ~ 1.0)
        // 거울모드라 좌우 반전 위치를 계산해야 함이 중요!
        // 화면 왼쪽에서 떨어진 거리
        const screenLeft = stickerRect.left - wrapRect.left; 
        const screenTop = stickerRect.top - wrapRect.top;
        
        // 스티커 중심점 계산
        const centerX = screenLeft + (stickerRect.width / 2);
        const centerY = screenTop + (stickerRect.height / 2);

        // 비율로 변환
        const ratioX = centerX / wrapRect.width;
        const ratioY = centerY / wrapRect.height;

        // 캔버스 좌표로 변환
        // (거울 모드이므로 X축은 반대편에서 계산)
        const canvasX = (1 - ratioX) * vw; // 거울 반전 보정
        const canvasY = ratioY * vh;

        // 스티커 그리기
        ctx.translate(canvasX, canvasY); // 스티커 위치로 이동
        ctx.scale(-1, 1); // 글자 좌우반전 다시 복구 (안하면 글자 거꾸로 나옴)
        
        ctx.font = `${stickerRect.height * (vw / wrapRect.width)}px serif`; // 화면 비율에 맞춰 글자 크기 조절
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(stickerEl.innerText, 0, 0);
    }

    // 저장
    const link = document.createElement('a');
    link.download = `photo_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
});

// 시작
window.addEventListener('online', checkConnection);
window.addEventListener('offline', checkConnection);
initCamera();
checkConnection();
