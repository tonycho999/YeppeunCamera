// ==========================================
// 1. 다국어 설정 (i18n)
// ==========================================
const translations = {
    ko: {
        timerOff: "⏱️ OFF", timer3: "⏱️ 3초", timer5: "⏱️ 5초", timer10: "⏱️ 10초",
        retroOff: "🎞️ 레트로 OFF", retroOn: "🎞️ 레트로 ON",
        frameOff: "🖼️ 프레임 OFF", frameChange: "🖼️ 프레임 변경", framePaid: "🖼️ 프레임(유료)",
        online: "🟢 온라인 (프리미엄 가능)", offline: "🔴 오프라인 (기본 기능만)",
        beauty: "✨ 뽀샤시", beautyOn: "✨ 뽀샤시 ON", intensity: "강도:",
        premium: "🎨 꾸미기(유료)", premiumOn: "🎨 꾸미기 ON",
        adTitle: "잠깐! 🖐️", adDesc: "광고를 닫으면<br>스티커 & 프레임이 열립니다!",
        adClose: "광고 닫고 사용하기", alertNet: "인터넷 연결이 필요합니다!",
        alertPremium: "프리미엄 기능이 활성화되었습니다!" // [수정] 문구 변경
    },
    en: {
        timerOff: "⏱️ OFF", timer3: "⏱️ 3s", timer5: "⏱️ 5s", timer10: "⏱️ 10s",
        retroOff: "🎞️ Retro OFF", retroOn: "🎞️ Retro ON",
        frameOff: "🖼️ Frame OFF", frameChange: "🖼️ Change Frame", framePaid: "🖼️ Frame(Paid)",
        online: "🟢 Online", offline: "🔴 Offline",
        beauty: "✨ Beauty", beautyOn: "✨ Beauty ON", intensity: "Level:",
        premium: "🎨 Premium", premiumOn: "🎨 Premium ON",
        adTitle: "Wait! 🖐️", adDesc: "Watch ad to unlock<br>Stickers & Frames!",
        adClose: "Close & Unlock", alertNet: "Internet connection required!",
        alertPremium: "Premium features activated!"
    },
    // (ja, zh 생략 - 위와 동일한 구조 사용)
};

// ... (언어 감지 로직 동일) ...
const userLang = navigator.language.slice(0, 2);
const t = translations[userLang] || translations['ko']; // 기본값 한국어

// ==========================================
// 2. 요소 설정
// ==========================================
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const stickerLayer = document.getElementById('sticker-layer'); // [NEW] 레이어
const frameOverlay = document.getElementById('frame-overlay');
const retroDateEl = document.getElementById('retro-date');
const statusText = document.getElementById('status-text');
const timerDisplay = document.getElementById('timer-display');

const btnTimer = document.getElementById('btn-timer');
const btnRetro = document.getElementById('btn-retro');
const btnFrame = document.getElementById('btn-frame');
const btnBeauty = document.getElementById('btn-beauty');
const btnPremium = document.getElementById('btn-premium');
const btnShutter = document.getElementById('btn-shutter');
const btnSwitch = document.getElementById('btn-switch');
const btnCloseAd = document.getElementById('btn-close-ad');

// 스티커 편집 도구
const stickerBar = document.getElementById('sticker-bar');
const stickerEditBox = document.getElementById('sticker-edit-box');
const stickerSizeRange = document.getElementById('sticker-size-range');
const btnDeleteSticker = document.getElementById('btn-delete-sticker');

let isBeautyMode = false;
let isPremiumMode = false;
let isRetroOn = false;
let timerState = 0; 
let facingMode = 'user';

const frameStyles = [
    { type: 'none', css: '' },
    { type: 'color', val: 'white', css: '20px solid white' },
    { type: 'color', val: 'black', css: '20px solid black' },
    { type: 'color', val: '#ffccd5', css: '20px solid #ffccd5' },
    { type: 'film', val: 'film', css: '' },
    { type: 'rainbow', val: 'rainbow', css: '' }
];
let frameIndex = 0;

