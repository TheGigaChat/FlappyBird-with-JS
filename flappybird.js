// Initialize

let board;
let boardWidth = 360;
let boardHeight = 640;
let context;
let gameOver = false;
let score = 0;

//bird
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdWidth = 34;
let birdHeight = 24;
let birdImg;

let bird = {
  x: birdX,
  y: birdY,
  width: birdWidth,
  height: birdHeight,
};

//pipes
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;
let topPipeImg;
let botPipeImg;
let openingSpace = boardHeight / 4;

//physics
let velocityX = -2;
let velocityY = 0;
let gravity = 0.2;

window.onload = function () {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d");

  // load images
  birdImg = new Image();
  birdImg.src = "Img/flappybird.png";
  birdImg.onload = function () {
    context.drawImage(birdImg, bird.x, bird.y, birdWidth, birdHeight);
  };

  topPipeImg = new Image();
  topPipeImg.src = "Img/toppipe.png";
  context.drawImage(topPipeImg, pipeX, pipeY, pipeWidth, pipeHeight);

  botPipeImg = new Image();
  botPipeImg.src = "Img/bottompipe.png";
  context.drawImage(botPipeImg, pipeX, pipeY, pipeWidth, pipeHeight);

  requestAnimationFrame(update);
  setInterval(placePipes, 1100);
  document.addEventListener("keydown", moveBird);
};

function update() {
  if (gameOver) {
    return;
  }
  requestAnimationFrame(update);
  context.clearRect(0, 0, boardWidth, boardHeight);

  // bird
  velocityY += gravity;
  /* birdY += velocityY; */
  bird.y = Math.max(bird.y + velocityY, 0); // limit the flying zone
  context.drawImage(birdImg, bird.x, bird.y, birdWidth, birdHeight);

  if (bird.y + bird.height > boardHeight) {
    gameOver = true;
  }

  // pipes
  for (let i = 0; i < pipeArray.length; i++) {
    let pipe = pipeArray[i];
    pipe.x += velocityX;
    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

    if (!pipe.passed && bird.x > pipe.x + pipe.width / 2) {
      score += 0.5;
      pipe.passed = true;
    }

    if (detectCollision(bird, pipe)) {
      gameOver = true;
    }
  }

  // clear pipes
  while (pipeArray.length > 0 && pipeArray[0].x + pipeArray[0].width < 0) {
    pipeArray.shift();
  }

  //score
  context.fillStyle = "white";
  context.font = "45px sans-serif";
  context.fillText(score, 5, 45);

  if (gameOver) {
    context.fillText("GAME OVER", boardWidth / 2 - 135, boardHeight / 2 + 25);
  }
}

placePipes = () => {
  if (gameOver) {
    return;
  }
  let randomPipeY = pipeY - pipeHeight / 2 - (Math.random() * pipeHeight) / 4;

  let topPipe = {
    img: topPipeImg,
    x: pipeX,
    y: randomPipeY,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };

  pipeArray.push(topPipe);

  let botPipe = {
    img: botPipeImg,
    x: pipeX,
    y: randomPipeY + pipeHeight + openingSpace,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };

  pipeArray.push(botPipe);
};

moveBird = (e) => {
  if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyW") {
    // jump
    velocityY = -6;
  }

  if (gameOver) {
    //reset
    location.reload();
  }
};

function detectCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
