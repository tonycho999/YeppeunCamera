// ==========================================
// 1. 다국어 & 설정
// ==========================================
const translations = {
    ko: {
        timerOff: "⏱️ OFF", timer3: "⏱️ 3초", timer5: "⏱️ 5초", timer10: "⏱️ 10초",
        retroOff: "🎞️ 레트로 OFF", retroOn: "🎞️ 레트로 ON",
        frameOff: "🖼️ 프레임 OFF", frameChange: "🖼️ 프레임 변경", framePaid: "🖼️ 프레임",
        online: "🟢 온라인", offline: "🔴 오프라인",
        beauty: "✨ 뽀샤시", beautyOn: "✨ 뽀샤시 ON",
        premium: "🎨 꾸미기", premiumOn: "🎨 꾸미기 ON",
        adTitle: "잠깐! 🖐️", adDesc: "광고를 닫으면<br>스티커 & 프레임이 열립니다!",
        adClose: "광고 닫고 사용하기", alertNet: "인터넷 연결이 필요합니다!",
        alertPremium: "모든 기능이 활성화되었습니다!",
        install: "⬇️ 앱 설치",
        done: "✅ 완료"
    },
    en: {
        timerOff: "⏱️ OFF", timer3: "⏱️ 3s", timer5: "⏱️ 5s", timer10: "⏱️ 10s",
        retroOff: "🎞️ Retro OFF", retroOn: "🎞️ Retro ON",
        frameOff: "🖼️ Frame OFF", frameChange: "🖼️ Change Frame", framePaid: "🖼️ Frame",
        online: "🟢 Online", offline: "🔴 Offline",
        beauty: "✨ Beauty", beautyOn: "✨ Beauty ON",
        premium: "🎨 Deco", premiumOn: "🎨 Deco ON",
        adTitle: "Wait! 🖐️", adDesc: "Watch ad to unlock<br>Stickers & Frames!",
        adClose: "Close & Unlock", alertNet: "Internet connection required!",
        alertPremium: "All features unlocked!",
        install: "⬇️ Install",
        done: "✅ Done"
    },
    ja: {
        timerOff: "⏱️ OFF", timer3: "⏱️ 3秒", timer5: "⏱️ 5秒", timer10: "⏱️ 10秒",
        retroOff: "🎞️ レトロ OFF", retroOn: "🎞️ レトロ ON",
        frameOff: "🖼️ 枠なし", frameChange: "🖼️ 枠変更", framePaid: "🖼️ フレーム",
        online: "🟢 オンライン", offline: "🔴 オフライン",
        beauty: "✨ 美肌", beautyOn: "✨ 美肌 ON",
        premium: "🎨 デコ", premiumOn: "🎨 デコ ON",
        adTitle: "ちょっと待って! 🖐️", adDesc: "広告を見ると<br>スタンプと枠が使えます!",
        adClose: "閉じて使う", alertNet: "インターネット接続が必要です!",
        alertPremium: "プレミアムモード解除!",
        install: "⬇️ アプリ",
        done: "✅ 完了"
    },
    zh: {
        timerOff: "⏱️ OFF", timer3: "⏱️ 3秒", timer5: "⏱️ 5秒", timer10: "⏱️ 10秒",
        retroOff: "🎞️ 复古 OFF", retroOn: "🎞️ 复古 ON",
        frameOff: "🖼️ 无边框", frameChange: "🖼️ 更换边框", framePaid: "🖼️ 边框",
        online: "🟢 在线", offline: "🔴 离线",
        beauty: "✨ 美颜", beautyOn: "✨ 美颜 ON",
        premium: "🎨 装饰", premiumOn: "🎨 装饰 ON",
        adTitle: "等等! 🖐️", adDesc: "观看广告以解锁<br>贴纸和边框!",
        adClose: "关闭广告并使用", alertNet: "需要网络连接!",
        alertPremium: "高级模式已解锁!",
        install: "⬇️ 下载",
        done: "✅ 完成"
    }
};

const browserLang = navigator.language.slice(0, 2);
const t = translations[browserLang] || translations['en'];