// [NEW] 현재 선택된 스티커 추적 변수
let activeSticker = null;

// ==========================================
// 3. 초기화 (스티커 로드)
// ==========================================
function initStickers() {
    stickerBar.innerHTML = '';
    if (typeof stickerList !== 'undefined') {
        stickerList.forEach(emoji => {
            const btn = document.createElement('button');
            btn.className = 'sticker-btn';
            btn.innerText = emoji;
            btn.addEventListener('click', () => {
                addSticker(emoji); // [NEW] 클릭 시 새 스티커 추가 함수 호출
            });
            stickerBar.appendChild(btn);
        });
    }
}

// [NEW] 스티커 추가 함수 (여러 개 가능)
function addSticker(text) {
    const el = document.createElement('div');
    el.className = 'sticker-item';
    el.innerText = text;
    el.style.fontSize = "100px"; // 기본 크기
    
    // 화면 중앙에 배치
    el.style.left = "50%";
    el.style.top = "50%";
    
    // 터치/클릭 시 선택 처리
    el.addEventListener('mousedown', handleStickerStart);
    el.addEventListener('touchstart', handleStickerStart, {passive: false});

    stickerLayer.appendChild(el);
    selectSticker(el); // 추가되자마자 선택 상태로
}

// [NEW] 스티커 선택 함수
function selectSticker(el) {
    // 기존 선택된 것 해제
    if (activeSticker) {
        activeSticker.classList.remove('sticker-selected');
    }
    
    activeSticker = el;
    activeSticker.classList.add('sticker-selected');
    
    // 슬라이더 값을 현재 스티커 크기에 맞춤
    const currentSize = parseInt(activeSticker.style.fontSize);
    stickerSizeRange.value = currentSize;
    
    // 편집 도구 보이기
    stickerEditBox.classList.remove('hidden');
}

// [NEW] 스티커 삭제 함수
btnDeleteSticker.addEventListener('click', () => {
    if (activeSticker) {
        activeSticker.remove();
        activeSticker = null;
        stickerEditBox.classList.add('hidden'); // 선택된 게 없으면 숨김
    }
});

// [NEW] 스티커 크기 조절
stickerSizeRange.addEventListener('input', () => {
    if (activeSticker) {
        activeSticker.style.fontSize = `${stickerSizeRange.value}px`;
    }
});

// ... (applyLanguage, initCamera, btnSwitch, checkConnection 기존과 동일) ...
function applyLanguage() {
    btnTimer.innerText = t.timerOff;
    btnRetro.innerText = t.retroOff;
    btnFrame.innerText = t.framePaid;
    btnBeauty.innerText = t.beauty;
    btnPremium.innerText = t.premium;
    document.getElementById('txt-intensity').innerText = t.intensity;
    document.getElementById('txt-ad-title').innerText = t.adTitle;
    document.getElementById('txt-ad-desc').innerHTML = t.adDesc;
    document.getElementById('btn-close-ad').innerText = t.adClose;
}

async function initCamera() {
    if (video.srcObject) { const tracks = video.srcObject.getTracks(); tracks.forEach(track => track.stop()); }
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: facingMode }, audio: false });
        video.srcObject = stream;
        video.style.transform = (facingMode === 'user') ? 'scaleX(-1)' : 'none';
    } catch (err) { console.error(err); alert("Camera Error"); }
}
btnSwitch.addEventListener('click', () => {
    facingMode = (facingMode === 'user') ? 'environment' : 'user';
    btnSwitch.style.transform = "rotate(180deg)"; setTimeout(() => btnSwitch.style.transform = "rotate(0deg)", 300);
    initCamera();
});
function checkConnection() {
    if (navigator.onLine) {
        statusText.innerText = t.online; btnPremium.disabled = false; btnFrame.disabled = false;
        if(isPremiumMode) { btnFrame.innerText = t.frameChange; btnPremium.classList.add('premium-active'); }
    } else {
        statusText.innerText = t.offline; btnPremium.disabled = true; btnFrame.disabled = true;
        if(isPremiumMode) { isPremiumMode = false; togglePremiumUI(false); frameIndex=0; updateFrameUI(); }
    }
}

