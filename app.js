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
        alertPremium: "프리미엄 기능이 활성화되었습니다!",
        install: "⬇️ 앱 설치"
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
        alertPremium: "Premium features activated!",
        install: "⬇️ Install"
    },
    ja: {
        timerOff: "⏱️ OFF", timer3: "⏱️ 3秒", timer5: "⏱️ 5秒", timer10: "⏱️ 10秒",
        retroOff: "🎞️ レトロ OFF", retroOn: "🎞️ レトロ ON",
        frameOff: "🖼️ 枠なし", frameChange: "🖼️ 枠変更", framePaid: "🖼️ フレーム(有料)",
        online: "🟢 オンライン", offline: "🔴 オフライン",
        beauty: "✨ 美肌", beautyOn: "✨ 美肌 ON", intensity: "強度:",
        premium: "🎨 デコ(有料)", premiumOn: "🎨 デコ ON",
        adTitle: "ちょっと待って! 🖐️", adDesc: "広告を見ると<br>スタンプと枠が使えます!",
        adClose: "閉じて使う", alertNet: "インターネット接続が必要です!",
        alertPremium: "プレミアムモード解除!",
        install: "⬇️ アプリ"
    },
    zh: {
        timerOff: "⏱️ OFF", timer3: "⏱️ 3秒", timer5: "⏱️ 5秒", timer10: "⏱️ 10秒",
        retroOff: "🎞️ 复古 OFF", retroOn: "🎞️ 复古 ON",
        frameOff: "🖼️ 无边框", frameChange: "🖼️ 更换边框", framePaid: "🖼️ 边框(付费)",
        online: "🟢 在线", offline: "🔴 离线",
        beauty: "✨ 美颜", beautyOn: "✨ 美颜 ON", intensity: "强度:",
        premium: "🎨 装饰(付费)", premiumOn: "🎨 装饰 ON",
        adTitle: "等等! 🖐️", adDesc: "观看广告以解锁<br>贴纸和边框!",
        adClose: "关闭广告并使用", alertNet: "需要网络连接!",
        alertPremium: "高级模式已解锁!",
        install: "⬇️ 下载"
    }
};

// [핵심] 브라우저 언어 자동 감지
const browserLang = navigator.language.slice(0, 2);
const t = translations[browserLang] || translations['en'];


// ==========================================
// 2. 요소 설정
// ==========================================
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const stickerLayer = document.getElementById('sticker-layer');
const frameOverlay = document.getElementById('frame-overlay');
const retroDateEl = document.getElementById('retro-date');
const statusText = document.getElementById('status-text');
const timerDisplay = document.getElementById('timer-display');

const btnInstall = document.getElementById('btn-install');
const btnTimer = document.getElementById('btn-timer');
const btnRetro = document.getElementById('btn-retro');
const btnFrame = document.getElementById('btn-frame');
const btnBeauty = document.getElementById('btn-beauty');
const btnPremium = document.getElementById('btn-premium');
const btnShutter = document.getElementById('btn-shutter');
const btnSwitch = document.getElementById('btn-switch');
const btnCloseAd = document.getElementById('btn-close-ad');

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
let activeSticker = null;


// ==========================================
// 3. 초기화 (언어 적용 함수)
// ==========================================
function applyLanguage() {
    btnInstall.innerText = t.install;
    
    // 타이머
    let timerLabel = t.timerOff;
    if (timerState === 3) timerLabel = t.timer3;
    if (timerState === 5) timerLabel = t.timer5;
    if (timerState === 10) timerLabel = t.timer10;
    btnTimer.innerText = timerLabel;
    
    // 레트로
    btnRetro.innerText = isRetroOn ? t.retroOn : t.retroOff;
    
    // 프레임
    if (!isPremiumMode) {
        btnFrame.innerText = t.framePaid;
    } else {
        const style = frameStyles[frameIndex];
        btnFrame.innerText = (style.type === 'none') ? t.frameOff : t.frameChange;
    }
    
    // 뷰티 & 프리미엄
    btnBeauty.innerText = isBeautyMode ? t.beautyOn : t.beauty;
    btnPremium.innerText = isPremiumMode ? t.premiumOn : t.premium;
    
    // 기타
    document.getElementById('txt-intensity').innerText = t.intensity;
    document.getElementById('txt-ad-title').innerText = t.adTitle;
    document.getElementById('txt-ad-desc').innerHTML = t.adDesc;
    document.getElementById('btn-close-ad').innerText = t.adClose;
    
    // 상태
    statusText.innerText = navigator.onLine ? t.online : t.offline;
}


