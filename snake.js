var blockSize = 25;
var rows = 20;
var cols = 20;
var board;
var context;

var snakeX = blockSize * 5;
var snakeY = blockSize * 5;

var velocityX = 0;
var velocityY = 0;

// Queue to store the last two directions
var directionQueue = [];

var snakeBody = [];

var foodX;
var foodY;

var gameOver = false;

window.onload = function () {
  board = document.getElementById("board");
  board.height = rows * blockSize;
  board.width = cols * blockSize;
  context = board.getContext("2d");

  placeFood();
  document.addEventListener("keyup", changeDirection);

  setInterval(update, 50);
};

function update() {
  if (gameOver) {
    return;
  }

  // Check if the snake is aligned with the grid
  if (snakeX % blockSize === 0 && snakeY % blockSize === 0) {
    // Apply the first direction in the queue, if there is one
    if (directionQueue.length > 0) {
      var newDirection = directionQueue.shift(); // Get the oldest direction (second latest)
      velocityX = newDirection[0];
      velocityY = newDirection[1];
    }
  }

  context.fillStyle = "black";
  context.fillRect(0, 0, board.width, board.height);

  context.fillStyle = "red";
  context.fillRect(foodX, foodY, blockSize, blockSize);

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
  snakeX += (velocityX * blockSize) / 2;
  snakeY += (velocityY * blockSize) / 2;
  context.fillRect(snakeX, snakeY, blockSize, blockSize);

  for (let i = 0; i < snakeBody.length; i++) {
    context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
  }

  if (
    snakeX < 0 ||
    snakeX >= cols * blockSize ||
    snakeY < 0 ||
    snakeY >= rows * blockSize
  ) {
    gameOver = true;
    alert("Game Over");
  }

  for (let i = 0; i < snakeBody.length; i++) {
    if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
      gameOver = true;
      alert("Game Over");
    }
  }
}

function changeDirection(e) {
  // Determine the new direction based on the key pressed
  let newDirectionX = 0;
  let newDirectionY = 0;

  if (e.code == "ArrowUp" && velocityY != 1) {
    newDirectionX = 0;
    newDirectionY = -1;
  } else if (e.code == "ArrowDown" && velocityY != -1) {
    newDirectionX = 0;
    newDirectionY = 1;
  } else if (e.code == "ArrowLeft" && velocityX != 1) {
    newDirectionX = -1;
    newDirectionY = 0;
  } else if (e.code == "ArrowRight" && velocityX != -1) {
    newDirectionX = 1;
    newDirectionY = 0;
  } else {
    return; // Invalid direction or reversing direction
  }

  // Add the new direction to the queue
  if (directionQueue.length < 2) {
    directionQueue.push([newDirectionX, newDirectionY]);
  } else {
    // If there are already 2 directions, remove the oldest one and add the new one
    directionQueue.shift(); // Remove the second latest one
    directionQueue.push([newDirectionX, newDirectionY]); // Add the latest one
  }
}

function placeFood() {
  foodX = Math.floor(Math.random() * cols) * blockSize;
  foodY = Math.floor(Math.random() * rows) * blockSize;
}
