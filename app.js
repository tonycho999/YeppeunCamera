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
        alertPremium: "프리미엄 모드가 해제되었습니다!"
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
        alertPremium: "Premium mode unlocked!"
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
        alertPremium: "プレミアムモード解除!"
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
        alertPremium: "高级模式已解锁!"
    }
};

const userLang = navigator.language.slice(0, 2);
const t = translations[userLang] || translations['en'];

// ==========================================
// 2. 변수 및 요소 설정
// ==========================================
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const stickerEl = document.getElementById('movable-sticker');
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

// [NEW] 스티커 관련 요소
const stickerBar = document.getElementById('sticker-bar');
const stickerSizeBox = document.getElementById('sticker-size-box');
const stickerSizeRange = document.getElementById('sticker-size-range');

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

// ==========================================
// 3. 초기화 (스티커 생성 포함)
// ==========================================
function initStickers() {
    stickerBar.innerHTML = '';
    if (typeof stickerList !== 'undefined') {
        stickerList.forEach(emoji => {
            const btn = document.createElement('button');
            btn.className = 'sticker-btn';
            btn.innerText = emoji;
            btn.addEventListener('click', () => {
                // [수정] 스티커를 누르면 화면에 보이고 내용 업데이트
                stickerEl.innerText = emoji;
                stickerEl.classList.remove('hidden');
            });
            stickerBar.appendChild(btn);
        });
    }
}

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
    if (video.srcObject) {
        const tracks = video.srcObject.getTracks();
        tracks.forEach(track => track.stop());
    }
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: facingMode }, 
            audio: false 
        });
        video.srcObject = stream;
        video.style.transform = (facingMode === 'user') ? 'scaleX(-1)' : 'none';
    } catch (err) { console.error(err); alert("Camera Error"); }
}

btnSwitch.addEventListener('click', () => {
    facingMode = (facingMode === 'user') ? 'environment' : 'user';
    btnSwitch.style.transform = "rotate(180deg)";
    setTimeout(() => btnSwitch.style.transform = "rotate(0deg)", 300);
    initCamera();
});

function checkConnection() {
    if (navigator.onLine) {
        statusText.innerText = t.online;
        btnPremium.disabled = false; btnFrame.disabled = false;
        if(isPremiumMode) { btnFrame.innerText = t.frameChange; btnPremium.classList.add('premium-active'); }
    } else {
        statusText.innerText = t.offline;
        btnPremium.disabled = true; btnFrame.disabled = true;
        if(isPremiumMode) { isPremiumMode = false; togglePremiumUI(false); frameIndex=0; updateFrameUI(); }
    }
}

// ... 기능 로직들 ...
btnTimer.addEventListener('click', () => {
    if (timerState === 0) timerState = 3;
    else if (timerState === 3) timerState = 5;
    else if (timerState === 5) timerState = 10;
    else timerState = 0;

    if (timerState === 0) {
        btnTimer.innerText = t.timerOff;
        btnTimer.classList.remove('on-mode');
    } else {
        let label = "";
        if(timerState === 3) label = t.timer3;
        if(timerState === 5) label = t.timer5;
        if(timerState === 10) label = t.timer10;
        btnTimer.innerText = label;
        btnTimer.classList.add('on-mode');
    }
});

btnRetro.addEventListener('click', () => {
    isRetroOn = !isRetroOn;
    btnRetro.innerText = isRetroOn ? t.retroOn : t.retroOff;
    btnRetro.classList.toggle('on-mode');
    if (isRetroOn) { updateRetroDate(); retroDateEl.classList.remove('hidden'); }
    else { retroDateEl.classList.add('hidden'); }
});

function getRetroString() {
    const now = new Date();
    return `${now.getFullYear()}. ${String(now.getMonth()+1).padStart(2,'0')}. ${String(now.getDate()).padStart(2,'0')}`;
}
function updateRetroDate() { retroDateEl.innerText = getRetroString(); }
setInterval(() => { if (isRetroOn) updateRetroDate(); }, 1000);