// ==========================================
// 2. 요소 가져오기 (안전 장치 추가)
// ==========================================
function getEl(id) {
    const el = document.getElementById(id);
    if (!el) console.warn(`Element not found: ${id}`);
    return el;
}

const video = getEl('video');
const canvas = getEl('canvas');
const stickerLayer = getEl('sticker-layer');
const frameOverlay = getEl('frame-overlay');
const retroDateEl = getEl('retro-date');
const statusText = getEl('status-text');
const timerDisplay = getEl('timer-display');

const btnInstall = getEl('btn-install');
const btnTimer = getEl('btn-timer');
const btnRetro = getEl('btn-retro');
const btnFrame = getEl('btn-frame');
const btnBeauty = getEl('btn-beauty');
const btnPremium = getEl('btn-premium');
const btnShutter = getEl('btn-shutter');
const btnSwitch = getEl('btn-switch');
const btnCloseAd = getEl('btn-close-ad');

// 뷰티 슬라이더
const beautySliderBox = getEl('beauty-slider-box');
const rangeBright = getEl('range-bright');
const rangeColor = getEl('range-color');
const rangeWarm = getEl('range-warm');
const rangeSoft = getEl('range-soft');

// 스티커 도구
const stickerBar = getEl('sticker-bar');
const stickerEditBox = getEl('sticker-edit-box');
const stickerSizeRange = getEl('sticker-size-range');
const btnDeleteSticker = getEl('btn-delete-sticker');

// 상태 변수
let isBeautyMode = false;
let isPremiumMode = false;
let isRetroOn = false;
let timerState = 0; 
let facingMode = 'user';

let isBeautyMenuOpen = false;
let isStickerMenuOpen = false;

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
// 3. 언어 및 UI 업데이트 (에러 수정됨)
// ==========================================
function applyLanguage() {
    if(btnInstall) btnInstall.innerText = t.install;
    
    let timerLabel = t.timerOff;
    if (timerState === 3) timerLabel = t.timer3;
    if (timerState === 5) timerLabel = t.timer5;
    if (timerState === 10) timerLabel = t.timer10;
    if(btnTimer) btnTimer.innerText = timerLabel;
    
    if(btnRetro) btnRetro.innerText = isRetroOn ? t.retroOn : t.retroOff;
    
    if(btnFrame) {
        if (!isPremiumMode) {
            btnFrame.innerText = t.framePaid;
        } else {
            const style = frameStyles[frameIndex];
            btnFrame.innerText = (style.type === 'none') ? t.frameOff : t.frameChange;
        }
    }
    
    if(btnBeauty) {
        if (isBeautyMenuOpen) {
            btnBeauty.innerText = t.done;
        } else {
            btnBeauty.innerText = isBeautyMode ? t.beautyOn : t.beauty;
        }
    }
    
    if(btnPremium) {
        if (isStickerMenuOpen) {
            btnPremium.innerText = t.done;
        } else {
            btnPremium.innerText = isPremiumMode ? t.premiumOn : t.premium;
        }
    }
    
    // [중요 수정] 없는 요소(txt-intensity)에 접근하던 코드 삭제함
    // document.getElementById('txt-intensity').innerText = t.intensity; (삭제됨)

    const adTitle = getEl('txt-ad-title');
    const adDesc = getEl('txt-ad-desc');
    const adClose = getEl('btn-close-ad');

    if(adTitle) adTitle.innerText = t.adTitle;
    if(adDesc) adDesc.innerHTML = t.adDesc;
    if(adClose) adClose.innerText = t.adClose;
    
    checkConnection(); 
}


// ==========================================
// 4. 스티커 기능
// ==========================================
function initStickers() {
    if(!stickerBar) return;
    stickerBar.innerHTML = '';
    
    if (typeof stickerList !== 'undefined') {
        stickerList.forEach(emoji => {
            const btn = document.createElement('button');
            btn.className = 'sticker-btn'; btn.innerText = emoji;
            btn.addEventListener('click', () => addSticker(emoji));
            stickerBar.appendChild(btn);
        });
    } else {
        console.log("Sticker list not loaded yet.");
    }
}

