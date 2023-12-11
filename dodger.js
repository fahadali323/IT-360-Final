let WINDOWWIDTH = 600;
let WINDOWHEIGHT = 600;
let TEXTCOLOR = [0, 0, 0];
let BACKGROUNDCOLOR = [100, 100, 100];
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
let score = 0;
let topScore = 0;
let reverseCheat = false;
let slowCheat = false;
let baddieAddCounter = 0;

function setup() {
  createCanvas(WINDOWWIDTH, WINDOWHEIGHT);
  frameRate(FPS);
  playerRect = createVector(WINDOWWIDTH / 2, WINDOWHEIGHT - 50);
  baddieImage = loadImage('./assets/baddie.png');
  textAlign(CENTER, CENTER);
}

function draw() {
  background(BACKGROUNDCOLOR);

  // Move the player around.
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
    playerRect.x -= PLAYERMOVERATE;
  }
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
    playerRect.x += PLAYERMOVERATE;
  }
  if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
    playerRect.y -= PLAYERMOVERATE;
  }
  if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
    playerRect.y += PLAYERMOVERATE;
  }

  // Add new baddies at the top of the screen, if needed.
  if (!reverseCheat && !slowCheat) {
    baddieAddCounter++;
  }
  if (baddieAddCounter === ADDNEWBADDIERATE) {
    baddieAddCounter = 0;
    let baddieSize = floor(random(BADDIEMINSIZE, BADDIEMAXSIZE));
    let newBaddie = {
      position: createVector(random(0, WINDOWWIDTH - baddieSize), 0 - baddieSize),
      speed: floor(random(BADDIEMINSPEED, BADDIEMAXSPEED)),
      size: baddieSize,
    };
    baddies.push(newBaddie);
  }

  // Move the baddies down.
  for (let b of baddies) {
    if (!reverseCheat && !slowCheat) {
      b.position.y += b.speed;
    } else if (reverseCheat) {
      b.position.y -= 5;
    } else if (slowCheat) {
      b.position.y += 1;
    }
  }

  // Delete baddies that have fallen past the bottom.
  for (let i = baddies.length - 1; i >= 0; i--) {
    if (baddies[i].position.y > WINDOWHEIGHT) {
      baddies.splice(i, 1);
    }
  }

  // Draw the game world on the window.
  for (let b of baddies) {
    image(baddieImage, b.position.x, b.position.y, b.size, b.size);
  }

  // Draw the player's rectangle.
  fill(0);
  rect(playerRect.x, playerRect.y, 20, 20);

  // Check if any of the baddies have hit the player.
  for (let b of baddies) {
    if (collideRectRect(playerRect.x, playerRect.y, 20, 20, b.position.x, b.position.y, b.size, b.size)) {
      if (score > topScore) {
        topScore = score;
      }
      restartGame();
    }
  }

  // Draw the score and top score.
  fill(0);
  textSize(20);
  text(`Score: ${score}`, 10, 20);
  text(`Top Score: ${topScore}`, 10, 60);

  score++;
}

function restartGame() {
  baddies = [];
  score = 0;
  playerRect = createVector(WINDOWWIDTH / 2, WINDOWHEIGHT - 50);
}

function keyPressed() {
  if (keyCode === ESCAPE) {
    reverseCheat = false;
    slowCheat = false;
    score = 0;
    restartGame();
  }
  if (key === 'z') {
    reverseCheat = true;
  }
  if (key === 'x') {
    slowCheat = true;
  }
}