btnFrame.addEventListener('click', () => {
    if (!navigator.onLine) { alert(t.alertNet); return; }
    if (!isPremiumMode) { document.getElementById('ad-modal').classList.remove('hidden'); return; }
    frameIndex = (frameIndex + 1) % frameStyles.length; updateFrameUI();
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

// [NEW] 스티커 크기 조절 로직
stickerSizeRange.addEventListener('input', () => {
    const size = stickerSizeRange.value;
    stickerEl.style.fontSize = `${size}px`;
});

const beautySliderBox = document.getElementById('beauty-slider-box');
const beautyRange = document.getElementById('beauty-range');
function applyFilter() {
    if (isBeautyMode) {
        const level = beautyRange.value;
        const b = 1 + (level * 0.002); const bl = level * 0.02; const s = 1 + (level * 0.001);
        video.style.filter = `brightness(${b}) blur(${bl}px) saturate(${s})`;
        return video.style.filter;
    } else { video.style.filter = 'none'; return 'none'; }
}
btnBeauty.addEventListener('click', () => {
    isBeautyMode = !isBeautyMode; btnBeauty.innerText = isBeautyMode ? t.beautyOn : t.beauty;
    btnBeauty.classList.toggle('active-btn');
    isBeautyMode ? beautySliderBox.classList.remove('hidden') : beautySliderBox.classList.add('hidden');
    applyFilter();
});
beautyRange.addEventListener('input', () => { if (isBeautyMode) applyFilter(); });

btnPremium.addEventListener('click', () => {
    if (!navigator.onLine) { alert(t.alertNet); return; }
    if (!isPremiumMode) document.getElementById('ad-modal').classList.remove('hidden');
    else togglePremiumUI(stickerBar.classList.contains('hidden'));
});

// [수정] 광고 닫기: 프리미엄 켜되, 스티커는 안 보이게 시작 (메뉴만 켬)
btnCloseAd.addEventListener('click', () => {
    document.getElementById('ad-modal').classList.add('hidden'); 
    isPremiumMode = true; 
    alert(t.alertPremium);
    
    // 메뉴와 사이즈 조절바는 보여주되
    stickerBar.classList.remove('hidden');
    stickerSizeBox.classList.remove('hidden');
    btnPremium.innerText = t.premiumOn; 
    btnPremium.classList.add('premium-active');
    
    // 스티커 자체는 숨김 (사용자가 골라야 나옴)
    stickerEl.classList.add('hidden');
    
    btnFrame.classList.remove('on-mode');
});

function togglePremiumUI(show) {
    if (show) { 
        stickerBar.classList.remove('hidden'); 
        stickerSizeBox.classList.remove('hidden');
        // 스티커가 내용이 있을 때만 보임
        if(stickerEl.innerText.trim() !== "") stickerEl.classList.remove('hidden');
        btnPremium.innerText = t.premiumOn; 
        btnPremium.classList.add('premium-active'); 
    }
    else { 
        stickerBar.classList.add('hidden'); 
        stickerSizeBox.classList.add('hidden');
        stickerEl.classList.add('hidden'); 
        btnPremium.innerText = t.premium; 
        btnPremium.classList.remove('premium-active'); 
    }
}

// 스티커 드래그
let isDrag=false, sX, sY, iL, iT;
const startD = e => { if(!isPremiumMode)return; e.preventDefault(); isDrag=true; sX=e.touches?e.touches[0].clientX:e.clientX; sY=e.touches?e.touches[0].clientY:e.clientY; const r=stickerEl.getBoundingClientRect(), p=document.getElementById('camera-wrap').getBoundingClientRect(); iL=r.left-p.left; iT=r.top-p.top; document.addEventListener('touchmove',moveD,{passive:false}); document.addEventListener('mousemove',moveD); document.addEventListener('touchend',endD); document.addEventListener('mouseup',endD); };
const moveD = e => { if(!isDrag)return; e.preventDefault(); let cX=e.touches?e.touches[0].clientX:e.clientX, cY=e.touches?e.touches[0].clientY:e.clientY; stickerEl.style.transform='none'; stickerEl.style.left=`${iL+(cX-sX)}px`; stickerEl.style.top=`${iT+(cY-sY)}px`; };
const endD = () => { isDrag=false; document.removeEventListener('touchmove',moveD); document.removeEventListener('mousemove',moveD); document.removeEventListener('touchend',endD); document.removeEventListener('mouseup',endD); };
stickerEl.addEventListener('touchstart',startD,{passive:false}); stickerEl.addEventListener('mousedown',startD);

// 셔터 및 저장
btnShutter.addEventListener('click', () => {
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

    // 프레임
    const style = frameStyles[frameIndex];
    if (facingMode === 'user') { ctx.scale(-1, 1); ctx.translate(-vw, 0); }

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

    // 스티커 (크기 반영)
    if (isPremiumMode && !stickerEl.classList.contains('hidden')) {
        const wrapRect = document.getElementById('camera-wrap').getBoundingClientRect();
        const stickerRect = stickerEl.getBoundingClientRect();
        
        const screenLeft = stickerRect.left - wrapRect.left; 
        const screenTop = stickerRect.top - wrapRect.top;
        const centerX = screenLeft + (stickerRect.width / 2);
        const centerY = screenTop + (stickerRect.height / 2);
        
        const rx = centerX / wrapRect.width;
        const ry = centerY / wrapRect.height;

        let canvasX = rx * vw;
        if(facingMode === 'user') canvasX = (1 - rx) * vw; 
        const canvasY = ry * vh;

        // [수정] 현재 조절된 폰트 크기 가져와서 비율 계산
        const currentFontSize = parseInt(window.getComputedStyle(stickerEl).fontSize);
        const fontScale = currentFontSize * (vw / wrapRect.width); // 화면 비율에 맞춰 확대

        ctx.font = `${fontScale}px serif`;
        ctx.fillStyle = "white"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(stickerEl.innerText, canvasX, canvasY);
    }

    // 레트로 날짜
    if (isRetroOn) {
        const dateStr = getRetroString();
        ctx.font = `bold ${vw * 0.05}px 'Courier New', monospace`;
        ctx.fillStyle = "#ffaa00";
        ctx.textAlign = "right";
        ctx.shadowColor = "rgba(0,0,0,0.8)"; ctx.shadowBlur = 4;
        const paddingX = (style.type === 'film') ? 80 : 50; 
        ctx.fillText(dateStr, vw - paddingX, vh - 50);
    }

    const link = document.createElement('a');
    link.download = `smartcam_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
}

// 실행
initStickers();
applyLanguage();
window.addEventListener('online', checkConnection);
window.addEventListener('offline', checkConnection);
initCamera();
checkConnection();
