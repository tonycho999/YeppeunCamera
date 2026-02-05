// 요소 가져오기
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const stickerEl = document.getElementById('movable-sticker');
const statusText = document.getElementById('status-text');

// 상단 버튼
const btnTimer = document.getElementById('btn-timer');
const btnDate = document.getElementById('btn-date');
const btnFrame = document.getElementById('btn-frame'); // [NEW] 프레임 버튼
const frameOverlay = document.getElementById('frame-overlay'); // [NEW] 화면 테두리
const timerDisplay = document.getElementById('timer-display');

// 하단 컨트롤
const beautySliderBox = document.getElementById('beauty-slider-box');
const beautyRange = document.getElementById('beauty-range');
const adModal = document.getElementById('ad-modal');
const btnCloseAd = document.getElementById('btn-close-ad');
const btnBeauty = document.getElementById('btn-beauty');
const btnPremium = document.getElementById('btn-premium');
const btnShutter = document.getElementById('btn-shutter');
const stickerBtns = document.querySelectorAll('.sticker-btn');

// 상태 변수
let isBeautyMode = false;
let isPremiumMode = false; // 광고 보면 true로 바뀜
let isTimerOn = false;
let isDateOn = false;

// 프레임 관련 변수
const frameColors = [null, 'white', 'black', '#ffccd5']; // 없음, 흰, 검, 핑크
let frameIndex = 0; // 현재 프레임 순서 (0이면 없음)


// 1. 카메라 시작
async function initCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user' }, audio: false
        });
        video.srcObject = stream;
    } catch (err) { alert("카메라 권한을 허용해주세요!"); }
}

// 2. 연결 상태 및 프리미엄 버튼 관리
function checkConnection() {
    if (navigator.onLine) {
        statusText.innerText = "🟢 온라인 (프리미엄 가능)";
        
        // 온라인이면 버튼들 잠금 해제 준비 (아직 누를 순 있게 함)
        btnPremium.disabled = false;
        btnFrame.disabled = false;
        
        // 만약 이미 광고를 봐서 프리미엄 모드라면 유지
        if(isPremiumMode) {
             btnPremium.classList.add('premium-active');
             btnFrame.innerText = getFrameBtnText();
        }

    } else {
        statusText.innerText = "🔴 오프라인 (기본 기능만)";
        
        // 오프라인이면 프리미엄 기능 강제 종료
        btnPremium.disabled = true;
        btnFrame.disabled = true;
        
        if (isPremiumMode) {
            togglePremiumUI(false); // 스티커 끄기
            frameIndex = 0; updateFrameUI(); // 프레임 끄기
            isPremiumMode = false;
        }
    }
}

// ------------------------------------
// [상단] 기능 버튼 로직
// ------------------------------------

btnTimer.addEventListener('click', () => {
    isTimerOn = !isTimerOn;
    btnTimer.classList.toggle('on-mode');
    btnTimer.innerText = isTimerOn ? "⏱️ 3초" : "⏱️ OFF";
});

btnDate.addEventListener('click', () => {
    isDateOn = !isDateOn;
    btnDate.classList.toggle('on-mode');
    btnDate.innerText = isDateOn ? "📅 날짜 ON" : "📅 날짜 OFF";
});

// [핵심] 프레임 버튼 (프리미엄 기능)
btnFrame.addEventListener('click', () => {
    // 1. 인터넷 체크
    if (!navigator.onLine) { alert("인터넷이 필요합니다!"); return; }

    // 2. 프리미엄 모드가 아니면 광고 띄우기
    if (!isPremiumMode) {
        adModal.classList.remove('hidden');
        return;
    }

    // 3. 프리미엄이면 색상 변경 (순환)
    frameIndex = (frameIndex + 1) % frameColors.length;
    updateFrameUI();
});