// ... (타이머, 레트로 로직 동일) ...
btnTimer.addEventListener('click', () => {
    if (timerState === 0) timerState = 3; else if (timerState === 3) timerState = 5; else if (timerState === 5) timerState = 10; else timerState = 0;
    if (timerState === 0) { btnTimer.innerText = t.timerOff; btnTimer.classList.remove('on-mode'); }
    else {
        let label = ""; if(timerState === 3) label = t.timer3; if(timerState === 5) label = t.timer5; if(timerState === 10) label = t.timer10;
        btnTimer.innerText = label; btnTimer.classList.add('on-mode');
    }
});
btnRetro.addEventListener('click', () => {
    isRetroOn = !isRetroOn; btnRetro.innerText = isRetroOn ? t.retroOn : t.retroOff; btnRetro.classList.toggle('on-mode');
    if (isRetroOn) { updateRetroDate(); retroDateEl.classList.remove('hidden'); } else { retroDateEl.classList.add('hidden'); }
});
function getRetroString() { const now = new Date(); return `${now.getFullYear()}. ${String(now.getMonth()+1).padStart(2,'0')}. ${String(now.getDate()).padStart(2,'0')}`; }
function updateRetroDate() { retroDateEl.innerText = getRetroString(); }
setInterval(() => { if (isRetroOn) updateRetroDate(); }, 1000);


// ==========================================
// [수정] 프레임과 꾸미기(스티커) 분리 로직
// ==========================================
btnFrame.addEventListener('click', () => {
    if (!navigator.onLine) { alert(t.alertNet); return; }
    if (!isPremiumMode) { document.getElementById('ad-modal').classList.remove('hidden'); return; }
    
    // [수정] 프레임만 변경하고, 꾸미기 UI는 건드리지 않음
    frameIndex = (frameIndex + 1) % frameStyles.length; 
    updateFrameUI();
});

function updateFrameUI() {
    const style = frameStyles[frameIndex];
    frameOverlay.style.border = 'none'; frameOverlay.className = ''; 
    if (style.type === 'none') { btnFrame.innerText = t.frameOff; btnFrame.classList.remove('on-mode'); }
    else { btnFrame.innerText = t.frameChange; btnFrame.classList.add('on-mode');
        if (style.type === 'color') frameOverlay.style.border = style.css;
        else if (style.type === 'film') frameOverlay.classList.add('frame-film');
        else if (style.type === 'rainbow') frameOverlay.classList.add('frame-rainbow');
    }
}

// [수정] 꾸미기 버튼: 스티커 바만 토글
btnPremium.addEventListener('click', () => {
    if (!navigator.onLine) { alert(t.alertNet); return; }
    if (!isPremiumMode) document.getElementById('ad-modal').classList.remove('hidden');
    else togglePremiumUI(stickerBar.classList.contains('hidden'));
});

// [수정] 광고 닫기
btnCloseAd.addEventListener('click', () => {
    document.getElementById('ad-modal').classList.add('hidden'); 
    isPremiumMode = true; 
    alert(t.alertPremium); // 활성화되었습니다!
    
    // 광고 본 직후에는 메뉴들 다 열어줌
    togglePremiumUI(true); 
    
    // 프레임 버튼 활성화 표시는 하되, 아직 적용은 안 함 (사용자가 누르게)
    btnFrame.innerText = t.frameOff;
});

function togglePremiumUI(show) {
    if (show) { 
        stickerBar.classList.remove('hidden'); 
        stickerLayer.classList.remove('hidden');
        btnPremium.innerText = t.premiumOn; 
        btnPremium.classList.add('premium-active'); 
    } else { 
        stickerBar.classList.add('hidden'); 
        // [중요] 레이어 자체를 숨기면 붙여둔 스티커가 안 보이므로 레이어는 둠? 
        // 아니면 "꾸미기 OFF"니까 안 보이는게 맞음. -> 숨김 처리
        stickerLayer.classList.add('hidden');
        stickerEditBox.classList.add('hidden'); // 편집창도 숨김
        btnPremium.innerText = t.premium; 
        btnPremium.classList.remove('premium-active'); 
    }
}

