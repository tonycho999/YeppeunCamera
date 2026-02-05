// ==========================================
// 1. 다국어 설정 (i18n)
// ==========================================
const translations = {
    ko: {
        timerOff: "⏱️ OFF", timer3: "⏱️ 3초", timer5: "⏱️ 5초", timer10: "⏱️ 10초",
        retroOff: "🎞️ 레트로 OFF", retroOn: "🎞️ 레트로 ON",
        frameOff: "🖼️ 프레임 OFF", frameChange: "🖼️ 프레임 변경", framePaid: "🖼️ 프레임(유료)",
        online: "🟢 온라인 (프리미엄 가능)", offline: "🔴 오프라인 (기본 기능만)",
        beauty: "✨ 뽀샤시", beautyOn: "✨ 뽀샤시 ON", 
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
        beauty: "✨ Beauty", beautyOn: "✨ Beauty ON",
        premium: "🎨 Premium", premiumOn: "🎨 Premium ON",
        adTitle: "Wait! 🖐️", adDesc: "Watch ad to unlock<br>Stickers & Frames!",
        adClose: "Close & Unlock", alertNet: "Internet connection required!",
        alertPremium: "Premium features activated!",
        install: "⬇️ Install"
    },
    // (ja, zh 생략 - 위와 구조 동일, 자동 감지 로직)
    ja: { timerOff: "⏱️ OFF", beauty: "✨ 美肌", beautyOn: "✨ 美肌 ON", install: "⬇️ アプリ" }, 
    zh: { timerOff: "⏱️ OFF", beauty: "✨ 美颜", beautyOn: "✨ 美颜 ON", install: "⬇️ 下载" }
};

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

// [NEW] 4개의 상세 조절 슬라이더
const beautySliderBox = document.getElementById('beauty-slider-box');
const rangeBright = document.getElementById('range-bright'); // 밝기
const rangeColor = document.getElementById('range-color');   // 생기(채도)
const rangeWarm = document.getElementById('range-warm');     // 따뜻함(세피아)
const rangeSoft = document.getElementById('range-soft');     // 물광(블러)

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
// 3. 초기화 & 언어
// ==========================================
function applyLanguage() {
    btnInstall.innerText = t.install || "⬇️ App";
    let timerLabel = t.timerOff;
    if (timerState === 3) timerLabel = t.timer3 || "3s";
    if (timerState === 5) timerLabel = t.timer5 || "5s";
    if (timerState === 10) timerLabel = t.timer10 || "10s";
    btnTimer.innerText = timerLabel;
    
    btnRetro.innerText = isRetroOn ? (t.retroOn || "Retro ON") : (t.retroOff || "Retro OFF");
    
    if (!isPremiumMode) btnFrame.innerText = t.framePaid || "Frame(Paid)";
    else btnFrame.innerText = (frameStyles[frameIndex].type === 'none') ? (t.frameOff||"Frame OFF") : (t.frameChange||"Change");
    
    btnBeauty.innerText = isBeautyMode ? (t.beautyOn||"Beauty ON") : (t.beauty||"Beauty");
    btnPremium.innerText = isPremiumMode ? (t.premiumOn||"Deco ON") : (t.premium||"Deco");
    
    if(t.adTitle) document.getElementById('txt-ad-title').innerText = t.adTitle;
    if(t.adDesc) document.getElementById('txt-ad-desc').innerHTML = t.adDesc;
    if(t.adClose) document.getElementById('btn-close-ad').innerText = t.adClose;
    
    statusText.innerText = navigator.onLine ? (t.online||"Online") : (t.offline||"Offline");
}

function initStickers() {
    stickerBar.innerHTML = '';
    if (typeof stickerList !== 'undefined') {
        stickerList.forEach(emoji => {
            const btn = document.createElement('button');
            btn.className = 'sticker-btn'; btn.innerText = emoji;
            btn.addEventListener('click', () => addSticker(emoji));
            stickerBar.appendChild(btn);
        });
    }
}

