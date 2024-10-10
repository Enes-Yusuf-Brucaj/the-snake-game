var blockSize = 64;
var rows;
var cols;
var board;
var context;

var snakeX = blockSize * 5;
var snakeY = blockSize * 5;

var velocityX = 0;
var velocityY = 0;

var directionQueue = [];

var snakeBody = [];

var foodX;
var foodY;

var gameOver = false;

var grass1 = new Image();
var grass2 = new Image();
var grass3 = new Image();

var snake_body = new Image();
var snake_head = new Image();
var snake_rotate = new Image();
var snake_tail = new Image();

var apple = new Image();

var imagesLoaded = 0;

var startScreen = document.getElementById("start-screen");
var header = document.getElementById("header");
var startButton = document.getElementById("start-button");

window.onload = function () {
  console.log(startButton);

  grass1.src = "images/grass1.png";
  grass2.src = "images/grass2.png";
  grass3.src = "images/grass3.png";

  snake_body.src = "images/snake-body.png";
  snake_head.src = "images/snake-head.png";
  snake_rotate.src = "images/snake-rotate.png";
  snake_tail.src = "images/snake-tail.png";

  apple.src = "images/apple.png";

  function imageLoaded() {
    imagesLoaded++;
    if (imagesLoaded === 3) {
      setGameDimensions();
    }
  }
  grass1.onload = imageLoaded;
  grass2.onload = imageLoaded;
  grass3.onload = imageLoaded;
};

function setGameDimensions() {
  rows = Math.floor((window.innerHeight / blockSize) * 2);
  cols = Math.floor((window.innerWidth / blockSize) * 2);

  board = document.getElementById("board");
  backgroundBoard = document.getElementById("background-board");

  board.height = rows * blockSize;
  board.width = cols * blockSize;
  backgroundBoard.height = rows * blockSize;
  backgroundBoard.width = cols * blockSize;

  context = board.getContext("2d");
  backgroundContext = backgroundBoard.getContext("2d");

  context.imageSmoothingEnabled = false;
  backgroundContext.imageSmoothingEnabled = false;

  drawBackground();
}

function drawBackground() {
  //generating random tile map
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      var randomNum = Math.floor(Math.random() * 10) + 1;

      if (randomNum >= 1 && randomNum <= 4) {
        backgroundContext.drawImage(
          grass1,
          x * blockSize,
          y * blockSize,
          blockSize,
          blockSize
        );
      } else if (randomNum >= 5 && randomNum <= 8) {
        backgroundContext.drawImage(
          grass2,
          x * blockSize,
          y * blockSize,
          blockSize,
          blockSize
        );
      } else {
        backgroundContext.drawImage(
          grass3,
          x * blockSize,
          y * blockSize,
          blockSize,
          blockSize
        );
      }
    }
  }
}

startButton.addEventListener("click", function () {
  header.style.transform = "translateY(-100px)";
  startButton.remove();

  setTimeout(function () {
    startScreen.style.display = "none";
    startGame();
  }, 1000);
});

function startGame() {
  console.log("hi");
  placeFood();
  document.addEventListener("keyup", changeDirection);

  setInterval(update, 100);
}

function update() {
  if (gameOver) {
    return;
  }

  context.clearRect(0, 0, board.width, board.height);

  context.fillStyle = "red";
  context.fillRect(foodX, foodY, blockSize, blockSize);

  // Direction changing logic
  if (snakeX % blockSize === 0 && snakeY % blockSize === 0) {
    if (directionQueue.length > 0) {
      var newDirection = directionQueue.shift();
      velocityX = newDirection[0];
      velocityY = newDirection[1];
    }
  }

  if (snakeX == foodX && snakeY == foodY) {
    snakeBody.push([foodX, foodY]);
    placeFood();
  }

  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = snakeBody[i - 1];
  }
  if (snakeBody.length) {
    snakeBody[0] = [snakeX, snakeY];
  }

  context.fillStyle = "lime";
  snakeX += velocityX * blockSize;
  snakeY += velocityY * blockSize;
  context.fillRect(snakeX, snakeY, blockSize, blockSize);

  for (let i = 0; i < snakeBody.length; i++) {
    context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
  }

  // Wrapping logic
  if (snakeX < 0) {
    snakeX = cols * blockSize - blockSize; // wrap to the right side
  } else if (snakeX >= cols * blockSize) {
    snakeX = 0; // wrap to the left side
  }

  if (snakeY < 0) {
    snakeY = rows * blockSize - blockSize; // wrap to the bottom
  } else if (snakeY >= rows * blockSize) {
    snakeY = 0; // wrap to the top
  }

  for (let i = 0; i < snakeBody.length; i++) {
    if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
      gameOver = true;
      alert("Game Over");
    }
  }
}

function changeDirection(e) {
  let newDirectionX = 0;
  let newDirectionY = 0;

  if (e.code == "ArrowUp") {
    newDirectionX = 0;
    newDirectionY = -1;
  } else if (e.code == "ArrowDown") {
    newDirectionX = 0;
    newDirectionY = 1;
  } else if (e.code == "ArrowLeft") {
    newDirectionX = -1;
    newDirectionY = 0;
  } else if (e.code == "ArrowRight") {
    newDirectionX = 1;
    newDirectionY = 0;
  } else {
    return;
  }

  let currentDirectionX = velocityX;
  let currentDirectionY = velocityY;

  if (directionQueue.length > 0) {
    const lastDirection = directionQueue[directionQueue.length - 1];
    currentDirectionX = lastDirection[0];
    currentDirectionY = lastDirection[1];
  }

  if (
    newDirectionX === -currentDirectionX &&
    newDirectionY === -currentDirectionY
  ) {
    return;
  }

  if (directionQueue.length < 2) {
    directionQueue.push([newDirectionX, newDirectionY]);
  } else {
    directionQueue.shift();
    directionQueue.push([newDirectionX, newDirectionY]);
  }
}

function placeFood() {
  let validPosition = false;

  //validPosition is anywhere the snake isn't
  while (!validPosition) {
    foodX = Math.floor(Math.random() * cols) * blockSize;
    foodY = Math.floor(Math.random() * rows) * blockSize;

    validPosition = true;
    for (let i = 0; i < snakeBody.length; i++) {
      if (foodX === snakeBody[i][0] && foodY === snakeBody[i][1]) {
        validPosition = false;
        break;
      }
    }
  }
}