// ... (뽀샤시 로직 동일) ...
const beautySliderBox = document.getElementById('beauty-slider-box');
const beautyRange = document.getElementById('beauty-range');
function applyFilter() {
    if (isBeautyMode) {
        const level = beautyRange.value; const b = 1 + (level * 0.002); const bl = level * 0.02; const s = 1 + (level * 0.001);
        video.style.filter = `brightness(${b}) blur(${bl}px) saturate(${s})`; return video.style.filter;
    } else { video.style.filter = 'none'; return 'none'; }
}
btnBeauty.addEventListener('click', () => {
    isBeautyMode = !isBeautyMode; btnBeauty.innerText = isBeautyMode ? t.beautyOn : t.beauty;
    btnBeauty.classList.toggle('active-btn'); isBeautyMode ? beautySliderBox.classList.remove('hidden') : beautySliderBox.classList.add('hidden'); applyFilter();
});
beautyRange.addEventListener('input', () => { if (isBeautyMode) applyFilter(); });


// ==========================================
// [수정] 스티커 드래그 로직 (멀티 지원)
// ==========================================
let isDrag = false;
let startX, startY, initialLeft, initialTop;
let currentDragEl = null;

function handleStickerStart(e) {
    if (!isPremiumMode) return;
    e.preventDefault(); // 스크롤 방지
    
    currentDragEl = e.target;
    selectSticker(currentDragEl); // 터치한 놈 선택

    isDrag = true;
    let clientX = e.touches ? e.touches[0].clientX : e.clientX;
    let clientY = e.touches ? e.touches[0].clientY : e.clientY;
    startX = clientX;
    startY = clientY;
    
    // 현재 위치 파악 (중앙 정렬 transform 고려하여 offsetLeft/Top 사용)
    // transform: translate(-50%, -50%) 때문에 위치 계산이 조금 까다로움.
    // getBoundingClientRect를 쓰는게 가장 정확함.
    const rect = currentDragEl.getBoundingClientRect();
    const parentRect = stickerLayer.getBoundingClientRect();
    
    // 현재 시각적 위치 (레이어 기준)
    initialLeft = rect.left - parentRect.left + (rect.width / 2);
    initialTop = rect.top - parentRect.top + (rect.height / 2);

    document.addEventListener('touchmove', handleStickerMove, {passive: false});
    document.addEventListener('mousemove', handleStickerMove);
    document.addEventListener('touchend', handleStickerEnd);
    document.addEventListener('mouseup', handleStickerEnd);
}

function handleStickerMove(e) {
    if (!isDrag || !currentDragEl) return;
    e.preventDefault();
    let clientX = e.touches ? e.touches[0].clientX : e.clientX;
    let clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const deltaX = clientX - startX;
    const deltaY = clientY - startY;
    
    currentDragEl.style.left = `${initialLeft + deltaX}px`;
    currentDragEl.style.top = `${initialTop + deltaY}px`;
}

function handleStickerEnd() {
    isDrag = false;
    currentDragEl = null;
    document.removeEventListener('touchmove', handleStickerMove);
    document.removeEventListener('mousemove', handleStickerMove);
    document.removeEventListener('touchend', handleStickerEnd);
    document.removeEventListener('mouseup', handleStickerEnd);
}


// ==========================================
// 셔터 및 저장 (멀티 스티커 저장)
// ==========================================
btnShutter.addEventListener('click', () => {
    // 선택된 스티커 테두리 잠시 제거 (사진에 안 나오게)
    if (activeSticker) activeSticker.classList.remove('sticker-selected');
    
    if (timerState > 0) {
        let count = timerState; timerDisplay.innerText = count; timerDisplay.classList.remove('hidden');
        const interval = setInterval(() => {
            count--; if (count > 0) timerDisplay.innerText = count;
            else { clearInterval(interval); timerDisplay.classList.add('hidden'); takePhoto(); }
        }, 1000);
    } else { takePhoto(); }
});