// ==========================================
// 4. 스티커 로직 (멀티/선택/삭제/크기)
// ==========================================
function initStickers() {
    stickerBar.innerHTML = '';
    if (typeof stickerList !== 'undefined') {
        stickerList.forEach(emoji => {
            const btn = document.createElement('button');
            btn.className = 'sticker-btn';
            btn.innerText = emoji;
            btn.addEventListener('click', () => { addSticker(emoji); });
            stickerBar.appendChild(btn);
        });
    }
}

function addSticker(text) {
    const el = document.createElement('div');
    el.className = 'sticker-item'; el.innerText = text; el.style.fontSize = "100px";
    el.style.left = "50%"; el.style.top = "50%";
    el.addEventListener('mousedown', handleStickerStart);
    el.addEventListener('touchstart', handleStickerStart, {passive: false});
    stickerLayer.appendChild(el);
    selectSticker(el);
}

function selectSticker(el) {
    if (activeSticker) activeSticker.classList.remove('sticker-selected');
    activeSticker = el; activeSticker.classList.add('sticker-selected');
    stickerSizeRange.value = parseInt(activeSticker.style.fontSize);
    stickerEditBox.classList.remove('hidden');
}

btnDeleteSticker.addEventListener('click', () => {
    if (activeSticker) { activeSticker.remove(); activeSticker = null; stickerEditBox.classList.add('hidden'); }
});
stickerSizeRange.addEventListener('input', () => {
    if (activeSticker) activeSticker.style.fontSize = `${stickerSizeRange.value}px`;
});


// ==========================================
// 5. 카메라 및 기본 기능
// ==========================================
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
    } else {
        statusText.innerText = t.offline; btnPremium.disabled = true; btnFrame.disabled = true;
        if(isPremiumMode) { isPremiumMode = false; togglePremiumUI(false); frameIndex=0; updateFrameUI(); }
    }
}

// 타이머
btnTimer.addEventListener('click', () => {
    if (timerState === 0) timerState = 3; else if (timerState === 3) timerState = 5; else if (timerState === 5) timerState = 10; else timerState = 0;
    if (timerState === 0) btnTimer.classList.remove('on-mode'); else btnTimer.classList.add('on-mode');
    applyLanguage();
});

// 레트로
btnRetro.addEventListener('click', () => {
    isRetroOn = !isRetroOn; btnRetro.classList.toggle('on-mode');
    if (isRetroOn) { updateRetroDate(); retroDateEl.classList.remove('hidden'); } else { retroDateEl.classList.add('hidden'); }
    applyLanguage();
});
function getRetroString() { const now = new Date(); return `${now.getFullYear()}. ${String(now.getMonth()+1).padStart(2,'0')}. ${String(now.getDate()).padStart(2,'0')}`; }
function updateRetroDate() { retroDateEl.innerText = getRetroString(); }
setInterval(() => { if (isRetroOn) updateRetroDate(); }, 1000);

// 프레임
btnFrame.addEventListener('click', () => {
    if (!navigator.onLine) { alert(t.alertNet); return; }
    if (!isPremiumMode) { document.getElementById('ad-modal').classList.remove('hidden'); return; }
    frameIndex = (frameIndex + 1) % frameStyles.length; updateFrameUI();
});
function updateFrameUI() {
    const style = frameStyles[frameIndex];
    frameOverlay.style.border = 'none'; frameOverlay.className = ''; 
    if (style.type === 'none') btnFrame.classList.remove('on-mode');
    else {
        btnFrame.classList.add('on-mode');
        if (style.type === 'color') frameOverlay.style.border = style.css;
        else if (style.type === 'film') frameOverlay.classList.add('frame-film');
        else if (style.type === 'rainbow') frameOverlay.classList.add('frame-rainbow');
    }
    applyLanguage();
}

