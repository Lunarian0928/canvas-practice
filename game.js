const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

const background = new Image();
background.src = './asset/img/background.png';

const spriteSheet = new Image();
spriteSheet.src = './asset/img/dog.png';

const poopImage = new Image(); 
poopImage.src = './asset/img/poop.png';

const bossMusic = document.getElementById('bossMusic');

const dog = {
  width: 60,
  height: 60,
  x: canvas.width / 2 - 30,
  y: canvas.height - 200,
  speed: 10,
};

const spriteWidth = 2227 / 2;
const spriteHeight = 2227 / 2;
let currentFrame = 0;
const totalFrames = 4;

let asteroids = [];
const asteroidInterval = 1000;
let lastAsteroidTime = 0;

let gameStarted = false;

function drawBackground() {
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
}

function drawDog() {
  const col = currentFrame % 2;
  const row = Math.floor(currentFrame / 2);

  ctx.drawImage(
    spriteSheet,
    col * spriteWidth,
    row * spriteHeight,
    spriteWidth,
    spriteHeight,
    dog.x,
    dog.y,
    dog.width,
    dog.height
  );
}

function drawAsteroids() {
  asteroids.forEach(asteroid => {
    ctx.drawImage(poopImage, asteroid.x, asteroid.y, asteroid.radius * 2, asteroid.radius * 2); 
  });
}

function moveDog(direction) {
  if (direction === 'left' && dog.x > 0) {
    dog.x -= dog.speed;
  } else if (direction === 'right' && dog.x < canvas.width - dog.width) {
    dog.x += dog.speed;
  }
}

function moveAsteroids() {
  asteroids.forEach(asteroid => {
    asteroid.y += asteroid.speed;
    if (asteroid.y > canvas.height) {
      asteroid.y = 0 - asteroid.radius;
      asteroid.x = Math.random() * canvas.width;
    }
  });
}

function collisionDetection() {
  asteroids.forEach(asteroid => {
    if (
      dog.x < asteroid.x + asteroid.radius &&
      dog.x + dog.width > asteroid.x &&
      dog.y < asteroid.y + asteroid.radius &&
      dog.y + dog.height > asteroid.y
    ) {
      bossMusic.pause();
      alert('게임 오버!');
      window.close();
    }
  });
}

function drawStartScreen() {
  if (!gameStarted) {
    drawBackground();

    ctx.fillStyle = "#292926";
    ctx.font = '700 60px "Gugi"';
    const titleText = "강아지 똥 피하기 게임";
    const titleTextWidth = ctx.measureText(titleText).width;
    ctx.fillText(titleText, (canvas.width - titleTextWidth) / 2, canvas.height / 2);

    ctx.font = '700 24px "Noto Sans KR"';
    const startText = "스페이스바로 게임 시작";
    const startTextWidth = ctx.measureText(startText).width;
    ctx.fillText(startText, (canvas.width - startTextWidth) / 2, canvas.height / 2 + 60);

    ctx.font = '300 16px "Noto Sans KR"';
    const guideTexts = [
      '좌우 방향키: 움직이기',
      'Shift: 대시',
      'Esc: 게임 일시 정지'
    ];
    guideTexts.forEach((text, index) => {
      const textWidth = ctx.measureText(text).width;
      ctx.fillText(text, (canvas.width - textWidth) / 2, canvas.height / 2 + 180 + (index * 24));
    });
  } else {
    const countdownText = ['3', '2', '1'];
    let i = 0;

    const countdown = () => {
      if (i < countdownText.length) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = '60px "Noto Sans KR"';
        ctx.fillStyle = 'white';
        const text = countdownText[i];
        const textWidth = ctx.measureText(text).width;
        ctx.fillText(text, (canvas.width - textWidth) / 2, canvas.height / 2);
        i++;
        setTimeout(countdown, 1000);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        startGame();
      }
    };

    countdown();
  }
}

drawStartScreen();

document.addEventListener('keydown', event => {
  if (event.key === ' ') {
    gameStarted = true;
    drawStartScreen();
  }
});

function startGame() {
  bossMusic.play();
  function drawFrame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawDog();
    drawAsteroids();
    moveAsteroids();
    collisionDetection();
    requestAnimationFrame(drawFrame);

    const currentTime = new Date().getTime();
    if (currentTime - lastAsteroidTime > asteroidInterval) {
      lastAsteroidTime = currentTime;
      asteroids.push({
        x: Math.random() * canvas.width,
        y: 0,
        radius: Math.random() * 20 + 10,
        speed: Math.random() * 3 + 1,
      });
    }
  }
  drawFrame();
}

document.addEventListener('keydown', event => {
  if (gameStarted) {
    if (event.key === 'ArrowLeft') {
      moveDog('left');
    } else if (event.key === 'ArrowRight') {
      moveDog('right');
    }
  }
});