function takePhoto() {
    const ctx = canvas.getContext('2d');
    const vw = video.videoWidth;
    const vh = video.videoHeight;
    canvas.width = vw; canvas.height = vh;

    if (facingMode === 'user') { ctx.translate(vw, 0); ctx.scale(-1, 1); }
    ctx.filter = isBeautyMode ? applyFilter() : 'none';
    ctx.drawImage(video, 0, 0, vw, vh);
    ctx.filter = 'none';

    // 프레임 그리기
    const style = frameStyles[frameIndex];
    if (facingMode === 'user') { ctx.scale(-1, 1); ctx.translate(-vw, 0); } // 좌표 원복

    if (style.type === 'color') {
        ctx.strokeStyle = style.val; ctx.lineWidth = 40; ctx.strokeRect(20, 20, vw-40, vh-40);
    } else if (style.type === 'film') {
        ctx.fillStyle = 'black'; const stripW = 60;
        ctx.fillRect(0, 0, stripW, vh); ctx.fillRect(vw - stripW, 0, stripW, vh);
        ctx.fillStyle = 'white'; const holeH = 30; const gap = 20;
        for (let y = 20; y < vh; y += (holeH + gap)) { ctx.fillRect(15, y, 30, holeH); ctx.fillRect(vw - 45, y, 30, holeH); }
    } else if (style.type === 'rainbow') {
        const grad = ctx.createLinearGradient(0, 0, vw, vh);
        grad.addColorStop(0, "red"); grad.addColorStop(0.2, "orange"); grad.addColorStop(0.4, "yellow");
        grad.addColorStop(0.6, "green"); grad.addColorStop(0.8, "blue"); grad.addColorStop(1, "violet");
        ctx.strokeStyle = grad; ctx.lineWidth = 40; ctx.strokeRect(20, 20, vw-40, vh-40);
    }

    // [수정] 모든 스티커 그리기 (반복문)
    if (isPremiumMode && !stickerLayer.classList.contains('hidden')) {
        const stickers = document.querySelectorAll('.sticker-item');
        const wrapRect = document.getElementById('camera-wrap').getBoundingClientRect();
        
        stickers.forEach(el => {
            const rect = el.getBoundingClientRect();
            // 화면 상에서의 중심점 계산
            const centerX = rect.left - wrapRect.left + (rect.width / 2);
            const centerY = rect.top - wrapRect.top + (rect.height / 2);
            
            // 비율 계산
            const rx = centerX / wrapRect.width;
            const ry = centerY / wrapRect.height;
            
            let canvasX = rx * vw;
            if(facingMode === 'user') canvasX = (1 - rx) * vw; // 거울모드 보정
            const canvasY = ry * vh;
            
            // 폰트 크기 비율 변환
            const fontSize = parseInt(el.style.fontSize);
            const fontScale = fontSize * (vw / wrapRect.width);

            ctx.font = `${fontScale}px serif`;
            ctx.fillStyle = "white"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
            ctx.fillText(el.innerText, canvasX, canvasY);
        });
    }

    // 레트로 날짜
    if (isRetroOn) {
        const dateStr = getRetroString();
        ctx.font = `bold ${vw * 0.05}px 'Courier New', monospace`;
        ctx.fillStyle = "#ffaa00"; ctx.textAlign = "right";
        ctx.shadowColor = "rgba(0,0,0,0.8)"; ctx.shadowBlur = 4;
        const paddingX = (style.type === 'film') ? 80 : 50; 
        ctx.fillText(dateStr, vw - paddingX, vh - 50);
    }

    // 다운로드
    const link = document.createElement('a');
    link.download = `smartcam_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    
    // 사진 찍은 후 다시 선택 표시 복구
    if (activeSticker) activeSticker.classList.add('sticker-selected');
}

// 실행
initStickers();
applyLanguage();
window.addEventListener('online', checkConnection);
window.addEventListener('offline', checkConnection);
initCamera();
checkConnection();
