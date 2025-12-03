// script.js (수정된 applyPhysics 함수)

function applyPhysics() {
    if (isGameOver) {
        cancelAnimationFrame(animationFrameId);
        return;
    }

    // A. Y축 위치/속도 업데이트 (중력 적용)
    velocityY += gravity;         // 중력에 의해 속도 증가 (아래로 당겨짐)
    
    // ★★★★ 수정: 위치를 뺄셈 대신 덧셈으로 업데이트 ★★★★
    // 이전에 positionY를 높이로 정의했으므로, 
    // 속도가 음수(위로)일 때는 positionY가 증가하고, 양수(아래로)일 때는 positionY가 감소해야 함.
    positionY += velocityY;       // 위치 업데이트: positionY에 속도(velocityY)를 더합니다.
    // 현재 velocityY가 양수(아래)이므로 positionY는 증가해야 하지만,
    // 점프 로직이 'velocityY'를 음수(위)로 만들기 때문에, Y축 방향을 바꿔야 합니다.

    // 💡 더 직관적인 계산을 위해, Y축을 실제 CSS bottom 값과 일치시키고, 중력을 양수로 유지합시다.
    
    // ★★★ 최종 수정: Y축 속도와 위치 업데이트 ★★★
    positionY += velocityY;   // Y축 위치에 속도 적용
    velocityY -= gravity;     // 중력을 빼서, 위로 향하는 힘(양수)을 점차 감소시킴
    // (이렇게 하려면, 점프 시 초기 velocityY를 양수로 설정해야 합니다.)
    
    // 이 방식 대신, 가장 안전한 방법은 바닥 충돌 시점을 명확히 하는 것입니다.

    // === 안전한 수정: 기존 로직에서 Y축이 음수가 되는 것을 방지 ===

    // 1. 중력 적용 (속도 변경)
    velocityY += gravity;

    // 2. 위치 변경
    // positionY -= velocityY; // <- 이 부분이 문제

    positionY = positionY - velocityY; // positionY는 0이 바닥, 양수가 높이

    // B. 바닥 충돌 처리 (착지)
    if (positionY < 0) { // ★★★ 수정: 0보다 작아지면 (바닥 아래로 내려가면)
        positionY = 0;              
        velocityY = 0;              
        isJumping = false;          
    }

    // C. 공룡 DOM 위치 업데이트
    dino.style.bottom = `${positionY}px`;

    // D. 다음 프레임 요청
    animationFrameId = requestAnimationFrame(applyPhysics);
}

// startGameLoop 함수 내부나 시작 시
function startGameLoop() {
    // ...
    // 초기화 시 positionY와 velocityY를 0으로 설정했는지 다시 확인
    positionY = 0; 
    velocityY = 0;
    // ...
}
