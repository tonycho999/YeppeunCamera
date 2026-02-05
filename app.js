// ==========================================
// 1. 다국어 설정 (i18n)
// ==========================================
const translations = {
    ko: {
        timerOff: "⏱️ OFF", timer5: "⏱️ 5초", timer10: "⏱️ 10초",
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
        timerOff: "⏱️ OFF", timer5: "⏱️ 5s", timer10: "⏱️ 10s",
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
        timerOff: "⏱️ OFF", timer5: "⏱️ 5秒", timer10: "⏱️ 10秒",
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
        timerOff: "⏱️ OFF", timer5: "⏱️ 5秒", timer10: "⏱️ 10秒",
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

// 언어 감지
const userLang = navigator.language.slice(0, 2); // 'ko', 'en', 'ja', 'zh'
const t = translations[userLang] || translations['en']; // 지원 안하면 영어

// ==========================================
// 2. 변수 및 요소 설정
// ==========================================
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const stickerEl = document.getElementById('movable-sticker');
const frameOverlay = document.getElementById('frame-overlay');
const statusText = document.getElementById('status-text');
const timerDisplay = document.getElementById('timer-display');

// 버튼들
const btnTimer = document.getElementById('btn-timer');
const btnRetro = document.getElementById('btn-retro');
const btnFrame = document.getElementById('btn-frame');
const btnBeauty = document.getElementById('btn-beauty');
const btnPremium = document.getElementById('btn-premium');
const btnShutter = document.getElementById('btn-shutter');
const btnCloseAd = document.getElementById('btn-close-ad');

// 상태 변수
let isBeautyMode = false;
let isPremiumMode = false;
let isRetroOn = false;
let timerState = 0; // 0: OFF, 5: 5초, 10: 10초

// 프레임 종류 정의
const frameStyles = [
    { type: 'none', css: '' },
    { type: 'color', val: 'white', css: '20px solid white' },
    { type: 'color', val: 'black', css: '20px solid black' },
    { type: 'color', val: '#ffccd5', css: '20px solid #ffccd5' }, // 핑크
    { type: 'film', val: 'film', css: '' }, // 필름 스타일 (CSS class로 처리)
    { type: 'rainbow', val: 'rainbow', css: '' } // 무지개
];
let frameIndex = 0;

// ==========================================
// 3. 초기화 및 언어 적용
// ==========================================
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
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
        video.srcObject = stream;
    } catch (err) { console.error(err); }
}

function checkConnection() {
    if (navigator.onLine) {
        statusText.innerText = t.online;
        btnPremium.disabled = false;
        btnFrame.disabled = false;
        if (isPremiumMode) {
            btnFrame.innerText = t.frameChange;
            btnPremium.classList.add('premium-active');
        }
    } else {
        statusText.innerText = t.offline;
        btnPremium.disabled = true;
        btnFrame.disabled = true;
        if (isPremiumMode) {
            isPremiumMode = false;
            togglePremiumUI(false);
            frameIndex = 0; updateFrameUI();
        }
    }
}

// ==========================================
// 4. 기능 로직 (타이머, 레트로, 프레임)
// ==========================================

// 타이머: OFF -> 5 -> 10 -> OFF
btnTimer.addEventListener('click', () => {
    if (timerState === 0) timerState = 5;
    else if (timerState === 5) timerState = 10;
    else timerState = 0;

    if (timerState === 0) {
        btnTimer.innerText = t.timerOff;
        btnTimer.classList.remove('on-mode');
    } else {
        btnTimer.innerText = timerState === 5 ? t.timer5 : t.timer10;
        btnTimer.classList.add('on-mode');
    }
});

// 레트로(Retro) 토글
btnRetro.addEventListener('click', () => {
    isRetroOn = !isRetroOn;
    btnRetro.innerText = isRetroOn ? t.retroOn : t.retroOff;
    btnRetro.classList.toggle('on-mode');
});

// 프레임 변경
btnFrame.addEventListener('click', () => {
    if (!navigator.onLine) { alert(t.alertNet); return; }
    if (!isPremiumMode) { document.getElementById('ad-modal').classList.remove('hidden'); return; }

    frameIndex = (frameIndex + 1) % frameStyles.length;
    updateFrameUI();
});

