const pan = document.getElementById('bungeoppang-pan');
const icon = document.getElementById('status-icon');
const btnBatter = document.getElementById('btn-batter');
const btnFilling = document.getElementById('btn-filling');
const btnBake = document.getElementById('btn-bake');
const btnHarvest = document.getElementById('btn-harvest');
const progressContainer = document.querySelector('.progress-container');
const progressBar = document.getElementById('baking-progress');
const messageArea = document.getElementById('message-area');
const scoreDisplay = document.getElementById('score');
const timeDisplay = document.getElementById('time');
const btnStart = document.getElementById('btn-start');

let state = 'idle'; // idle, batter, filling, baking, done
let score = 0;
let timeLeft = 30;
let gameInterval;
let bakeInterval;
let bakeProgress = 0;
let isPlaying = false;

const PERFECT_MIN = 70;
const PERFECT_MAX = 90;

function updateBtns() {
    btnBatter.disabled = state !== 'idle' || !isPlaying;
    btnFilling.disabled = state !== 'batter' || !isPlaying;
    btnBake.disabled = state !== 'filling' || !isPlaying;
    btnHarvest.disabled = state !== 'baking' || !isPlaying;
}

function showMessage(msg) {
    messageArea.textContent = msg;
}

function resetPan() {
    state = 'idle';
    pan.className = 'pan empty';
    icon.textContent = '';
    progressContainer.style.display = 'none';
    bakeProgress = 0;
    progressBar.style.width = '0%';
    clearInterval(bakeInterval);
    updateBtns();
}

btnStart.addEventListener('click', startGame);

function startGame() {
    isPlaying = true;
    score = 0;
    timeLeft = 30;
    scoreDisplay.textContent = score;
    timeDisplay.textContent = timeLeft;
    btnStart.style.display = 'none';
    resetPan();
    showMessage('주문이 들어왔어요! 30초 동안 붕어빵을 많이 만드세요!');
    
    gameInterval = setInterval(() => {
        timeLeft--;
        timeDisplay.textContent = timeLeft;
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
    
    updateBtns();
}

function endGame() {
    isPlaying = false;
    clearInterval(gameInterval);
    clearInterval(bakeInterval);
    showMessage(`영업 종료! 총 점수: ${score}점\n수고하셨습니다 👏`);
    btnStart.style.display = 'inline-block';
    btnStart.textContent = '다시 하기';
    updateBtns();
}

btnBatter.addEventListener('click', () => {
    if (state === 'idle' && isPlaying) {
        state = 'batter';
        pan.className = 'pan batter';
        icon.textContent = '💧';
        showMessage('반죽을 부었습니다.');
        updateBtns();
    }
});

btnFilling.addEventListener('click', () => {
    if (state === 'batter' && isPlaying) {
        state = 'filling';
        pan.className = 'pan filling';
        icon.textContent = '🍫';
        showMessage('쫀득한 두바이소(카다이프+피스타치오+초코) 듬뿍!');
        updateBtns();
    }
});

btnBake.addEventListener('click', () => {
    if (state === 'filling' && isPlaying) {
        state = 'baking';
        pan.className = 'pan baking';
        icon.textContent = '🔥';
        showMessage('굽는 중... 초록색 구간에 맞춰서 꺼내세요!');
        progressContainer.style.display = 'block';
        updateBtns();
        
        bakeInterval = setInterval(() => {
            bakeProgress += 1.5; // 게이지 차는 속도
            progressBar.style.width = `${bakeProgress}%`;
            
            // 색상 변화
            if (bakeProgress < PERFECT_MIN) {
                progressBar.style.backgroundColor = '#f1c40f'; // 덜익음
            } else if (bakeProgress <= PERFECT_MAX) {
                progressBar.style.backgroundColor = '#2ecc71'; // 완벽함
            } else {
                progressBar.style.backgroundColor = '#e74c3c'; // 탐
                pan.className = 'pan burnt';
                icon.textContent = '⬛';
            }
            
            if (bakeProgress >= 100) {
                clearInterval(bakeInterval);
            }
        }, 30);
    }
});

btnHarvest.addEventListener('click', () => {
    if (state === 'baking' && isPlaying) {
        clearInterval(bakeInterval);
        
        if (bakeProgress < PERFECT_MIN) {
            showMessage('앗! 덜 익었네요. (0점)');
        } else if (bakeProgress <= PERFECT_MAX) {
            showMessage('완벽한 두바이 쫀득 붕어빵 완성! (+100점)');
            score += 100;
            scoreDisplay.textContent = score;
            // 붕어빵 완성 이펙트
            icon.textContent = '🐟✨';
            pan.style.backgroundColor = '#d35400';
        } else {
            showMessage('너무 탔어요! 파사삭... (-50점)');
            score -= 50;
            if(score < 0) score = 0;
            scoreDisplay.textContent = score;
            icon.textContent = '🔥🐟';
        }
        
        state = 'done';
        updateBtns();
        
        setTimeout(() => {
            if (isPlaying) {
                resetPan();
                showMessage('다음 붕어빵을 만드세요!');
            }
        }, 1500);
    }
});
