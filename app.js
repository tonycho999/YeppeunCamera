const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const sticker = document.getElementById('premium-sticker');
const statusText = document.getElementById('status-text');

// 팝업 관련 요소
const adModal = document.getElementById('ad-modal');
const btnCloseAd = document.getElementById('btn-close-ad');

const btnBeauty = document.getElementById('btn-beauty');
const btnPremium = document.getElementById('btn-premium');
const btnShutter = document.getElementById('btn-shutter');

let isBeautyMode = false;
let isPremiumMode = false;

// 1. 카메라 시작
async function initCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user' },
            audio: false
        });
        video.srcObject = stream;
    } catch (err) {
        console.error(err);
        alert("카메라 권한을 허용해주세요!");
    }
}

// 2. 상태 감지
function checkConnection() {
    if (navigator.onLine) {
        statusText.innerText = "🟢 온라인 (프리미엄 사용 가능)";
        btnPremium.disabled = false;
    } else {
        statusText.innerText = "🔴 오프라인 (기본 기능만)";
        btnPremium.disabled = true;
        
        // 오프라인 되면 스티커 끄기
        if (isPremiumMode) {
            togglePremiumUI(false);
        }
    }
}

// 3. 뽀샤시 버튼
btnBeauty.addEventListener('click', () => {
    isBeautyMode = !isBeautyMode;
    if (isBeautyMode) {
        video.classList.add('filter-beauty');
        btnBeauty.classList.add('active-btn');
    } else {
        video.classList.remove('filter-beauty');
        btnBeauty.classList.remove('active-btn');
    }
});

// 4. [핵심] 프리미엄 버튼 클릭 로직
btnPremium.addEventListener('click', () => {
    if (!navigator.onLine) {
        alert("인터넷이 필요합니다!");
        return;
    }

    // 이미 켜져있으면 -> 끈다 (광고 없이)
    if (isPremiumMode) {
        togglePremiumUI(false);
    } 
    // 꺼져있으면 -> 광고 팝업을 띄운다
    else {
        adModal.classList.remove('hidden');
    }
});

// 5. [핵심] 광고 닫기 버튼 클릭 -> 스티커 활성화
btnCloseAd.addEventListener('click', () => {
    adModal.classList.add('hidden'); // 광고창 닫기
    togglePremiumUI(true); // 스티커 켜기
    alert("프리미엄 모드가 적용되었습니다!");
});

// 스티커 UI 켜고 끄는 함수
function togglePremiumUI(isOn) {
    isPremiumMode = isOn;
    if (isOn) {
        sticker.classList.remove('hidden');
        btnPremium.classList.add('premium-active');
        btnPremium.innerText = "👑 스티커 ON";
    } else {
        sticker.classList.add('hidden');
        btnPremium.classList.remove('premium-active');
        btnPremium.innerText = "👑 스티커(유료)";
    }
}

// 6. 촬영
btnShutter.addEventListener('click', () => {
    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);

    if (isBeautyMode) ctx.filter = 'brightness(1.1) contrast(0.95) saturate(1.1) blur(1px)';
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.filter = 'none';

    if (isPremiumMode) {
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.scale(-1, 1);
        ctx.font = "150px serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("🐱", 0, 0);
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
