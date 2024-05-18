const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const spriteSheet = new Image();
spriteSheet.src = 'dog.png';

const dog = {
  width: 50,
  height: 50,
  x: canvas.width / 2 - 25,
  y: canvas.height - 100,
  speed: 10,
};

const spriteRows = 2;
const spriteCols = 2;
let currentFrame = 2;
const totalFrames = spriteRows * spriteCols;

let asteroids = [];
const numAsteroids = 10;

const asteroidInterval = 1000;
let lastAsteroidTime = 0;

let gameStarted = false; // 게임 시작 여부를 저장하는 변수

function drawDog() {
  const col = currentFrame % spriteCols;
  const row = Math.floor(currentFrame / spriteCols);

  ctx.drawImage(
    spriteSheet,
    col * 240,
    row * 240,
    240,
    240,
    dog.x,
    dog.y,
    dog.width,
    dog.height
  );
}

function drawAsteroids() {
  asteroids.forEach(asteroid => {
    ctx.beginPath();
    ctx.fillStyle = 'red';
    ctx.arc(asteroid.x, asteroid.y, asteroid.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
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
      alert('게임 오버!');
      document.location.reload();
    }
  });
}

function drawStartScreen() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = '30px Arial';
  ctx.fillStyle = 'white';

  if (!gameStarted) {
    ctx.fillText('Press Space to Start', canvas.width / 2 - 150, canvas.height / 2);
  } else {
    ctx.fillText('3', canvas.width / 2 - 10, canvas.height / 2);
    setTimeout(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = '30px Arial';
      ctx.fillStyle = 'white';
      ctx.fillText('2', canvas.width / 2 - 10, canvas.height / 2);
      setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = '30px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText('1', canvas.width / 2 - 10, canvas.height / 2);
        setTimeout(() => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          startGame();
        }, 1000);
      }, 1000);
    }, 1000);
  }
}


drawStartScreen();

document.addEventListener('keydown', event => {
  if (event.key === ' ') {
    gameStarted = true; // 게임 시작 상태로 변경
    drawStartScreen(); // 시작 화면을 다시 그려줌
  }
});

function startGame() {
  function drawFrame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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
  if (event.key === 'ArrowLeft') {
    moveDog('left');
  } else if (event.key === 'ArrowRight') {
    moveDog('right');
  }
});
