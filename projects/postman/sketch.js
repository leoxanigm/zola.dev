/*

The Game Project 5 - Bring it all together

*/

/*

Extensions:
1. Add advanced graphics:
Added randomly generated mountains with varying width and heights, a ground structure with repeating patterns, trees with different sizes, and mirror effect to add variation. Also, I have made the character look like a postman as close as possible to follow the theme of the game. Plus, implemented a parallax scrolling effect to create depth to the whole game scene.
Creating randomized mountains was challenging. Also creating a parallax effect for each layer of mountains took some time.
With this extension, I learned and practiced working with objects, arrays, calling functions, new p5js functions, and methods to create drawings and manipulate them.

2. Add sound
Added sounds for the game background theme, collectables collecting, jumping, falling, winning the game, and losing.
The main challenge with the main game background sound was to make sure it played in Chrome, stopped when the character falls, and continues when the game is restarted, is over, or won. 
I have learned and practiced how to add audio to the game, how to set sound, how to stop it, and making sure the timing is right for each.

*/

/*
Resources:
- Sky background image from https://www.freevector.com (https://www.freevector.com/sky-blue-vector-18233)
- Font from Google Fonts - https://fonts.google.com/specimen/Fredoka+One
- Ethernight Club by Kevin MacLeod
Link: https://incompetech.filmmusic.io/song/7612-ethernight-club
License: https://filmmusic.io/standard-license
- Collecting, Jumping, falling Game Over and Game won sounds by MixKit
Link: https://mixkit.co/free-sound-effects/game/
*/

let ground;
let mountains;
let manholes;
let skyBg;

let gameChar_x;
let gameChar_y;
let floorPos_y;
let scrollPos;
let gameChar_world_x;
let stepCounter; // variable to make character walk

let isLeft;
let isRight;
let isFalling;
let isPlummeting;

let collectables;
let game_score;
let lives;
let postoffice;
let gameOver; // Controls game over sound

let firstLoad; // Variable to control start screen

//Sounds
let gameBgSound;
let collectSound;
let jumpSound;
let fallSound;
let gameWinSound;
let gameOverSound;

function preload() {
  skyBg = loadImage('sky.jpg');

  soundFormats('mp3');
  // Load Sounds
  gameBgSound = loadSound(
    'audio/ethernight-club-by-kevin-macleod-from-filmmusic-io.mp3'
  );
  collectSound = loadSound('audio/collect.mp3');
  jumpSound = loadSound('audio/jump.mp3');
  gameWinSound = loadSound('audio/game-win.mp3');
  gameOverSound = loadSound('audio/game-over.mp3');
  fallSound = loadSound('audio/fall.mp3');
}

function setup() {
  createCanvas(1024, 576);
  angleMode(DEGREES);
  floorPos_y = (height * 4) / 5;

  gameBgSound.setVolume(0.1);
  collectSound.setVolume(0.2);
  gameOverSound.setVolume(0.2);
  gameWinSound.setVolume(0.2);

  // Initialise lives
  lives = 3;

  firstLoad = true;

  startGame();
}