function updateFrameUI() {
    const color = frameColors[frameIndex];
    if (color) {
        frameOverlay.style.border = `20px solid ${color}`; // 화면에 테두리 보이기
        btnFrame.innerText = "🖼️ 색상 변경";
        btnFrame.classList.add('on-mode');
    } else {
        frameOverlay.style.border = "none";
        btnFrame.innerText = "🖼️ 프레임 OFF";
        btnFrame.classList.remove('on-mode');
    }
}
function getFrameBtnText() {
    return frameColors[frameIndex] ? "🖼️ 색상 변경" : "🖼️ 프레임 OFF";
}


// ------------------------------------
// [하단] 프리미엄 및 광고 로직
// ------------------------------------

// 꾸미기(스티커) 버튼
btnPremium.addEventListener('click', () => {
    if (!navigator.onLine) { alert("인터넷이 필요합니다!"); return; }

    // 프리미엄 아니면 광고 띄우기
    if (!isPremiumMode) {
        adModal.classList.remove('hidden');
    } else {
        // 이미 프리미엄이면 스티커 메뉴 토글
        const bar = document.getElementById('sticker-bar');
        if (bar.classList.contains('hidden')) {
            togglePremiumUI(true);
        } else {
            togglePremiumUI(false);
        }
    }
});

// 광고 닫기 -> 프리미엄 활성화
btnCloseAd.addEventListener('click', () => {
    adModal.classList.add('hidden');
    isPremiumMode = true; // [중요] 프리미엄 모드 ON
    
    alert("프리미엄 기능이 해제되었습니다!\n스티커와 프레임을 사용해보세요.");
    
    // 스티커 메뉴 열기
    togglePremiumUI(true);
    // 프레임 버튼 활성화 표시
    btnFrame.classList.remove('on-mode'); // 초기화
});

function togglePremiumUI(show) {
    const bar = document.getElementById('sticker-bar');
    if (show) {
        bar.classList.remove('hidden');
        stickerEl.classList.remove('hidden');
        btnPremium.innerText = "🎨 꾸미기 ON";
        btnPremium.classList.add('premium-active');
    } else {
        bar.classList.add('hidden');
        stickerEl.classList.add('hidden');
        btnPremium.innerText = "🎨 꾸미기";
        btnPremium.classList.remove('premium-active');
    }
}


// ------------------------------------
// 기본 기능 (뽀샤시, 드래그)
// ------------------------------------
function applyFilter() {
    if (isBeautyMode) {
        const level = beautyRange.value;
        const brightness = 1 + (level * 0.002); 
        const blur = level * 0.02; 
        const saturate = 1 + (level * 0.001);
        const contrast = 1 - (level * 0.001);
        const filterStr = `brightness(${brightness}) blur(${blur}px) saturate(${saturate}) contrast(${contrast})`;
        video.style.filter = filterStr;
        return filterStr;
    } else {
        video.style.filter = 'none';
        return 'none';
    }
}
btnBeauty.addEventListener('click', () => {
    isBeautyMode = !isBeautyMode;
    if (isBeautyMode) {
        btnBeauty.classList.add('active-btn');
        beautySliderBox.classList.remove('hidden');
        applyFilter();
    } else {
        btnBeauty.classList.remove('active-btn');
        beautySliderBox.classList.add('hidden');
        applyFilter();
    }
});
beautyRange.addEventListener('input', () => { if (isBeautyMode) applyFilter(); });

