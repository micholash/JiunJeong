const dino = document.getElementById('dino');
const cactus = document.getElementById('cactus');
const scoreDisplay = document.getElementById('score');
const gameOverMessage = document.getElementById('game-over-message');

let isJumping = false;
let isGameOver = false;
let score = 0;
let gameLoopInterval;
let cactusMoveInterval;

// === 1. 점프 기능 ===
function jump() {
    if (isJumping || isGameOver) return;
    isJumping = true;
    
    let jumpHeight = 80;
    let jumpDuration = 200; // ms
    
    // 점프: 높이 올리기
    dino.style.bottom = `${jumpHeight}px`;
    
    // 착지: 잠시 후 바닥으로 내리기
    setTimeout(() => {
        dino.style.bottom = '0px';
        isJumping = false;
    }, jumpDuration * 2); 
}

// 키보드 이벤트 리스너: 스페이스바를 누르면 점프
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        if (isGameOver) {
            restartGame();
        } else {
            jump();
        }
    }
});

// === 2. 장애물 이동 및 충돌 감지 ===
function startGameLoop() {
    isGameOver = false;
    gameOverMessage.classList.add('hidden');
    score = 0;
    scoreDisplay.innerText = score;

    // 선인장 이동 애니메이션 (CSS 대신 JS로 위치 조정)
    let cactusPosition = 600;
    let speed = 5; // 이동 속도
    let scoreCounter = 0;

    cactusMoveInterval = setInterval(() => {
        if (isGameOver) return;

        cactusPosition -= speed;
        if (cactusPosition < -20) { // 화면 밖으로 나가면
            cactusPosition = 600; // 다시 오른쪽 끝으로 이동
            scoreCounter++;
            if (scoreCounter % 5 === 0) { // 일정 횟수 장애물 회피 시 속도 증가
                 speed += 0.5;
            }
        }
        cactus.style.right = `${600 - cactusPosition}px`; // 오른쪽에서 왼쪽으로 이동

        // === 3. 충돌 감지 ===
        const dinoRect = dino.getBoundingClientRect();
        const cactusRect = cactus.getBoundingClientRect();

        // 충돌 조건: 공룡과 선인장의 경계 상자가 겹칠 때
        const collision = 
            dinoRect.left < cactusRect.right &&
            dinoRect.right > cactusRect.left &&
            dinoRect.top < cactusRect.bottom &&
            dinoRect.bottom > cactusRect.top;

        if (collision) {
            endGame();
        }
        
    }, 20); // 50ms마다 위치 업데이트

    // 점수 증가 로직
    gameLoopInterval = setInterval(() => {
        if (!isGameOver) {
            score++;
            scoreDisplay.innerText = score;
        }
    }, 100);
}

function endGame() {
    isGameOver = true;
    clearInterval(gameLoopInterval);
    clearInterval(cactusMoveInterval);
    
    gameOverMessage.classList.remove('hidden');
    dino.style.backgroundColor = 'red'; // 충돌 시 색상 변경
}

function restartGame() {
    dino.style.backgroundColor = 'green';
    cactus.style.right = '-20px'; // 선인장 위치 초기화
    startGameLoop();
}

// 게임 시작
startGameLoop();
