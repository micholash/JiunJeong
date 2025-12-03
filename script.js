const dino = document.getElementById('dino');
const cactus = document.getElementById('cactus');
const scoreDisplay = document.getElementById('score');
const gameOverMessage = document.getElementById('game-over-message');

let isJumping = false;
let isGameOver = false;
let score = 0;

// === 물리 및 애니메이션 변수 ===
let positionY = 0;      // 공룡의 현재 Y축 위치 (바닥으로부터의 높이, 0이 바닥)
let velocityY = 0;      // 공룡의 현재 Y축 속도
const gravity = 0.6;    // 중력 가속도 (양수, 아래로 당기는 힘)
const jumpForce = 12;   // 점프 초기 힘 (양수, 초기 속도를 아래로 향하는 힘에 반대로 작용시키기 위함)
let animationFrameId = null; // requestAnimationFrame ID

// === 1. 점프 로직 (물리 기반) ===
function jump() {
    // 게임 오버 상태이거나 이미 점프 중이면 무시
    if (isJumping || isGameOver) return;
    
    isJumping = true;
    velocityY = -jumpForce; // 위로 향하는 힘은 속도를 '감소'시켜야 하므로 음수로 시작
}

// === 2. 애니메이션 루프 (requestAnimationFrame 사용) ===
function applyPhysics() {
    if (isGameOver) {
        // 게임 오버 시 애니메이션 루프 종료
        cancelAnimationFrame(animationFrameId);
        return;
    }

    // A. Y축 위치/속도 업데이트 (중력 적용)
    // 중력은 아래 방향(positionY를 감소시키는 방향)으로 작용하므로, velocityY에 양수 gravity를 더함
    velocityY += gravity;         
    
    // 위치 업데이트: positionY에서 velocityY를 '뺌'
    // velocityY가 음수(위로)일 때 positionY는 증가(+)하고, 양수(아래로)일 때 positionY는 감소(-)함.
    positionY -= velocityY;       

    // B. 바닥 충돌 처리 (착지)
    if (positionY < 0) {
        // 위치가 0보다 작아지면 (바닥 아래로 내려가면)
        positionY = 0;              // 위치를 바닥에 고정
        velocityY = 0;              // 속도 0
        isJumping = false;          // 점프 종료
    }

    // C. 공룡 DOM 위치 업데이트
    dino.style.bottom = `${positionY}px`;

    // D. 다음 프레임 요청
    animationFrameId = requestAnimationFrame(applyPhysics);
}


// === 3. 게임 루프 (선인장 이동 및 충돌) ===

let cactusMoveInterval;
let speed = 5; // 선인장 기본 속도

function startGameLoop() {
    // 모든 상태 초기화
    isGameOver = false;
    score = 0;
    totalMoves = 0; // 이전에 사용된 변수라면 초기화
    scoreDisplay.innerText = score;
    gameOverMessage.classList.add('hidden');
    dino.style.backgroundColor = 'green';
    
    // 물리 변수 초기화 및 공룡 위치 고정
    positionY = 0; 
    velocityY = 0;
    isJumping = false;
    dino.style.bottom = '0px'; // CSS 위치도 0으로 설정
    speed = 5; // 속도 초기화

    // 기존 타이머와 애니메이션 루프 정리
    if (cactusMoveInterval) clearInterval(cactusMoveInterval);
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    
    // 물리 기반 애니메이션 루프 시작
    applyPhysics();

    // 선인장 이동 및 점수 로직
    let cactusPosition = 600;

    cactusMoveInterval = setInterval(() => {
        if (isGameOver) return;

        cactusPosition -= speed;
        
        // 선인장이 화면 밖으로 나가면 리셋
        if (cactusPosition < -20) {
            cactusPosition = 600; 
            score++;
            scoreDisplay.innerText = score;
            
            // 10점마다 속도 증가 
            if (score % 10 === 0) { 
                 speed += 0.5;
            }
        }
        cactus.style.right = `${600 - cactusPosition}px`;

        // === 4. 충돌 감지 ===
        const dinoRect = dino.getBoundingClientRect();
        const cactusRect = cactus.getBoundingClientRect();

        // X축 충돌 조건
        const xCollision = dinoRect.left < cactusRect.right && dinoRect.right > cactusRect.left;
        
        // Y축 충돌 조건 (공룡의 아랫 부분이 선인장의 윗 부분보다 아래에 있지 않을 때)
        // 공룡의 bottom (CSS height)이 선인장의 top (CSS height)을 넘지 않을 때 충돌
        const yCollision = dinoRect.bottom > cactusRect.top; 

        if (xCollision && yCollision) {
            endGame();
        }
        
    }, 20); 
}

function endGame() {
    isGameOver = true;
    clearInterval(cactusMoveInterval);
    cancelAnimationFrame(animationFrameId); 
    
    gameOverMessage.classList.remove('hidden');
    dino.style.backgroundColor = 'red';
}

function restartGame() {
    startGameLoop(); // 상태 초기화 및 게임 재시작
}

// === 이벤트 리스너 ===
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        if (isGameOver) {
            restartGame();
        } else {
            jump(); 
        }
    }
});

// HTML 문서의 모든 요소 로드 후 게임 루프 시작
document.addEventListener('DOMContentLoaded', startGameLoop);