function updateFrameUI() {
    const style = frameStyles[frameIndex];
    
    // CSS 초기화
    frameOverlay.style.border = 'none';
    frameOverlay.className = ''; 

    if (style.type === 'none') {
        btnFrame.innerText = t.frameOff;
        btnFrame.classList.remove('on-mode');
    } else {
        btnFrame.innerText = t.frameChange;
        btnFrame.classList.add('on-mode');

        if (style.type === 'color') {
            frameOverlay.style.border = style.css;
        } else if (style.type === 'film') {
            frameOverlay.classList.add('frame-film');
        } else if (style.type === 'rainbow') {
            frameOverlay.classList.add('frame-rainbow');
        }
    }
}

// ==========================================
// 5. 뽀샤시, 프리미엄, 드래그
// ==========================================
const beautySliderBox = document.getElementById('beauty-slider-box');
const beautyRange = document.getElementById('beauty-range');

function applyFilter() {
    if (isBeautyMode) {
        const level = beautyRange.value;
        const b = 1 + (level * 0.002); 
        const bl = level * 0.02; 
        const s = 1 + (level * 0.001);
        video.style.filter = `brightness(${b}) blur(${bl}px) saturate(${s})`;
        return video.style.filter;
    } else {
        video.style.filter = 'none';
        return 'none';
    }
}

btnBeauty.addEventListener('click', () => {
    isBeautyMode = !isBeautyMode;
    btnBeauty.innerText = isBeautyMode ? t.beautyOn : t.beauty;
    btnBeauty.classList.toggle('active-btn');
    isBeautyMode ? beautySliderBox.classList.remove('hidden') : beautySliderBox.classList.add('hidden');
    applyFilter();
});
beautyRange.addEventListener('input', () => { if (isBeautyMode) applyFilter(); });

btnPremium.addEventListener('click', () => {
    if (!navigator.onLine) { alert(t.alertNet); return; }
    if (!isPremiumMode) document.getElementById('ad-modal').classList.remove('hidden');
    else togglePremiumUI(!document.getElementById('sticker-bar').classList.contains('hidden'));
});

btnCloseAd.addEventListener('click', () => {
    document.getElementById('ad-modal').classList.add('hidden');
    isPremiumMode = true;
    alert(t.alertPremium);
    togglePremiumUI(true);
    btnFrame.classList.remove('on-mode'); // 프레임은 아직 선택 안함 상태
});

function togglePremiumUI(show) {
    const bar = document.getElementById('sticker-bar');
    if (show) {
        bar.classList.remove('hidden'); stickerEl.classList.remove('hidden');
        btnPremium.innerText = t.premiumOn; btnPremium.classList.add('premium-active');
    } else {
        bar.classList.add('hidden'); stickerEl.classList.add('hidden');
        btnPremium.innerText = t.premium; btnPremium.classList.remove('premium-active');
    }
}

// 스티커 드래그 (단축)
document.querySelectorAll('.sticker-btn').forEach(btn => btn.addEventListener('click', e => stickerEl.innerText = e.target.innerText));
let isDrag=false, sX, sY, iL, iT;
const startD = e => { if(!isPremiumMode)return; e.preventDefault(); isDrag=true; sX=e.touches?e.touches[0].clientX:e.clientX; sY=e.touches?e.touches[0].clientY:e.clientY; const r=stickerEl.getBoundingClientRect(), p=document.getElementById('camera-wrap').getBoundingClientRect(); iL=r.left-p.left; iT=r.top-p.top; document.addEventListener('touchmove',moveD,{passive:false}); document.addEventListener('mousemove',moveD); document.addEventListener('touchend',endD); document.addEventListener('mouseup',endD); };
const moveD = e => { if(!isDrag)return; e.preventDefault(); let cX=e.touches?e.touches[0].clientX:e.clientX, cY=e.touches?e.touches[0].clientY:e.clientY; stickerEl.style.transform='none'; stickerEl.style.left=`${iL+(cX-sX)}px`; stickerEl.style.top=`${iT+(cY-sY)}px`; };
const endD = () => { isDrag=false; document.removeEventListener('touchmove',moveD); document.removeEventListener('mousemove',moveD); document.removeEventListener('touchend',endD); document.removeEventListener('mouseup',endD); };
stickerEl.addEventListener('touchstart',startD,{passive:false}); stickerEl.addEventListener('mousedown',startD);