function startGame() {
  gameOver = false;

  // Play background audio after player dies.
  if (!firstLoad) {
    // Set interval so the fall audio can finish
    let audioInterval = setInterval(function () {
      gameBgSound.play();
      clearInterval(audioInterval);
    }, 1000);
  }

  gameChar_x = width / 2;
  gameChar_y = floorPos_y;

  // Initialise ground array with three levels of bricks
  ground = [
    ...drawGround(floorPos_y + 30),
    ...drawGround(floorPos_y + 65),
    ...drawGround(floorPos_y + 100)
  ];

  // Variable to control the background scrolling.
  scrollPos = 0;

  // Variable to store the real position of the gameChar in the game
  // world. Needed for collision detection.
  gameChar_world_x = gameChar_x - scrollPos;

  // Boolean variables to control the movement of the game character.
  isLeft = false;
  isRight = false;
  isFalling = false;
  isPlummeting = false;

  // Initialise arrays of scenery objects.

  // Initialize mountains array
  mountains = drawMountains(floorPos_y + 10, 2000);

  //manholes
  manholes = [100, 400, 750, 1450];

  //collactables
  collectables = [
    {
      x_pos: 200,
      y_pos: 400,
      isFound: false
    },
    {
      x_pos: 600,
      y_pos: 325,
      isFound: false
    },
    {
      x_pos: 800,
      y_pos: 400,
      isFound: false
    },
    {
      x_pos: 1000,
      y_pos: 320,
      isFound: false
    },
    {
      x_pos: 1350,
      y_pos: 330,
      isFound: false
    },
    {
      x_pos: 1700,
      y_pos: 370,
      isFound: false
    }
  ];
  collectables_length = collectables.length;

  // Initialise game score
  game_score = 0;

  // Initialise flag pole
  postoffice = {
    x_pos: 2000,
    isReached: false
  };

  return false;
}

function draw() {
  noStroke();
  // background(100, 155, 255); // draw sky

  push();
  translate(scrollPos * 0.05, 0);
  image(skyBg, 0, 0);
  pop();

  // Draw mountains
  push();

  for (let i = mountains.length - 1; i >= 0; i--) {
    fill(mountains[i].fill);

    translate(scrollPos * 0.07, 0); // create a parallax scrolling effect
    beginShape();
    for (let j = 0; j < mountains[i].location.length; j++) {
      vertex(mountains[i].location[j][0], mountains[i].location[j][1]);
    }
    endShape(CLOSE);
  }

  pop();

  fill(0, 155, 0);
  rect(0, floorPos_y - 30, width, (height * 3) / 4); // draw some green ground
  fill(56, 35, 30);
  rect(0, floorPos_y + 25, width, 90); // draw brick background

  push(); // scrolling effect start
  translate(scrollPos, 0); // scrolling effect

  // draw bricks
  fill(96, 58, 49);
  for (let i = 0; i < ground.length; i++) {
    rect(ground[i].x, ground[i].y, ground[i].width, ground[i].height, 5);
  }

  // Draw trees.
  push();
  translate(0, floorPos_y);
  drawTrees();
  pop();

  // Draw manholes
  for (let i = 0; i < manholes.length; i++) {
    drawManhole(manholes[i]);
    checkManhole(manholes[i]);
  }

  // Draw and check collectable items
  for (let i = 0; i < collectables_length; i++) {
    drawCollectable(collectables[i], collectables[i].isFound);
    if (!collectables[i].isFound) checkCollectable(collectables[i]);
  }

  pop(); // scrolling effect end

  // Draw game character.
  drawGameChar();

  push(); // drawing postoffice after character so it will give an illusion of entering when reached. Also adding scroll effect
  translate(scrollPos, 0);

  // Draw postoffice
  drawPostoffice();

  pop();

  // Check postoffice
  if (!postoffice.isReached) checkPostoffice();

  // Draw score
  drawScore(game_score);

  // Draw lives
  drawLives(lives);

  // Check if character dies
  checkPlayerDie();

  // Check if level complete
  if (postoffice.isReached || lives < 1) {
    let winTextPosX = width / 2 - 400,
      winTextPosY = height / 2 - 50;

    let displayText;

    if (postoffice.isReached) {
      displayText = 'You win!! Press any key to play again.';

      if (!gameWinSound.isPlaying() && !gameOver) {
        // Making sure gameWinSound is only played once
        gameOver = true;
        gameBgSound.stop();
        gameWinSound.play();
      }
    } else if (lives < 1) {
      displayText = 'Game over. Press any key to play again.';

      if (!gameOverSound.isPlaying() && !gameOver) {
        // Making sure gameOverSound is only played once
        gameOver = true;
        gameOverSound.play();
      }
    }

    stroke('rgba(255,255,255, 0.5)');
    strokeWeight(1);
    fill('rgba(0, 0, 0, 0.5)');
    rect(winTextPosX, winTextPosY, 800, 100);

    fill(255);
    textSize(40);

    text(displayText, winTextPosX + 30, winTextPosY + 70);

    return;
  }

  if (lives < 1) {
    let winTextPosX = width / 2 - 400,
      winTextPosY = height / 2 - 50;

    stroke('rgba(255,255,255, 0.5)');
    strokeWeight(1);
    fill('rgba(0, 0, 0, 0.5)');
    rect(winTextPosX, winTextPosY, 800, 100);

    fill(255);
    textSize(40);
    text(
      'Level complete. Press space to continue.',
      winTextPosX + 30,
      winTextPosY + 70
    );

    return;
  }

  //
  //// Start game Logic
  //

  // Logic to make the game character move or the background scroll.
  if (isLeft) {
    if (gameChar_x > width * 0.2) {
      gameChar_x -= 4;
    } else if (gameChar_world_x > 0) {
      scrollPos += 4;
    }
  }

  if (isRight) {
    if (gameChar_x < width * 0.8) {
      gameChar_x += 4;
    } else {
      scrollPos -= 4; // negative for moving against the background
    }
  }

  // Logic to make the game character rise and fall.
  if (gameChar_y < floorPos_y) {
    gameChar_y *= 1.01;
    isFalling = true;
  } else {
    isFalling = false;
  }

  //detect if plummeting
  if (isPlummeting) {
    isRight = false;
    isLeft = false;
    gameChar_y *= 1.01;
  }

  // Update real position of gameChar for collision detection.
  gameChar_world_x = gameChar_x - scrollPos;

  // Draw start screen
  if (firstLoad) startScreen();
}

