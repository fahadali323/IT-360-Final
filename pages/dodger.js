let WINDOWWIDTH = 600;
let WINDOWHEIGHT = 600;
let TEXTCOLOR;
let BACKGROUNDCOLOR = [
  'rgb(255, 100, 50)',
  'rgb(230, 100, 10)',
  'rgb(204, 100, 100)',
  'rgb(179, 100, 60)',
  'rgb(153, 100, 70)',
  'rgb(128, 100, 80)',
  'rgb(102, 100, 90)',
  'rgb(77, 100, 200)',
  'rgb(51, 100, 140)',
  'rgb(26, 100, 220)',
  'rgb(0, 100, 10)'
];
let FPS = 45;
let BADDIEMINSIZE = 10;
let BADDIEMAXSIZE = 40;
let BADDIEMINSPEED = 1;
let BADDIEMAXSPEED = 8;
let ADDNEWBADDIERATE = 6;
let PLAYERMOVERATE = 6;

let playerRect;
let baddieImage;
let baddies = [];
let topScore = 0;
let score = 0;
let moveLeft = false;
let moveRight = false;
let moveUp = false;
let moveDown = false;
let reverseCheat = false;
let slowCheat = false;
let baddieAddCounter = 0;
let playerImage;
let slowDownImage;

function preload() {
  // Load images and sounds here
  playerImage = loadImage("../assets/player.png");
  baddieImage = loadImage("../assets/baddie.png");
  slowDownImage = loadImage("../assets/slow.png")
}

function setup() {
  createCanvas(WINDOWWIDTH, WINDOWHEIGHT);
  frameRate(FPS);
  TEXTCOLOR = color(255);
  //BACKGROUNDCOLOR = color(0);

  playerRect = createVector(WINDOWWIDTH / 2, WINDOWHEIGHT - 50);

  // Start background music
  // backgroundMusic.loop();
}

function keyPressed() {
  if (key === "x" || key === "X") {
    reverseCheat = true;
  } else if (key === "z" || key === "Z" ) {
    slowCheat = true;
  }
}

function keyReleased() {
  if (key === "x" || key === "X") {
    reverseCheat = false;
  } else if (key === "z" || key === "Z") {
    slowCheat = false;
  }
}


function playerHasHitBaddie(player, baddies) {
  for (let i = 0;  i < baddies.length; i++) {
    let b = baddies[i];
    if(!b.bad){
      if (
        player.x < b.pos.x + b.size &&
        player.x + playerImage.width > b.pos.x &&
        player.y < b.pos.y + b.size &&
        player.y + playerImage.height > b.pos.y
      ) {
        baddies.splice(i, 1)
        slowCheat = true;
        return false;
      }
    }
    if (
      player.x < b.pos.x + b.size &&
      player.x + playerImage.width > b.pos.x &&
      player.y < b.pos.y + b.size &&
      player.y + playerImage.height > b.pos.y
    ) {
      return true;
    }
  }
  return false;
}

function drawCustomText(customText, x, y) {
  fill(TEXTCOLOR);
  textSize(16);
  text(customText, x, y);
}

function gameOver() {
  // backgroundMusic.stop();
  // gameOverSound.play();

  drawCustomText("GAME OVER", WINDOWWIDTH / 3, WINDOWHEIGHT / 3);
  drawCustomText(
    "Press a key to play again.",
    WINDOWWIDTH / 3 - 80,
    WINDOWHEIGHT / 3 + 50
  );

  noLoop();
  function resetOnKeyPress() {
    resetGame();
    loop(); // Resume the loop
    removeKeyListener(); // Remove the key press event listener
  }

  function removeKeyListener() {
    window.removeEventListener('keydown', resetOnKeyPress);
  }

  // Listen for a key press to reset the game
  window.addEventListener('keydown', resetOnKeyPress);
}


function resetGame() {
  score = 0;
  playerRect.x = WINDOWWIDTH / 2;
  playerRect.y = WINDOWHEIGHT - 50;
  baddies = [];
  slowCheat = false;
  loop();
  // backgroundMusic.loop();
}