function addSticker(text) {
    const el = document.createElement('div');
    el.className = 'sticker-item'; el.innerText = text; el.style.fontSize = "100px";
    el.style.left = "50%"; el.style.top = "50%";
    el.addEventListener('mousedown', handleStickerStart);
    el.addEventListener('touchstart', handleStickerStart, {passive: false});
    if(stickerLayer) stickerLayer.appendChild(el); 
    selectSticker(el);
}

function selectSticker(el) {
    if (!isStickerMenuOpen) openStickerMenu();
    if (activeSticker) activeSticker.classList.remove('sticker-selected');
    activeSticker = el; activeSticker.classList.add('sticker-selected');
    if(stickerSizeRange) stickerSizeRange.value = parseInt(activeSticker.style.fontSize);
    if(stickerEditBox) stickerEditBox.classList.remove('hidden');
}

if(btnDeleteSticker) {
    btnDeleteSticker.addEventListener('click', () => {
        if (activeSticker) { activeSticker.remove(); activeSticker = null; stickerEditBox.classList.add('hidden'); }
    });
}
if(stickerSizeRange) {
    stickerSizeRange.addEventListener('input', () => {
        if (activeSticker) activeSticker.style.fontSize = `${stickerSizeRange.value}px`;
    });
}


// ==========================================
// 5. 뷰티 필터
// ==========================================
function applyFilter() {
    if(!video) return;
    if (isBeautyMode && rangeBright) {
        const brightness = rangeBright.value / 100;
        const saturate = rangeColor.value / 100;
        const sepia = rangeWarm.value / 100;
        const blur = rangeSoft.value / 10;
        const filterStr = `brightness(${brightness}) saturate(${saturate}) sepia(${sepia}) blur(${blur}px)`;
        video.style.filter = filterStr;
    } else {
        video.style.filter = 'none';
    }
}

if(btnBeauty) {
    btnBeauty.addEventListener('click', () => {
        if (isBeautyMenuOpen) {
            isBeautyMenuOpen = false;
            beautySliderBox.classList.add('hidden');
            btnBeauty.classList.remove('active-btn'); 
            if(isBeautyMode) btnBeauty.classList.add('on-mode');
        } else {
            isBeautyMenuOpen = true;
            isBeautyMode = true; 
            beautySliderBox.classList.remove('hidden');
            if(isStickerMenuOpen) closeStickerMenu();
            btnBeauty.classList.add('active-btn');
            btnBeauty.classList.remove('on-mode');
            applyFilter();
        }
        applyLanguage();
    });
}

if(rangeBright) {
    [rangeBright, rangeColor, rangeWarm, rangeSoft].forEach(range => {
        range.addEventListener('input', applyFilter);
    });
}


// ==========================================
// 6. 꾸미기 메뉴
// ==========================================
function openStickerMenu() {
    isStickerMenuOpen = true;
    stickerBar.classList.remove('hidden');
    if(activeSticker) stickerEditBox.classList.remove('hidden');
    stickerLayer.classList.remove('hidden');
    
    if(isBeautyMenuOpen) {
        isBeautyMenuOpen = false;
        beautySliderBox.classList.add('hidden');
        btnBeauty.classList.remove('active-btn');
        if(isBeautyMode) btnBeauty.classList.add('on-mode');
    }

    btnPremium.classList.add('active-btn');
    btnPremium.classList.remove('on-mode');
    applyLanguage();
}

function closeStickerMenu() {
    isStickerMenuOpen = false;
    stickerBar.classList.add('hidden');
    stickerEditBox.classList.add('hidden');
    btnPremium.classList.remove('active-btn');
    if(isPremiumMode) btnPremium.classList.add('on-mode');
    if(activeSticker) activeSticker.classList.remove('sticker-selected');
    applyLanguage();
}

if(btnPremium) {
    btnPremium.addEventListener('click', () => {
        if (!navigator.onLine) { alert(t.alertNet); return; }
        if (!isPremiumMode) {
            document.getElementById('ad-modal').classList.remove('hidden');
            return;
        }
        if (isStickerMenuOpen) closeStickerMenu(); else openStickerMenu();
    });
}

if(btnCloseAd) {
    btnCloseAd.addEventListener('click', () => {
        document.getElementById('ad-modal').classList.add('hidden'); 
        isPremiumMode = true; 
        alert(t.alertPremium);
        openStickerMenu();
    });
}


