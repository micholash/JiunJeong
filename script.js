const dino = document.getElementById('dino');
const cactus = document.getElementById('cactus');
const scoreDisplay = document.getElementById('score');
const gameOverMessage = document.getElementById('game-over-message');

let isJumping = false;
let isGameOver = false;
let score = 0;

// === 물리 및 애니메이션 변수 ===
let positionY = 0;      // 공룡의 현재 Y축 위치 (바닥으로부터의 높이)
let velocityY = 0;      // 공룡의 현재 Y축 속도
const gravity = 0.6;    // 중력 가속도 (양수)
const jumpForce = 12;   // 점프 초기 힘 (음수, 위로 향하는 힘)
let animationFrameId = null; // requestAnimationFrame ID

// === 1. 점프 로직 (물리 기반) ===
function jump() {
    // 게임 오버 상태이거나 이미 점프 중이면 무시
    if (isJumping || isGameOver) return;
    
    isJumping = true;
    velocityY = -jumpForce; // 위로 강한 힘을 가함 (Y축은 위로 갈수록 작아지는 좌표계를 따름)
}

// === 2. 애니메이션 루프 (requestAnimationFrame 사용) ===
function applyPhysics() {
    if (isGameOver) {
        cancelAnimationFrame(animationFrameId);
        return;
    }

    // A. Y축 위치/속도 업데이트 (중력 적용)
    velocityY += gravity;         // 중력에 의해 속도 증가 (아래로 당겨짐)
    positionY -= velocityY;       // 위치 업데이트 (속도만큼 위치 변경)

    // B. 바닥 충돌 처리 (착지)
    if (positionY > 0) {
        positionY = 0;              // 바닥에 고정
        velocityY = 0;              // 속도 0
        isJumping = false;          // 점프 종료
    }

    // C. 공룡 DOM 위치 업데이트
    // positionY는 바닥으로부터의 높이이므로, CSS 'bottom' 속성에 바로 적용
    dino.style.bottom = `${positionY}px`;

    // D. 다음 프레임 요청
    animationFrameId = requestAnimationFrame(applyPhysics);
}


// === 3. 장애물 이동 및 충돌 감지 로직 (이전 코드 유지) ===

let cactusMoveInterval;

function startGameLoop() {
    isGameOver = false;
    gameOverMessage.classList.add('hidden');
    score = 0;
    scoreDisplay.innerText = score;

    dino.style.backgroundColor = 'green';

    // 물리 기반 애니메이션 루프 시작
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    applyPhysics(); // <-- 새로운 애니메이션 루프 시작

    // 선인장 이동 애니메이션 (기존 JS 로직 유지)
    let cactusPosition = 600;
    let speed = 5; 

    cactusMoveInterval = setInterval(() => {
        if (isGameOver) return;

        cactusPosition -= speed;
        if (cactusPosition < -20) {
            cactusPosition = 600; 
            score++;
            scoreDisplay.innerText = score;
            
            // 10점마다 속도 증가 (선택 사항)
            if (score % 10 === 0) { 
                 speed += 0.5;
            }
        }
        cactus.style.right = `${600 - cactusPosition}px`;

        // === 4. 충돌 감지 ===
        const dinoRect = dino.getBoundingClientRect();
        const cactusRect = cactus.getBoundingClientRect();

        const collision = 
            dinoRect.left < cactusRect.right &&
            dinoRect.right > cactusRect.left &&
            // 공룡이 땅에 붙어 있거나(positionY=0) 점프 중일 때 높이 검사
            (dinoRect.bottom > cactusRect.top && dinoRect.bottom < cactusRect.bottom);
            // 점프를 통해 선인장 위를 지나갈 때 충돌을 피하게 됩니다.

        if (collision) {
            endGame();
        }
        
    }, 20); 
}

function endGame() {
    isGameOver = true;
    clearInterval(cactusMoveInterval);
    cancelAnimationFrame(animationFrameId); // 애니메이션 루프 종료
    
    gameOverMessage.classList.remove('hidden');
    dino.style.backgroundColor = 'red';
}

function restartGame() {
    isGameOver = false;
    dino.style.backgroundColor = 'green';
    cactus.style.right = '-20px'; 
    positionY = 0; 
    velocityY = 0;
    isJumping = false;
    startGameLoop();
}

// 키보드 이벤트 리스너: 스페이스바를 누르면 점프
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        if (isGameOver) {
            restartGame();
        } else {
            jump(); // jump 함수 호출
        }
    }
});

// 게임 시작
document.addEventListener('DOMContentLoaded', startGameLoop);
