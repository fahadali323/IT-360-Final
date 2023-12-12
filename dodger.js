let WINDOWWIDTH = 600;
let WINDOWHEIGHT = 600;
let TEXTCOLOR;
let BACKGROUNDCOLOR;
let FPS = 30;
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

function preload() {
  // Load images and sounds here
  playerImage = loadImage('./assets/player.png');
  baddieImage = loadImage('./assets/baddie.png');
}

function setup() {
  createCanvas(WINDOWWIDTH, WINDOWHEIGHT);
  TEXTCOLOR = color(255);
  BACKGROUNDCOLOR = color(0);

  playerRect = createVector(WINDOWWIDTH / 2, WINDOWHEIGHT - 50);

  // Start background music
  // backgroundMusic.loop();
}

function draw() {
  background(BACKGROUNDCOLOR);

  if (score > topScore) {
    topScore = score;
  }

  if (!reverseCheat && !slowCheat) {
    baddieAddCounter++;
  }

  if (baddieAddCounter === ADDNEWBADDIERATE) {
    baddieAddCounter = 0;
    let baddieSize = int(random(BADDIEMINSIZE, BADDIEMAXSIZE));
    let newBaddie = {
      pos: createVector(random(0, WINDOWWIDTH - baddieSize), 0 - baddieSize),
      speed: int(random(BADDIEMINSPEED, BADDIEMAXSPEED)),
      size: baddieSize,
    };
    baddies.push(newBaddie);
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
  if (moveRight && playerRect.x < WINDOWWIDTH) {
    playerRect.x += PLAYERMOVERATE;
  }
  if (moveUp && playerRect.y > 0) {
    playerRect.y -= PLAYERMOVERATE;
  }
  if (moveDown && playerRect.y < WINDOWHEIGHT) {
    playerRect.y += PLAYERMOVERATE;
  }

  // Move the baddies down
  for (let b of baddies) {
    if (!reverseCheat && !slowCheat) {
      b.pos.y += b.speed;
    } else if (reverseCheat) {
      b.pos.y -= 5;
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
    image(baddieImage, b.pos.x, b.pos.y, b.size, b.size);
  }

  // Check if any of the baddies have hit the player
  if (playerHasHitBaddie(playerRect, baddies)) {
    if (score > topScore) {
      topScore = score; // Set new top score
    }
    gameOver();
  }

  // Draw the score and top score
    drawCustomText('Score: ' + score, 10, 20);
  drawCustomText('Top Score: ' + topScore, 10, 60);

  score++; // Increase score
}

function playerHasHitBaddie(player, baddies) {
  for (let b of baddies) {
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
  gameOverSound.play();

  drawText('GAME OVER', WINDOWWIDTH / 3, WINDOWHEIGHT / 3);
  drawText('Press a key to play again.', WINDOWWIDTH / 3 - 80, WINDOWHEIGHT / 3 + 50);

  noLoop();
}

function keyPressed() {
  if (keyCode === ESCAPE) {
    noLoop();
  } else {
    loop();
    resetGame();
  }
}

function resetGame() {
  score = 0;
  playerRect.x = WINDOWWIDTH / 2;
  playerRect.y = WINDOWHEIGHT - 50;
  baddies = [];
  loop();
  // backgroundMusic.loop();
}