// ==========================================
// 7. 카메라 및 연결 확인
// ==========================================
async function initCamera() {
    if(!video) return;
    if (video.srcObject) { 
        const tracks = video.srcObject.getTracks(); 
        tracks.forEach(track => track.stop()); 
    }
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: facingMode }, audio: false });
        video.srcObject = stream;
        video.style.transform = (facingMode === 'user') ? 'scaleX(-1)' : 'none';
    } catch (err) { 
        console.error(err); 
        // alert("Camera Error"); // 에러 메시지 팝업 너무 자주 뜨면 주석 처리
    }
}

if(btnSwitch) {
    btnSwitch.addEventListener('click', () => {
        facingMode = (facingMode === 'user') ? 'environment' : 'user';
        btnSwitch.style.transform = "rotate(180deg)"; setTimeout(() => btnSwitch.style.transform = "rotate(0deg)", 300);
        initCamera();
    });
}

// [핵심] 연결 상태 확인 및 UI 업데이트
function checkConnection() {
    if(!statusText) return;
    
    const isOnline = navigator.onLine;

    if (isOnline) {
        statusText.innerText = t.online; 
        statusText.style.color = "#00ff00"; // 녹색
        
        if(btnPremium) {
            btnPremium.disabled = false;
            btnPremium.classList.remove('offline-disabled');
        }
        if(btnFrame) {
            btnFrame.disabled = false;
            btnFrame.classList.remove('offline-disabled');
        }
    } else {
        statusText.innerText = t.offline; 
        statusText.style.color = "#ff4757"; // 빨간색
        
        if(btnPremium) {
            btnPremium.disabled = true;
            btnPremium.classList.add('offline-disabled');
        }
        if(btnFrame) {
            btnFrame.disabled = true;
            btnFrame.classList.add('offline-disabled');
        }

        if(isPremiumMode) { 
            isPremiumMode = false; 
            closeStickerMenu(); 
            frameIndex = 0; 
            updateFrameUI(); 
        }
    }
}

// ==========================================
// 8. 기타 이벤트
// ==========================================
if(btnTimer) {
    btnTimer.addEventListener('click', () => {
        if (timerState === 0) timerState = 3; else if (timerState === 3) timerState = 5; else if (timerState === 5) timerState = 10; else timerState = 0;
        if (timerState === 0) btnTimer.classList.remove('on-mode'); else btnTimer.classList.add('on-mode');
        applyLanguage();
    });
}

if(btnRetro) {
    btnRetro.addEventListener('click', () => {
        isRetroOn = !isRetroOn; btnRetro.classList.toggle('on-mode');
        if (isRetroOn) { updateRetroDate(); retroDateEl.classList.remove('hidden'); } else { retroDateEl.classList.add('hidden'); }
        applyLanguage();
    });
}

function getRetroString() { const now = new Date(); return `${now.getFullYear()}. ${String(now.getMonth()+1).padStart(2,'0')}. ${String(now.getDate()).padStart(2,'0')}`; }
function updateRetroDate() { if(retroDateEl) retroDateEl.innerText = getRetroString(); }
setInterval(() => { if (isRetroOn) updateRetroDate(); }, 1000);

if(btnFrame) {
    btnFrame.addEventListener('click', () => {
        if (!navigator.onLine) { alert(t.alertNet); return; }
        if (!isPremiumMode) { document.getElementById('ad-modal').classList.remove('hidden'); return; }
        frameIndex = (frameIndex + 1) % frameStyles.length; updateFrameUI();
    });
}

