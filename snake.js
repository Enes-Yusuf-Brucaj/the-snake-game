var blockSize = 64;
var rows;
var cols;
var board;
var context;

const rotateLeft = -Math.PI / 2;
const rotateRight = Math.PI / 2;
const rotateDown = Math.PI;
const rotateUp = 0;

var snakeX = blockSize * 5;
var snakeY = blockSize * 5;
var snakeRotation = rotateRight; //90 Degrees to the right
var isTurn = false; //indicate that body part is snake-rotate and should be handled differently

var velocityX = 1;
var velocityY = 0;

var directionQueue = [];

var snakeBody = [
  [snakeX, snakeY, snakeRotation, isTurn],
  [snakeX - blockSize, snakeY, snakeRotation, isTurn],
  [snakeX - blockSize * 2, snakeY, snakeRotation, isTurn],
];

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
  //Generating random tile map
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
  placeFood();
  document.addEventListener("keyup", changeDirection);

  setInterval(update, 100);
}

function update() {
  if (gameOver) {
    alert("Game Over");
    return;
  }

  context.clearRect(0, 0, board.width, board.height);
  context.drawImage(apple, foodX, foodY, blockSize, blockSize);

  if (snakeX % blockSize === 0 && snakeY % blockSize === 0) {
    if (directionQueue.length > 0) {
      var newDirection = directionQueue.shift();
      velocityX = newDirection[0];
      velocityY = newDirection[1];
      snakeRotation = newDirection[2];
      isTurn = true;
    }
  }

  if (snakeX == foodX && snakeY == foodY) {
    snakeBody.push([foodX, foodY, snakeRotation, false]);
    placeFood();
  }

  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = [...snakeBody[i - 1]];
  }

  snakeX += velocityX * blockSize;
  snakeY += velocityY * blockSize;

  if (snakeBody.length) {
    snakeBody[0] = [snakeX, snakeY, snakeRotation];
    snakeBody[1][3] = isTurn;
  }

  isTurn = false;

  if (snakeX < 0) snakeX = cols * blockSize - blockSize;
  else if (snakeX >= cols * blockSize) snakeX = 0;

  if (snakeY < 0) snakeY = rows * blockSize - blockSize;
  else if (snakeY >= rows * blockSize) snakeY = 0;

  //checking for collision
  if (snakeBody.length > 4) {
    for (let i = 1; i < snakeBody.length; i++) {
      if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
        gameOver = true;
        return;
      }
    }
  }

  for (let i = 0; i < snakeBody.length; i++) {
    const part = snakeBody[i];
    const [x, y, rotation] = part;

    var prevRotation;
    var nextRotation;

    context.save();
    context.translate(x + blockSize / 2, y + blockSize / 2); //changing context origin to be at center of snake part

    if (i > 0 && i < snakeBody.length - 1) {
      nextRotation = snakeBody[i - 1][2];
      prevRotation = snakeBody[i + 1][2];

      if (snakeBody[i][3]) {
        if (snakeBody[i + 1][3]) {
          prevRotation = rotation;
        }
        if (
          (prevRotation == rotateUp && nextRotation == rotateLeft) ||
          (prevRotation == rotateRight && nextRotation == rotateDown)
        ) {
          context.rotate(rotateUp);
        } else if (
          (prevRotation == rotateRight && nextRotation == rotateUp) ||
          (prevRotation == rotateDown && nextRotation == rotateLeft)
        ) {
          context.rotate(rotateRight);
        } else if (
          (prevRotation == rotateLeft && nextRotation == rotateDown) ||
          (prevRotation == rotateUp && nextRotation == rotateRight)
        ) {
          context.rotate(rotateLeft);
        } else if (
          (prevRotation == rotateDown && nextRotation == rotateRight) ||
          (prevRotation == rotateLeft && nextRotation == rotateUp)
        ) {
          context.rotate(rotateDown);
        }
      } else {
        context.rotate(rotation);
      }
    } else if (i == snakeBody.length - 1 && rotation != nextRotation) {
      context.rotate(snakeBody[i - 1][2]);
    } else {
      context.rotate(rotation);
    }

    context.translate(-blockSize / 2, -blockSize / 2);

    if (i == 0) {
      context.drawImage(snake_head, 0, 0, blockSize, blockSize);
    } else if (i == snakeBody.length - 1) {
      context.drawImage(snake_tail, 0, 0, blockSize, blockSize);
    } else if (snakeBody[i][3]) {
      context.drawImage(snake_rotate, 0, 0, blockSize, blockSize);
    } else {
      context.drawImage(snake_body, 0, 0, blockSize, blockSize);
    }
    context.restore();
  }
}

function changeDirection(e) {
  let newDirectionX = 0;
  let newDirectionY = 0;
  let newRotation = rotateUp;

  if (e.code == "ArrowUp") {
    newDirectionX = 0;
    newDirectionY = -1;
  } else if (e.code == "ArrowDown") {
    newDirectionX = 0;
    newDirectionY = 1;
    newRotation = rotateDown;
  } else if (e.code == "ArrowLeft") {
    newDirectionX = -1;
    newDirectionY = 0;
    newRotation = rotateLeft;
  } else if (e.code == "ArrowRight") {
    newDirectionX = 1;
    newDirectionY = 0;
    newRotation = rotateRight;
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

  //Can't go opposite to current direction
  if (
    (newDirectionX === -currentDirectionX &&
      newDirectionY === -currentDirectionY) ||
    (newDirectionX === currentDirectionX && newDirectionY === currentDirectionY)
  ) {
    return;
  }

  if (directionQueue.length < 2) {
    directionQueue.push([newDirectionX, newDirectionY, newRotation]);
  } else {
    directionQueue.shift();
    directionQueue.push([newDirectionX, newDirectionY, newRotation]);
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