// ---------------------
// Key control functions
// ---------------------

function keyPressed() {
  if (firstLoad) {
    // Play background audio first time game is started
    // This is to insure sound playes in Chrome
    gameBgSound.play();
    firstLoad = false;
  }

  if (gameOver) {
    lives = 3;
    startGame();
  }

  if ((keyCode == 37 && !isPlummeting) || (keyCode == 65 && !isPlummeting)) {
    isLeft = true;
  } else if (
    (keyCode == 39 && !isPlummeting) ||
    (keyCode == 68 && !isPlummeting)
  ) {
    isRight = true;
  }

  if (
    (keyCode == 32 && gameChar_y >= floorPos_y && !isPlummeting) ||
    (keyCode == 38 && gameChar_y >= floorPos_y && !isPlummeting)
  ) {
    while (gameChar_y > 325) {
      gameChar_y *= 0.9;
    }
  }
}

function keyReleased() {
  if (keyCode == 37 || keyCode == 65) {
    isLeft = false;
  } else if (keyCode == 39 || keyCode == 68) {
    isRight = false;
  }

  if ((keyCode == 32 && !isPlummeting) || (keyCode == 38 && !isPlummeting)) {
    jumpSound.play();
  }
}

// Function to draw start screen
function startScreen() {
  push();

  fill('rgba(0, 0, 0, 0.5)');
  rect(0, 0, width, height);

  stroke('rgba(255,255,255, 0.5)');
  strokeWeight(1);
  fill('rgba(0, 0, 0, 0.7)');
  rect((width * 1) / 8, (height * 1) / 8, (width * 3) / 4, (height * 3) / 4);

  rotate(-10);

  textAlign(CENTER);
  textStyle(BOLDITALIC);
  textSize(93);
  fill(219, 172, 43);
  text('POSTMAN', width / 2 - 60, height / 2 + 10);

  textSize(90);
  fill(0, 191, 250);
  text('POSTMAN', width / 2 - 60, height / 2 + 10);

  rotate(10);

  fill(240);
  textSize(20);
  text(
    'Collect all mails and deliver them to the postoffice.',
    width / 2 - 20,
    height / 2 + 10
  );
  text('Avoid manholes.', width / 2 - 20, height / 2 + 40);

  fill(219, 172, 43);
  textSize(17);
  textStyle(NORMAL);
  text('Space / Up Arrow to jump', width / 2 - 20, height / 2 + 90);
  text('A / Left Arrow to go to left', width / 2 - 20, height / 2 + 110);
  text('D / Right Arrow to go to right', width / 2 - 20, height / 2 + 130);

  fill(200);
  textSize(20);
  text('Press any key to start', width / 2 - 20, height / 2 + 180);

  pop();

  return false;
}

// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar() {
  push();
  // draw game character

  if ((isLeft && isFalling) || (isRight && isFalling)) {
    //
    // Jumping right / left
    //
    //Legs
    fill(0, 121, 194);
    stroke(0, 121, 194);
    strokeWeight(8);
    if (isRight) {
      line(gameChar_x, gameChar_y - 35, gameChar_x - 10, gameChar_y - 5); //left leg
      line(gameChar_x, gameChar_y - 60, gameChar_x - 26, gameChar_y - 75); //left arm
    } else {
      line(gameChar_x, gameChar_y - 35, gameChar_x + 10, gameChar_y - 5); //right leg
      line(gameChar_x, gameChar_y - 60, gameChar_x + 26, gameChar_y - 75); //right arm
    }

    stroke(51, 51, 51);
    strokeWeight(1);
    //Torso
    if (isRight) {
      rect(gameChar_x - 8, gameChar_y - 70, 16, 40, 4, 10, 4, 4); //suit
    } else {
      rect(gameChar_x - 8, gameChar_y - 70, 16, 40, 10, 4, 4, 4); //suit
    }
    stroke(0, 121, 194);
    strokeWeight(8);
    if (isRight) {
      line(gameChar_x, gameChar_y - 60, gameChar_x + 26, gameChar_y - 75); //right arm
      line(gameChar_x, gameChar_y - 35, gameChar_x + 20, gameChar_y - 45); //right leg top
      line(gameChar_x + 20, gameChar_y - 45, gameChar_x + 20, gameChar_y - 25); //right leg bottom
    } else {
      line(gameChar_x, gameChar_y - 60, gameChar_x - 26, gameChar_y - 75); //left arm
      line(gameChar_x, gameChar_y - 35, gameChar_x - 20, gameChar_y - 45); //left leg top
      line(gameChar_x - 20, gameChar_y - 45, gameChar_x - 20, gameChar_y - 25); //left leg bottom
    }

    strokeWeight(1);
    noStroke();
    //Shoes
    fill(51, 51, 51);
    if (isRight) {
      arc(gameChar_x - 10, gameChar_y + 5, 12, 15, 180, 360); //left shoe
      arc(gameChar_x + 25, gameChar_y - 20, 12, 15, 180, 360); //right shoe
    } else {
      arc(gameChar_x + 5, gameChar_y + 5, 12, 15, 180, 360); //right shoe
      arc(gameChar_x - 25, gameChar_y - 20, 12, 15, 180, 360); //left shoe
    }

    //Face and Neck
    fill(236, 156, 111);
    rect(gameChar_x - 5, gameChar_y - 80, 10, 10); //neck
    ellipse(gameChar_x, gameChar_y - 85, 25); //face
    noFill();
    stroke(51, 51, 51);
    arc(gameChar_x + 5, gameChar_y - 80, 6, 6, 45, 155); //mouth
    //Hat
    noStroke();
    fill(0, 121, 194);
    ellipse(gameChar_x, gameChar_y - 105, 30, 20); //hat-top
    fill(51, 51, 51);
    if (isRight) {
      ellipse(gameChar_x + 5, gameChar_y - 95, 30, 8); //hat-bottom
    } else {
      ellipse(gameChar_x - 5, gameChar_y - 95, 30, 8); //hat-bottom
    }
  } else if (isRight || isLeft) {
    // using frameCount to visualize illusion of walking
    stepCounter = sin(frameCount * 6);
    //
    // Walking right / left
    //
    //Legs
    fill(0, 121, 194);
    stroke(0, 121, 194);
    strokeWeight(8);
    line(
      gameChar_x,
      gameChar_y - 35,
      gameChar_x - 20 * stepCounter,
      gameChar_y
    ); //left leg
    line(
      gameChar_x,
      gameChar_y - 35,
      gameChar_x + 20 * stepCounter,
      gameChar_y
    ); //right leg
    line(
      gameChar_x,
      gameChar_y - 70,
      gameChar_x + 20 * stepCounter,
      gameChar_y - 35
    ); //left arm
    stroke(51, 51, 51);
    strokeWeight(1);
    //Torso
    if (isRight) {
      rect(gameChar_x - 8, gameChar_y - 70, 16, 40, 4, 10, 4, 4); //suit
    } else {
      rect(gameChar_x - 8, gameChar_y - 70, 16, 40, 10, 4, 4, 4); //suit
    }
    stroke(0, 121, 194);
    strokeWeight(8);
    line(
      gameChar_x,
      gameChar_y - 70,
      gameChar_x - 20 * stepCounter,
      gameChar_y - 35
    ); //right arm
    strokeWeight(1);
    noStroke();
    //Shoes
    fill(51, 51, 51);
    arc(gameChar_x - 20 * stepCounter, gameChar_y + 5, 12, 15, 180, 360); //left shoe
    arc(gameChar_x + 20 * stepCounter, gameChar_y + 5, 12, 15, 180, 360); //right shoe
    //Face and Neck
    fill(236, 156, 111);
    rect(gameChar_x - 5, gameChar_y - 80, 10, 10); //neck
    ellipse(gameChar_x, gameChar_y - 85, 25); //face
    noFill();
    stroke(51, 51, 51);
    if (isRight) {
      arc(gameChar_x + 5, gameChar_y - 80, 6, 6, 45, 155); //mouth
    } else {
      arc(gameChar_x - 5, gameChar_y - 80, 6, 6, 45, 155); //mouth
    }
    //Hat
    noStroke();
    fill(0, 121, 194);
    ellipse(gameChar_x, gameChar_y - 105, 30, 20); //hat-top
    fill(51, 51, 51);
    if (isRight) {
      ellipse(gameChar_x + 5, gameChar_y - 95, 30, 8); //hat-bottom
    } else {
      ellipse(gameChar_x - 5, gameChar_y - 95, 30, 8); //hat-bottom
    }
  } else if (isFalling || isPlummeting) {
    //
    // Falling
    //
    //Legs
    fill(0, 121, 194);
    stroke(0, 121, 194);
    strokeWeight(8);
    line(gameChar_x - 12, gameChar_y - 30, gameChar_x - 20, gameChar_y - 10); //left leg
    line(gameChar_x + 12, gameChar_y - 30, gameChar_x + 20, gameChar_y - 10); //right leg
    line(gameChar_x - 16, gameChar_y - 60, gameChar_x - 26, gameChar_y - 90); //left arm
    line(gameChar_x + 16, gameChar_y - 60, gameChar_x + 26, gameChar_y - 90); //right arm
    stroke(51, 51, 51);
    strokeWeight(1);
    //Torso
    rect(gameChar_x - 16, gameChar_y - 70, 32, 40, 10, 10, 4, 4); //suit
    noStroke();
    fill(200, 200, 200);
    triangle(
      gameChar_x - 8,
      gameChar_y - 70,
      gameChar_x,
      gameChar_y - 55,
      gameChar_x + 8,
      gameChar_y - 70
    ); // shirt
    //Shoes
    fill(51, 51, 51);
    arc(gameChar_x - 22, gameChar_y - 5, 10, 15, 180, 360); //left shoe
    arc(gameChar_x + 22, gameChar_y - 5, 10, 15, 180, 360); //left shoe
    //Face and Neck
    fill(236, 156, 111);
    rect(gameChar_x - 5, gameChar_y - 80, 10, 10); //neck
    ellipse(gameChar_x, gameChar_y - 85, 25); //face
    noFill();
    stroke(51, 51, 51);
    arc(gameChar_x, gameChar_y - 80, 6, 6, 45, 44); //mouth
    //Hat
    noStroke();
    fill(0, 121, 194);
    ellipse(gameChar_x, gameChar_y - 105, 30, 20); //hat-top
    fill(51, 51, 51);
    ellipse(gameChar_x, gameChar_y - 95, 25, 8); //hat-bottom
  } else {
    //
    // Front facing
    //
    //Legs
    fill(0, 121, 194);
    rect(gameChar_x - 12, gameChar_y - 30, 8, 30); //left leg
    rect(gameChar_x + 4, gameChar_y - 30, 8, 30); //right leg
    stroke(0, 121, 194);
    strokeWeight(8);
    line(gameChar_x - 16, gameChar_y - 60, gameChar_x - 26, gameChar_y - 50); //left arm
    line(gameChar_x - 26, gameChar_y - 50, gameChar_x - 16, gameChar_y - 35); // left arm
    line(gameChar_x + 16, gameChar_y - 60, gameChar_x + 26, gameChar_y - 50); //right arm
    line(gameChar_x + 26, gameChar_y - 50, gameChar_x + 16, gameChar_y - 35); // right arm
    stroke(51, 51, 51);
    strokeWeight(1);
    //Torso
    rect(gameChar_x - 16, gameChar_y - 70, 32, 40, 10, 10, 4, 4); //suit
    noStroke();
    fill(200, 200, 200);
    triangle(
      gameChar_x - 8,
      gameChar_y - 70,
      gameChar_x,
      gameChar_y - 55,
      gameChar_x + 8,
      gameChar_y - 70
    ); // shirt
    //Shoes
    fill(51, 51, 51);
    arc(gameChar_x - 10, gameChar_y, 10, 15, 180, 360); //left shoe
    arc(gameChar_x + 10, gameChar_y, 10, 15, 180, 360); //left shoe
    //Face and Neck
    fill(236, 156, 111);
    rect(gameChar_x - 5, gameChar_y - 80, 10, 10); //neck
    ellipse(gameChar_x, gameChar_y - 85, 25); //face
    noFill();
    stroke(51, 51, 51);
    arc(gameChar_x, gameChar_y - 85, 10, 10, 45, 135); //mouse
    //Hat
    noStroke();
    fill(0, 121, 194);
    ellipse(gameChar_x, gameChar_y - 100, 30, 20); //hat-top
    fill(51, 51, 51);
    ellipse(gameChar_x, gameChar_y - 90, 25, 8); //hat-bottom
  }
  pop();

  return false;
}

// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawManhole(xPos) {
  stroke(51);
  strokeWeight(2);
  fill(96, 58, 49);
  ellipse(xPos, floorPos_y, 90, 35);
  noStroke();
  fill(56, 35, 30);
  arc(xPos, floorPos_y, 90, 35, 80, 260);

  return false;
}

// Function to check character is over a canyon.

function checkManhole(xPos) {
  if (
    dist(gameChar_world_x, floorPos_y, xPos, floorPos_y) < 45 &&
    gameChar_y >= floorPos_y
  ) {
    isPlummeting = true;
  }
  
  return false;
}

// ----------------------------------
// Collectable items render and check functions start
// ----------------------------------

// Function to draw collectable objects.

function drawCollectable(t_collectable, isFound) {
  push();
  // Draw postbox
  fill(95, 53, 0);
  rect(
    t_collectable.x_pos + 40,
    t_collectable.y_pos + 30,
    5,
    425 - t_collectable.y_pos
  );
  fill(130, 0, 0);
  ellipse(t_collectable.x_pos + 50, t_collectable.y_pos + 25, 20);
  beginShape();
  vertex(t_collectable.x_pos + 50, t_collectable.y_pos + 15);
  vertex(t_collectable.x_pos + 60, t_collectable.y_pos + 25);
  vertex(t_collectable.x_pos + 60, t_collectable.y_pos + 35);
  vertex(t_collectable.x_pos + 29, t_collectable.y_pos + 45);
  vertex(t_collectable.x_pos + 17, t_collectable.y_pos + 19);
  endShape(CLOSE);
  fill(90, 0, 0);
  ellipse(t_collectable.x_pos + 17, t_collectable.y_pos + 30, 22);
  rect(t_collectable.x_pos + 6, t_collectable.y_pos + 30, 22, 15);

  if (!isFound) {
    // Draw Mail
    noStroke();
    fill(219, 172, 43);
    rect(t_collectable.x_pos, t_collectable.y_pos, 25 * 1.4, 25);
    fill(185, 130, 5);
    triangle(
      t_collectable.x_pos,
      t_collectable.y_pos,
      t_collectable.x_pos + 25 * 1.4,
      t_collectable.y_pos,
      t_collectable.x_pos + 25 * 0.7,
      t_collectable.y_pos + 25 * 0.8
    );
    stroke(130, 0, 0);
    strokeWeight(25 * 0.3);
    point(t_collectable.x_pos + 25 * 0.7, t_collectable.y_pos + 25 * 0.7);
  }

  pop();

  return false;
}