function updateFrameUI() {
    if(!frameOverlay || !btnFrame) return;
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

// 스티커 드래그 로직
let isDrag=false, sX, sY, iL, iT, currentDragEl=null;
function handleStickerStart(e) { if(!isPremiumMode) return; e.preventDefault(); currentDragEl=e.target; selectSticker(currentDragEl); isDrag=true; sX=e.touches?e.touches[0].clientX:e.clientX; sY=e.touches?e.touches[0].clientY:e.clientY; const r=currentDragEl.getBoundingClientRect(), p=stickerLayer.getBoundingClientRect(); iL=r.left-p.left+(r.width/2); iT=r.top-p.top+(r.height/2); document.addEventListener('touchmove',handleStickerMove,{passive:false}); document.addEventListener('mousemove',handleStickerMove); document.addEventListener('touchend',handleStickerEnd); document.addEventListener('mouseup',handleStickerEnd); }
function handleStickerMove(e) { if(!isDrag||!currentDragEl) return; e.preventDefault(); let cX=e.touches?e.touches[0].clientX:e.clientX, cY=e.touches?e.touches[0].clientY:e.clientY; currentDragEl.style.left=`${iL+(cX-sX)}px`; currentDragEl.style.top=`${iT+(cY-sY)}px`; }
function handleStickerEnd() { isDrag=false; currentDragEl=null; document.removeEventListener('touchmove',handleStickerMove); document.removeEventListener('mousemove',handleStickerMove); document.removeEventListener('touchend',handleStickerEnd); document.removeEventListener('mouseup',handleStickerEnd); }

if(btnShutter) {
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
}

function takePhoto() {
    if(!canvas || !video) return;
    const ctx = canvas.getContext('2d');
    const vw = video.videoWidth; const vh = video.videoHeight;
    canvas.width = vw; canvas.height = vh;

    if (facingMode === 'user') { ctx.translate(vw, 0); ctx.scale(-1, 1); }
    ctx.filter = isBeautyMode && rangeBright ? `brightness(${rangeBright.value/100}) saturate(${rangeColor.value/100}) sepia(${rangeWarm.value/100}) blur(${rangeSoft.value/10}px)` : 'none';
    ctx.drawImage(video, 0, 0, vw, vh); ctx.filter = 'none';

    const style = frameStyles[frameIndex];
    if (facingMode === 'user') { ctx.scale(-1, 1); ctx.translate(-vw, 0); }
    if (style.type === 'color') { ctx.strokeStyle = style.val; ctx.lineWidth = 40; ctx.strokeRect(20, 20, vw-40, vh-40); }
    else if (style.type === 'film') { ctx.fillStyle = 'black'; const sW=60; ctx.fillRect(0,0,sW,vh); ctx.fillRect(vw-sW,0,sW,vh); ctx.fillStyle='white'; const hH=30, gap=20; for(let y=20; y<vh; y+=(hH+gap)){ ctx.fillRect(15,y,30,hH); ctx.fillRect(vw-45,y,30,hH); } }
    else if (style.type === 'rainbow') { const g=ctx.createLinearGradient(0,0,vw,vh); g.addColorStop(0,"red"); g.addColorStop(0.2,"orange"); g.addColorStop(0.4,"yellow"); g.addColorStop(0.6,"green"); g.addColorStop(0.8,"blue"); g.addColorStop(1,"violet"); ctx.strokeStyle=g; ctx.lineWidth=40; ctx.strokeRect(20,20,vw-40,vh-40); }

    if (isPremiumMode && stickerLayer && !stickerLayer.classList.contains('hidden')) {
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
    
    if(activeSticker && isStickerMenuOpen) activeSticker.classList.add('sticker-selected');
}

// PWA Install
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferredPrompt = e; if(btnInstall) btnInstall.classList.remove('hidden'); });
if(btnInstall) {
    btnInstall.addEventListener('click', async () => { if (!deferredPrompt) return; deferredPrompt.prompt(); const { outcome } = await deferredPrompt.userChoice; if (outcome === 'accepted') btnInstall.classList.add('hidden'); deferredPrompt = null; });
}
if (window.matchMedia('(display-mode: standalone)').matches && btnInstall) btnInstall.classList.add('hidden');

// 백그라운드 감지
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        if (video && video.srcObject) {
            const tracks = video.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            video.srcObject = null;
        }
    } else {
        initCamera();
    }
});

// [최종 실행 보장] 
// DOM이 다 그려진 뒤 실행하여 null 에러 방지
window.addEventListener('load', () => {
    try {
        initStickers(); 
        applyLanguage(); 
        initCamera(); 
        checkConnection(); // 초기 실행
    } catch (e) {
        console.error("Init failed:", e);
    }

    window.addEventListener('online', checkConnection);
    window.addEventListener('offline', checkConnection);
});