// ==========================================
// 4. [핵심] 상세 뷰티 필터 로직
// ==========================================
function applyFilter() {
    if (isBeautyMode) {
        // 1. 밝기 (100 ~ 150) -> 1.0 ~ 1.5
        const brightness = rangeBright.value / 100;
        
        // 2. 생기/채도 (100 ~ 150) -> 1.0 ~ 1.5
        const saturate = rangeColor.value / 100;
        
        // 3. 따뜻함/세피아 (0 ~ 50) -> 0.0 ~ 0.5
        const sepia = rangeWarm.value / 100;
        
        // 4. 물광/블러 (0 ~ 30) -> 0px ~ 3px (나누기 10)
        const blur = rangeSoft.value / 10;

        // 필터 조합 문자열
        const filterStr = `brightness(${brightness}) saturate(${saturate}) sepia(${sepia}) blur(${blur}px)`;
        
        video.style.filter = filterStr;
        return filterStr;
    } else {
        video.style.filter = 'none';
        return 'none';
    }
}

// 4개의 슬라이더 모두에 이벤트 리스너 연결
[rangeBright, rangeColor, rangeWarm, rangeSoft].forEach(range => {
    range.addEventListener('input', applyFilter);
});

btnBeauty.addEventListener('click', () => {
    isBeautyMode = !isBeautyMode;
    btnBeauty.classList.toggle('active-btn');
    if (isBeautyMode) {
        beautySliderBox.classList.remove('hidden');
        applyFilter(); // 켜자마자 현재 슬라이더 값 적용
    } else {
        beautySliderBox.classList.add('hidden');
        applyFilter(); // 끄기
    }
    applyLanguage();
});


// ==========================================
// 5. 나머지 기능 (스티커, 카메라, 저장 등)
// ==========================================
function addSticker(text) {
    const el = document.createElement('div');
    el.className = 'sticker-item'; el.innerText = text; el.style.fontSize = "100px";
    el.style.left = "50%"; el.style.top = "50%";
    el.addEventListener('mousedown', handleStickerStart);
    el.addEventListener('touchstart', handleStickerStart, {passive: false});
    stickerLayer.appendChild(el); selectSticker(el);
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
stickerSizeRange.addEventListener('input', () => { if (activeSticker) activeSticker.style.fontSize = `${stickerSizeRange.value}px`; });

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
    if (navigator.onLine) { statusText.innerText = (t.online||"Online"); btnPremium.disabled = false; btnFrame.disabled = false; }
    else { statusText.innerText = (t.offline||"Offline"); btnPremium.disabled = true; btnFrame.disabled = true; if(isPremiumMode) { isPremiumMode=false; togglePremiumUI(false); frameIndex=0; updateFrameUI(); } }
}

btnTimer.addEventListener('click', () => {
    if (timerState === 0) timerState = 3; else if (timerState === 3) timerState = 5; else if (timerState === 5) timerState = 10; else timerState = 0;
    if (timerState === 0) btnTimer.classList.remove('on-mode'); else btnTimer.classList.add('on-mode');
    applyLanguage();
});
btnRetro.addEventListener('click', () => {
    isRetroOn = !isRetroOn; btnRetro.classList.toggle('on-mode');
    if (isRetroOn) { updateRetroDate(); retroDateEl.classList.remove('hidden'); } else { retroDateEl.classList.add('hidden'); }
    applyLanguage();
});
function getRetroString() { const now = new Date(); return `${now.getFullYear()}. ${String(now.getMonth()+1).padStart(2,'0')}. ${String(now.getDate()).padStart(2,'0')}`; }
function updateRetroDate() { retroDateEl.innerText = getRetroString(); }
setInterval(() => { if (isRetroOn) updateRetroDate(); }, 1000);