// Function to check character has collected an item.

function checkCollectable(t_collectable) {
  if (
    dist(
      gameChar_world_x,
      gameChar_y,
      t_collectable.x_pos,
      t_collectable.y_pos + 20
    ) < 50
  ) {
    t_collectable.isFound = true;
    game_score++;
    collectSound.play();
  }

  return false;
}

// ---------------------------
// Score, life and game status functions
// ---------------------------

// Function to draw game Score

function drawScore(currentScore) {
  push();

  let scoreText = 'Score: ' + currentScore;

  stroke('rgba(255,255,255, 0.5)');
  strokeWeight(1);
  fill('rgba(0, 0, 0, 0.5)');
  rect(20, 20, 120, 50);

  fill(255);
  textSize(20);
  text(scoreText, 30, 52.5);

  pop();

  return false;
}

// Function to draw lives

function drawLives(live) {
  push();

  let livesText = 'Lives: ' + live;

  stroke('rgba(255,255,255, 0.5)');
  strokeWeight(1);
  fill('rgba(0, 0, 0, 0.5)');
  rect(160, 20, 90, 50);

  fill(255);
  textSize(20);
  text(livesText, 170, 52.5);

  pop();

  return false;
}

// Function to draw postoffice and check postoffice

function drawPostoffice() {
  push();

  stroke(51);
  strokeWeight(1);
  fill(182, 185, 210);
  rect(postoffice.x_pos - 100, floorPos_y - 125, 200, 130);
  fill(56, 35, 30);
  rect(postoffice.x_pos - 70, floorPos_y - 88, 50, 90);
  fill(165, 160, 30);
  ellipse(postoffice.x_pos - 60, floorPos_y - 40, 7);

  if (!postoffice.isReached) {
    // lights on when postman is in the office
    fill(107, 225, 239);
  } else {
    fill(219, 172, 43);
  }

  rect(postoffice.x_pos + 15, floorPos_y - 93, 45, 50);
  fill(56, 35, 30);
  rect(postoffice.x_pos - 125, floorPos_y - 155, 250, 35, 5);
  fill(219, 172, 43);
  textSize(24);
  text('POST OFFICE', postoffice.x_pos - 80, floorPos_y - 130);

  pop();

  return false;
}

function checkPostoffice() {
  if (dist(gameChar_world_x, floorPos_y, postoffice.x_pos, floorPos_y) < 50) {
    postoffice.isReached = true;
  }

  return false;
}

// Check if character dies

function checkPlayerDie() {
  if (gameChar_y > (height * 4) / 5 + 20) {
    gameBgSound.stop(); // Stop audio when character dies
    if (!fallSound.isPlaying() && !gameOver) fallSound.play();
  }

  if (gameChar_y > height + 200 && lives > 0) {
    lives--;

    if (lives > 0) {
      startGame();
    }
  }

  return false;
}