// ==========================================
// 6. 촬영 및 저장 (캔버스 그리기 핵심)
// ==========================================
btnShutter.addEventListener('click', () => {
    if (timerState > 0) {
        let count = timerState;
        timerDisplay.innerText = count;
        timerDisplay.classList.remove('hidden');
        const interval = setInterval(() => {
            count--;
            if (count > 0) timerDisplay.innerText = count;
            else { clearInterval(interval); timerDisplay.classList.add('hidden'); takePhoto(); }
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

    // 2. 프레임 그리기
    const style = frameStyles[frameIndex];
    // 거울모드라 좌표계가 반전되어 있음. 편의상 복구하고 그리기
    ctx.scale(-1, 1); ctx.translate(-vw, 0);

    if (style.type === 'color') {
        ctx.strokeStyle = style.val;
        ctx.lineWidth = 40;
        ctx.strokeRect(20, 20, vw-40, vh-40);
    } else if (style.type === 'film') {
        // 필름 효과: 양쪽 검은 띠 + 구멍
        ctx.fillStyle = 'black';
        const stripW = 60;
        ctx.fillRect(0, 0, stripW, vh); // 왼쪽 띠
        ctx.fillRect(vw - stripW, 0, stripW, vh); // 오른쪽 띠
        
        // 구멍 그리기
        ctx.fillStyle = 'white';
        const holeH = 30; const gap = 20;
        for (let y = 20; y < vh; y += (holeH + gap)) {
            ctx.fillRect(15, y, 30, holeH); // 왼쪽 구멍
            ctx.fillRect(vw - 45, y, 30, holeH); // 오른쪽 구멍
        }
    } else if (style.type === 'rainbow') {
        // 무지개 그라데이션
        const grad = ctx.createLinearGradient(0, 0, vw, vh);
        grad.addColorStop(0, "red"); grad.addColorStop(0.2, "orange");
        grad.addColorStop(0.4, "yellow"); grad.addColorStop(0.6, "green");
        grad.addColorStop(0.8, "blue"); grad.addColorStop(1, "violet");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 40;
        ctx.strokeRect(20, 20, vw-40, vh-40);
    }

    // 3. 스티커 (다시 거울모드 고려)
    // 현재 좌표계는 정상(0,0). 스티커 좌표 계산은 화면 비율 기반
    if (isPremiumMode && !stickerEl.classList.contains('hidden')) {
        const wrapRect = document.getElementById('camera-wrap').getBoundingClientRect();
        const stickerRect = stickerEl.getBoundingClientRect();
        
        const screenLeft = stickerRect.left - wrapRect.left; 
        const screenTop = stickerRect.top - wrapRect.top;
        const centerX = screenLeft + (stickerRect.width / 2);
        const centerY = screenTop + (stickerRect.height / 2);
        
        // 화면상 비율
        const rx = centerX / wrapRect.width;
        const ry = centerY / wrapRect.height;

        // 캔버스 좌표 (여기선 거울모드 아님, 이미 비디오는 뒤집혀 그려짐. 
        // 하지만 사용자는 거울을 보고 붙였으므로, 좌우 위치를 반전해서 그려야 사용자가 본 그 위치)
        const canvasX = (1 - rx) * vw; 
        const canvasY = ry * vh;

        ctx.font = `${stickerRect.height * (vw / wrapRect.width)}px serif`;
        ctx.fillStyle = "white"; // 기본색
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(stickerEl.innerText, canvasX, canvasY);
    }

    // 4. 레트로 날짜 (주황색)
    if (isRetroOn) {
        const now = new Date();
        const dateStr = `${now.getFullYear()}. ${String(now.getMonth()+1).padStart(2,'0')}. ${String(now.getDate()).padStart(2,'0')}`;
        ctx.font = `bold ${vw * 0.05}px 'Courier New', monospace`; // 화면 크기 비례 폰트
        ctx.fillStyle = "#ffaa00";
        ctx.textAlign = "right";
        ctx.shadowColor = "rgba(0,0,0,0.8)"; ctx.shadowBlur = 4;
        
        const paddingX = (style.type === 'film') ? 80 : 50; // 필름이면 좀 더 안쪽으로
        ctx.fillText(dateStr, vw - paddingX, vh - 50);
    }

    // 다운로드
    const link = document.createElement('a');
    link.download = `smartcam_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
}

// 실행
applyLanguage();
window.addEventListener('online', checkConnection);
window.addEventListener('offline', checkConnection);
initCamera();
checkConnection();