btnFrame.addEventListener('click', () => {
    if (!navigator.onLine) { alert(t.alertNet||"Check Internet"); return; }
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
btnPremium.addEventListener('click', () => {
    if (!navigator.onLine) { alert(t.alertNet||"Check Internet"); return; }
    if (!isPremiumMode) document.getElementById('ad-modal').classList.remove('hidden');
    else togglePremiumUI(stickerBar.classList.contains('hidden'));
});
btnCloseAd.addEventListener('click', () => {
    document.getElementById('ad-modal').classList.add('hidden'); isPremiumMode = true; alert(t.alertPremium||"Unlocked!");
    togglePremiumUI(true); applyLanguage();
});
function togglePremiumUI(show) {
    if (show) { stickerBar.classList.remove('hidden'); stickerLayer.classList.remove('hidden'); btnPremium.classList.add('premium-active'); }
    else { stickerBar.classList.add('hidden'); stickerLayer.classList.add('hidden'); stickerEditBox.classList.add('hidden'); btnPremium.classList.remove('premium-active'); }
    applyLanguage();
}

let isDrag=false, sX, sY, iL, iT, currentDragEl=null;
function handleStickerStart(e) { if(!isPremiumMode) return; e.preventDefault(); currentDragEl=e.target; selectSticker(currentDragEl); isDrag=true; sX=e.touches?e.touches[0].clientX:e.clientX; sY=e.touches?e.touches[0].clientY:e.clientY; const r=currentDragEl.getBoundingClientRect(), p=stickerLayer.getBoundingClientRect(); iL=r.left-p.left+(r.width/2); iT=r.top-p.top+(r.height/2); document.addEventListener('touchmove',handleStickerMove,{passive:false}); document.addEventListener('mousemove',handleStickerMove); document.addEventListener('touchend',handleStickerEnd); document.addEventListener('mouseup',handleStickerEnd); }
function handleStickerMove(e) { if(!isDrag||!currentDragEl) return; e.preventDefault(); let cX=e.touches?e.touches[0].clientX:e.clientX, cY=e.touches?e.touches[0].clientY:e.clientY; currentDragEl.style.left=`${iL+(cX-sX)}px`; currentDragEl.style.top=`${iT+(cY-sY)}px`; }
function handleStickerEnd() { isDrag=false; currentDragEl=null; document.removeEventListener('touchmove',handleStickerMove); document.removeEventListener('mousemove',handleStickerMove); document.removeEventListener('touchend',handleStickerEnd); document.removeEventListener('mouseup',handleStickerEnd); }

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
    if (facingMode === 'user') { ctx.translate(vw, 0); ctx.scale(-1, 1); }
    ctx.filter = isBeautyMode ? applyFilter() : 'none';
    ctx.drawImage(video, 0, 0, vw, vh); ctx.filter = 'none';

    const style = frameStyles[frameIndex];
    if (facingMode === 'user') { ctx.scale(-1, 1); ctx.translate(-vw, 0); }
    if (style.type === 'color') { ctx.strokeStyle = style.val; ctx.lineWidth = 40; ctx.strokeRect(20, 20, vw-40, vh-40); }
    else if (style.type === 'film') { ctx.fillStyle = 'black'; const sW=60; ctx.fillRect(0,0,sW,vh); ctx.fillRect(vw-sW,0,sW,vh); ctx.fillStyle='white'; const hH=30, gap=20; for(let y=20; y<vh; y+=(hH+gap)){ ctx.fillRect(15,y,30,hH); ctx.fillRect(vw-45,y,30,hH); } }
    else if (style.type === 'rainbow') { const g=ctx.createLinearGradient(0,0,vw,vh); g.addColorStop(0,"red"); g.addColorStop(0.2,"orange"); g.addColorStop(0.4,"yellow"); g.addColorStop(0.6,"green"); g.addColorStop(0.8,"blue"); g.addColorStop(1,"violet"); ctx.strokeStyle=g; ctx.lineWidth=40; ctx.strokeRect(20,20,vw-40,vh-40); }

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
    if (isRetroOn) {
        const dStr = getRetroString();
        ctx.font = `bold ${vw * 0.05}px 'Courier New', monospace`; ctx.fillStyle = "#ffaa00"; ctx.textAlign = "right"; ctx.shadowColor = "rgba(0,0,0,0.8)"; ctx.shadowBlur = 4;
        const pX = (style.type === 'film') ? 80 : 50; ctx.fillText(dStr, vw - pX, vh - 50);
    }
    const link = document.createElement('a'); link.download = `smartcam_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png'); link.click();
    if(activeSticker) activeSticker.classList.add('sticker-selected');
}

let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferredPrompt = e; btnInstall.classList.remove('hidden'); });
btnInstall.addEventListener('click', async () => { if (!deferredPrompt) return; deferredPrompt.prompt(); const { outcome } = await deferredPrompt.userChoice; if (outcome === 'accepted') btnInstall.classList.add('hidden'); deferredPrompt = null; });
if (window.matchMedia('(display-mode: standalone)').matches) btnInstall.classList.add('hidden');

initStickers(); applyLanguage(); window.addEventListener('online', checkConnection); window.addEventListener('offline', checkConnection); initCamera(); checkConnection();