// 스티커 드래그 (생략 없이)
stickerBtns.forEach(btn => btn.addEventListener('click', (e) => stickerEl.innerText = e.target.innerText));
let isDragging = false;
let startX, startY, initialLeft, initialTop;
const startDrag = (e) => {
    if(!isPremiumMode) return;
    e.preventDefault(); isDragging = true;
    let clientX = e.touches ? e.touches[0].clientX : e.clientX;
    let clientY = e.touches ? e.touches[0].clientY : e.clientY;
    startX = clientX; startY = clientY;
    const rect = stickerEl.getBoundingClientRect();
    const parentRect = document.getElementById('camera-wrap').getBoundingClientRect();
    initialLeft = rect.left - parentRect.left; initialTop = rect.top - parentRect.top;
    document.addEventListener('touchmove', moveDrag, {passive: false});
    document.addEventListener('mousemove', moveDrag);
    document.addEventListener('touchend', endDrag); document.addEventListener('mouseup', endDrag);
};
const moveDrag = (e) => {
    if (!isDragging) return; e.preventDefault();
    let clientX = e.touches ? e.touches[0].clientX : e.clientX;
    let clientY = e.touches ? e.touches[0].clientY : e.clientY;
    stickerEl.style.transform = 'none';
    stickerEl.style.left = `${initialLeft + (clientX - startX)}px`;
    stickerEl.style.top = `${initialTop + (clientY - startY)}px`;
};
const endDrag = () => {
    isDragging = false;
    document.removeEventListener('touchmove', moveDrag); document.removeEventListener('mousemove', moveDrag);
    document.removeEventListener('touchend', endDrag); document.removeEventListener('mouseup', endDrag);
};
stickerEl.addEventListener('touchstart', startDrag, {passive: false});
stickerEl.addEventListener('mousedown', startDrag);


// ------------------------------------
// 셔터 및 저장 로직 (프레임 그리기 포함)
// ------------------------------------
btnShutter.addEventListener('click', () => {
    if (isTimerOn) {
        let count = 3;
        timerDisplay.innerText = count;
        timerDisplay.classList.remove('hidden');
        const countdown = setInterval(() => {
            count--;
            if (count > 0) timerDisplay.innerText = count;
            else {
                clearInterval(countdown);
                timerDisplay.classList.add('hidden');
                takePhoto();
            }
        }, 1000);
    } else {
        takePhoto();
    }
});

function takePhoto() {
    const ctx = canvas.getContext('2d');
    const vw = video.videoWidth;
    const vh = video.videoHeight;
    canvas.width = vw; canvas.height = vh;

    // 1. 비디오 (거울모드)
    ctx.translate(vw, 0); ctx.scale(-1, 1);
    ctx.filter = isBeautyMode ? applyFilter() : 'none';
    ctx.drawImage(video, 0, 0, vw, vh);
    ctx.filter = 'none';

    // 2. 프레임 그리기 (프리미엄 & 색상 선택됨)
    // 거울모드 상태에서 테두리를 그리면 됨
    const frameColor = frameColors[frameIndex];
    if (isPremiumMode && frameColor) {
        ctx.strokeStyle = frameColor;
        const borderWidth = 40; // 테두리 두께
        ctx.lineWidth = borderWidth; 
        // 테두리가 화면 안쪽으로 그려지게 좌표 조정
        ctx.strokeRect(borderWidth/2, borderWidth/2, vw - borderWidth, vh - borderWidth);
    }

    // 3. 스티커 그리기
    if (isPremiumMode && !stickerEl.classList.contains('hidden')) {
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
        ctx.scale(-1, 1); ctx.translate(-canvasX, -canvasY);
    } else {
        ctx.scale(-1, 1); ctx.translate(-vw, 0);
    }

    // 4. 날짜 도장 (오른쪽 하단)
    if (isDateOn) {
        const now = new Date();
        const dateStr = `${String(now.getFullYear()).slice(-2)}. ${String(now.getMonth()+1).padStart(2,'0')}. ${String(now.getDate()).padStart(2,'0')}`;
        ctx.font = "bold 40px 'Courier New', monospace";
        ctx.fillStyle = "#ffaa00";
        ctx.textAlign = "right";
        ctx.shadowColor = "rgba(0,0,0,0.7)"; ctx.shadowBlur = 5;
        // 프레임이 있으면 그 안쪽에 날짜 찍기
        const padding = frameColors[frameIndex] ? 70 : 50;
        ctx.fillText(dateStr, canvas.width - padding, canvas.height - padding);
    }

    // 다운로드
    const link = document.createElement('a');
    link.download = `photo_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
}

window.addEventListener('online', checkConnection);
window.addEventListener('offline', checkConnection);
initCamera();
checkConnection();
