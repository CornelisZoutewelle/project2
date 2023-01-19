const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

class SnakePart{
    constructor(x, y){
      this.x = x;
      this.y = y;
    }
}

let speed = 7;

let tileCount = 20;
let tileSize = canvas.width / tileCount - 2;

let appleX = 5;
let appleY = 5;

let headX = 10;
let headY = 10;
const SnakeParts = [];
let tailLenght = 2;

let xVelocity = 0;
let yVelocity = 0;

let score = 0;

const gulpSound = new Audio("gulp.mp3");

//gameloop
function drawGame(){
  changeSnakePosition();
  let result = isGameOver();
  if(result == true){
    return;
  }
  ClearScreen();

  if(score >= 2){
    speed = 9;
  }
  if(score >= 5){
    speed = 11;
  }
  if(score >= 10){
    speed = 13;
  }
  if(score >= 15){
    speed = 15;
  }
  if(score >= 20){
    speed = 17;
  }

  checkAppleCollision();
  drawApple();
  drawSnake();
  drawScore();

  setTimeout(drawGame, 1000/ speed);
}

function ClearScreen(){
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function changeSnakePosition(){
  headX = headX + xVelocity;
  headY = headY + yVelocity;
}

function isGameOver(){
  let gameOver = false;

  if(yVelocity === 0 && xVelocity === 0){
    return false;
  }

  //walls
  if(headX < 0){
    gameOver = true;
  }
  else if(headX === tileCount){
    gameOver = true;
  }
  else if(headY < 0){
    gameOver = true;
  }
  else if(headY === tileCount){
    gameOver = true;
  }

  for(let i = 0; i < SnakeParts.length; i++){
    let part = SnakeParts[i];
    if(part.x === headX && part.y === headY){
      gameOver = true;
      break;
    }
  }

  if(gameOver){
    ctx.fillStyle = 'white';
    ctx.font = "50px Verdana";

    ctx.fillText("Game over!", canvas.width / 6.5, canvas.height / 2)
  }
  return gameOver;
}

function checkAppleCollision(){
  if(appleX === headX && appleY === headY){
    appleX = Math.floor(Math.random() * tileCount)
    appleY = Math.floor(Math.random() * tileCount)
    tailLenght ++;
    score ++;
    gulpSound.play();
  }
}

function drawApple(){
  ctx.fillStyle = 'orange';
  ctx.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize);
}

function drawSnake(){
  ctx.fillStyle = 'green';
  for(let i = 0; i < SnakeParts.length; i++){
    let part = SnakeParts[i];
    ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize)
  }

  SnakeParts.push(new SnakePart(headX, headY));
  if(SnakeParts.length > tailLenght){
    SnakeParts.shift(); //removes the furthest item
  }

  ctx.fillStyle = 'red';
  ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);
}

function drawScore(){
  ctx.fillStyle = 'white';
  ctx.font = '15px Verdana'
  ctx.fillText("Score: " + score, canvas.width -80, 20)
}

document.body.addEventListener('keydown', keyDown);

//move up
function keyDown(event){
  if (event.keyCode == 87){
    if(yVelocity == 1){
      return;
    }
    yVelocity = -1;
    xVelocity = 0;
  }

  //move down
  if (event.keyCode == 83){
    if(yVelocity == -1){
      return;
    }
    yVelocity = 1;
    xVelocity = 0;
  }

  //moveleft
  if (event.keyCode == 65){
    if(xVelocity == 1){
      return;
    }
    yVelocity = 0;
    xVelocity = -1;
  }

    //moveright
    if (event.keyCode == 68){
      if(xVelocity == -1){
        return;
      }
      yVelocity = 0;
      xVelocity = 1;
    }
}

drawGame();