// 프리미엄/광고
btnPremium.addEventListener('click', () => {
    if (!navigator.onLine) { alert(t.alertNet); return; }
    if (!isPremiumMode) document.getElementById('ad-modal').classList.remove('hidden');
    else togglePremiumUI(stickerBar.classList.contains('hidden'));
});

btnCloseAd.addEventListener('click', () => {
    document.getElementById('ad-modal').classList.add('hidden'); 
    isPremiumMode = true; 
    alert(t.alertPremium);
    togglePremiumUI(true); 
    applyLanguage();
});

function togglePremiumUI(show) {
    if (show) { 
        stickerBar.classList.remove('hidden'); 
        stickerLayer.classList.remove('hidden'); 
        btnPremium.classList.add('premium-active'); 
    } else { 
        stickerBar.classList.add('hidden'); 
        stickerLayer.classList.add('hidden'); 
        stickerEditBox.classList.add('hidden'); 
        btnPremium.classList.remove('premium-active'); 
    }
    applyLanguage();
}

// 뷰티 모드 (필터)
const beautySliderBox = document.getElementById('beauty-slider-box');
const beautyRange = document.getElementById('beauty-range');

// [개선된 뽀샤시 필터 로직]
function applyFilter() {
    if (isBeautyMode) {
        const val = beautyRange.value / 100;
        const b = 1 + (val * 0.3);      // 밝기
        const s = 1 + (val * 0.3);      // 생기(채도)
        const c = 1 - (val * 0.1);      // 부드러움(대비 감소)
        const bl = val * 1.0;           // 피부결 정돈(블러)
        const sep = val * 0.1;          // 웜톤(세피아)
        const filterStr = `brightness(${b}) saturate(${s}) contrast(${c}) blur(${bl}px) sepia(${sep})`;
        video.style.filter = filterStr;
        return filterStr;
    } else { 
        video.style.filter = 'none'; 
        return 'none'; 
    }
}

btnBeauty.addEventListener('click', () => {
    isBeautyMode = !isBeautyMode; 
    btnBeauty.classList.toggle('active-btn'); 
    isBeautyMode ? beautySliderBox.classList.remove('hidden') : beautySliderBox.classList.add('hidden'); 
    applyFilter();
    applyLanguage();
});
beautyRange.addEventListener('input', () => { if (isBeautyMode) applyFilter(); });


// ==========================================
// 6. 스티커 드래그 핸들러
// ==========================================
let isDrag=false, sX, sY, iL, iT, currentDragEl=null;
function handleStickerStart(e) {
    if(!isPremiumMode) return; e.preventDefault(); 
    currentDragEl=e.target; selectSticker(currentDragEl);
    isDrag=true; sX=e.touches?e.touches[0].clientX:e.clientX; sY=e.touches?e.touches[0].clientY:e.clientY;
    const r=currentDragEl.getBoundingClientRect(), p=stickerLayer.getBoundingClientRect();
    iL=r.left-p.left+(r.width/2); iT=r.top-p.top+(r.height/2);
    document.addEventListener('touchmove',handleStickerMove,{passive:false}); document.addEventListener('mousemove',handleStickerMove);
    document.addEventListener('touchend',handleStickerEnd); document.addEventListener('mouseup',handleStickerEnd);
}
function handleStickerMove(e) {
    if(!isDrag||!currentDragEl) return; e.preventDefault();
    let cX=e.touches?e.touches[0].clientX:e.clientX, cY=e.touches?e.touches[0].clientY:e.clientY;
    currentDragEl.style.left=`${iL+(cX-sX)}px`; currentDragEl.style.top=`${iT+(cY-sY)}px`;
}
function handleStickerEnd() { 
    isDrag=false; currentDragEl=null; 
    document.removeEventListener('touchmove',handleStickerMove); document.removeEventListener('mousemove',handleStickerMove); 
    document.removeEventListener('touchend',handleStickerEnd); document.removeEventListener('mouseup',handleStickerEnd); 
}