let time = 0;
let idx = 0;
let direction = 1;
let slowCheatTime = 0;
function draw() {
  idx += direction;

  // Check if idx has reached the bounds and change the direction accordingly
  if (idx >= BACKGROUNDCOLOR.length - 1 || idx <= 0) {
    direction *= -1;
  }

  background(BACKGROUNDCOLOR[idx]);
  if (score > topScore) {
    topScore = score;
  }

  if (!reverseCheat && !slowCheat) {
    baddieAddCounter++;
  }
  //continues to spawn baddies but at a slower rate
  if(slowCheat) {
    if(time % 4 === 0){
      baddieAddCounter++;

    }
    if(slowCheatTime > 100){
      slowCheatTime = 0;
      slowCheat = false;
    }
    slowCheatTime++;

  }
  console.log(baddieAddCounter);
  if (baddieAddCounter === ADDNEWBADDIERATE) {
    baddieAddCounter = 0;
    let baddieSize = int(random(BADDIEMINSIZE, BADDIEMAXSIZE));
    let newBaddie = {
      pos: createVector(random(0, WINDOWWIDTH - baddieSize), 0 - baddieSize),
      speed: int(random(BADDIEMINSPEED, BADDIEMAXSPEED)),
      size: baddieSize,
      bad: true,
    };
    baddies.push(newBaddie);
  }
  if(time % 150 === 0 && time !== 0) {
    let baddieSize = BADDIEMAXSIZE;
    let powerUp = {
      pos: createVector(random(0, WINDOWWIDTH - baddieSize), 0 - baddieSize),
      speed: int(random(BADDIEMINSPEED, BADDIEMAXSPEED)),
      size: baddieSize,
      bad: false,
    }
    baddies.push(powerUp);
  }

  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
    moveLeft = true;
    moveRight = false;
  } else if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
    moveLeft = false;
    moveRight = true;
  } else {
    moveLeft = false;
    moveRight = false;
  }

  if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
    moveUp = true;
    moveDown = false;
  } else if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
    moveUp = false;
    moveDown = true;
  } else {
    moveUp = false;
    moveDown = false;
  }

  // Move the player around
  if (moveLeft && playerRect.x > 0) {
    playerRect.x -= PLAYERMOVERATE;
  }
  if (moveRight && playerRect.x < WINDOWWIDTH - playerImage.width) {
    playerRect.x += PLAYERMOVERATE;
  }
  if (moveUp && playerRect.y > 0) {
    playerRect.y -= PLAYERMOVERATE;
  }
  if (moveDown && playerRect.y < WINDOWHEIGHT - playerImage.height) {
    playerRect.y += PLAYERMOVERATE;
  }


  // Move the baddies down
  for (let b of baddies) {
    if (!reverseCheat && !slowCheat) {
      b.pos.y += b.speed;
    } else if (reverseCheat) {
      b.pos.y -= 5; // Adjust the reverse speed as needed
    } else if (slowCheat) {
      b.pos.y += 1;
    }
  }

  // Delete baddies that have fallen past the bottom
  for (let i = baddies.length - 1; i >= 0; i--) {
    if (baddies[i].pos.y > WINDOWHEIGHT) {
      baddies.splice(i, 1);
    }
  }

  // Draw the player's rectangle
  image(playerImage, playerRect.x, playerRect.y);

  // Draw each baddie
  for (let b of baddies) {
    let currentImage
    if(!b.bad){
      currentImage = slowDownImage;
    } else{
      currentImage = baddieImage;
    }
    image(currentImage, b.pos.x, b.pos.y, b.size, b.size);
  }

  // Check if any of the baddies have hit the player
  if (playerHasHitBaddie(playerRect, baddies)) {
    if (score > topScore) {
      topScore = score; // Set new top score
    }
    gameOver();
  }

  // Draw the score and top score
  drawCustomText("Score: " + score, 10, 20);
  drawCustomText("Top Score: " + topScore, 10, 60);
  if(time % 10 === 0){
    score++; // Increase score
  }
  time++;
}