// ==========================================
// 7. 셔터 및 저장
// ==========================================
btnShutter.addEventListener('click', () => {
    if(activeSticker) activeSticker.classList.remove('sticker-selected');
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
    const vw = video.videoWidth; const vh = video.videoHeight;
    canvas.width = vw; canvas.height = vh;

    // 1. 비디오
    if (facingMode === 'user') { ctx.translate(vw, 0); ctx.scale(-1, 1); }
    ctx.filter = isBeautyMode ? applyFilter() : 'none';
    ctx.drawImage(video, 0, 0, vw, vh); ctx.filter = 'none';

    // 2. 프레임
    const style = frameStyles[frameIndex];
    if (facingMode === 'user') { ctx.scale(-1, 1); ctx.translate(-vw, 0); } // 좌표 원복

    if (style.type === 'color') { ctx.strokeStyle = style.val; ctx.lineWidth = 40; ctx.strokeRect(20, 20, vw-40, vh-40); }
    else if (style.type === 'film') { ctx.fillStyle = 'black'; const sW=60; ctx.fillRect(0,0,sW,vh); ctx.fillRect(vw-sW,0,sW,vh); ctx.fillStyle='white'; const hH=30, gap=20; for(let y=20; y<vh; y+=(hH+gap)){ ctx.fillRect(15,y,30,hH); ctx.fillRect(vw-45,y,30,hH); } }
    else if (style.type === 'rainbow') { const g=ctx.createLinearGradient(0,0,vw,vh); g.addColorStop(0,"red"); g.addColorStop(0.2,"orange"); g.addColorStop(0.4,"yellow"); g.addColorStop(0.6,"green"); g.addColorStop(0.8,"blue"); g.addColorStop(1,"violet"); ctx.strokeStyle=g; ctx.lineWidth=40; ctx.strokeRect(20,20,vw-40,vh-40); }

    // 3. 스티커
    if (isPremiumMode && !stickerLayer.classList.contains('hidden')) {
        const stickers = document.querySelectorAll('.sticker-item');
        const wrapRect = document.getElementById('camera-wrap').getBoundingClientRect();
        stickers.forEach(el => {
            const rect = el.getBoundingClientRect();
            const cX = rect.left - wrapRect.left + (rect.width/2);
            const cY = rect.top - wrapRect.top + (rect.height/2);
            const rx = cX / wrapRect.width; const ry = cY / wrapRect.height;
            let canvasX = rx * vw; if(facingMode === 'user') canvasX = (1 - rx) * vw;
            const canvasY = ry * vh;
            const fontSize = parseInt(el.style.fontSize); const fontScale = fontSize * (vw / wrapRect.width);
            ctx.font = `${fontScale}px serif`; ctx.fillStyle = "white"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
            ctx.fillText(el.innerText, canvasX, canvasY);
        });
    }

    // 4. 레트로 날짜
    if (isRetroOn) {
        const dStr = getRetroString();
        ctx.font = `bold ${vw * 0.05}px 'Courier New', monospace`; ctx.fillStyle = "#ffaa00"; ctx.textAlign = "right"; ctx.shadowColor = "rgba(0,0,0,0.8)"; ctx.shadowBlur = 4;
        const pX = (style.type === 'film') ? 80 : 50; ctx.fillText(dStr, vw - pX, vh - 50);
    }

    const link = document.createElement('a');
    link.download = `smartcam_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    if(activeSticker) activeSticker.classList.add('sticker-selected');
}

// ==========================================
// 8. PWA 설치 로직
// ==========================================
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault(); deferredPrompt = e;
    btnInstall.classList.remove('hidden');
});
btnInstall.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') btnInstall.classList.add('hidden');
    deferredPrompt = null;
});
if (window.matchMedia('(display-mode: standalone)').matches) btnInstall.classList.add('hidden');


// 실행
initStickers(); applyLanguage();
window.addEventListener('online', checkConnection);
window.addEventListener('offline', checkConnection);
initCamera(); checkConnection();
