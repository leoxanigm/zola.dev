/*
This file contains all scenery information that the character does not interact with. This is done to decrease the length of code in the main scetch.js file for legibility
*/

new p5();

// Function to draw ground
function drawGround(yPos) {
  let currentWidth = -500; // current brick width
  let rectWidth = random(30, 80); // random brick width
  let groundArr = []; // array to contain all bricks that form the ground

  while (currentWidth < 2200) {
    // 2000 is the width of the whole game
    groundArr.push({
      x: currentWidth,
      y: yPos,
      width: rectWidth,
      height: 30
    });
    currentWidth = currentWidth + rectWidth + random(5, 10);
    rectWidth = random(50, 70);
  }

  return groundArr;
}

// Function to draw mountains
function drawMountains(yPos, gameWidth) {
  // Draws three layers of mountains with increasing height
  // Accepts two parameters: yPos - base floor position and
  // gameWidth - overall horizontal scenery width
  // Outputs an array containing randomized fill, vertex coordinates and
  // depth (zIndex).

  let vertexArr = [];

  let startX, // horizontal starting point for each mountain
    addX, // horizontal distance between mountains
    y, // vertical increment
    direction = 'up', // control which way vertices go
    maxHeight, // maximum mountain height
    maxWidth, // maximum mountain width
    sceneWidth = gameWidth,
    zIndex, // depth of mountains
    mountainArr = []; // array to hold coordinates for each mountain

  for (let i = 0; i < 3; i++) {
    zIndex = i;
    startX = -100; // starting position for each mountain

    if (i === 0) {
      maxHeight = 300;
      maxWidth = 15;
    } else if (i === 1) {
      maxHeight = 200;
      maxWidth = 12;
    } else if (i === 2) {
      maxHeight = 100;
      maxWidth = 10;
    }

    while (startX < sceneWidth) {
      mountainArr = [];
      y = yPos;
      direction = 'up';
      addX = random(0 - 100 * i, 100 + 100 * i);

      while (y > maxHeight && y <= yPos) {
        startX += random(3, maxWidth);

        if (y < maxHeight + 9 && y > maxHeight) {
          direction = 'down';
        } // if desired maximum mountain height is reached, draw vertices down

        if (direction === 'up') {
          y -= random(2, 9);
        } else if (direction === 'down') {
          y += random(2, 9);
        }

        mountainArr.push([startX, y]);
      }

      vertexArr.push({
        fill: color(
          random(48, 55) + 20 * i,
          random(90, 100) + 20 * i,
          random(75, 85) + 20 * i
        ),
        location: mountainArr,
        zIndex: zIndex
      });

      startX += addX;
    }
  }

  return vertexArr;
}

// Function to draw trees
function setTreeLocations() {
  // Populate tree locations
  let workingArr = [];

  for (let i = 0; i < 30; i++) {
    let test = [-0.9, -1, -1.5, 0.9, 1, 1.5];
    workingArr.push({
      ranScale: random(test), // random values to scale trees
      xPos: 50 + i * random(170, 250),
      yPos: random(-30, -50)
    });
  }

  return workingArr;
}

let treeArr = setTreeLocations();

function drawTrees() {
  // Draw trees
  push();
  for (let i = 0; i < treeArr.length; i++) {
    push();
    translate(treeArr[i].xPos, treeArr[i].yPos);
    scale(treeArr[i].ranScale, abs(treeArr[i].ranScale)); // negative on x value to flip trees randomly

    fill(95, 53, 0);
    rect(0, -60, 20, 80);
    stroke(95, 53, 0);
    strokeWeight(10);
    line(10, -30, -20, -60);
    line(10, -10, 40, -60);

    noStroke();
    fill(3, 130, 2);
    rect(-40, -115, 100, 60, 10);
    fill(3, 100, 2);
    rect(10, -100, 40, 40, 10);

    pop();
  }
  pop();

  return false;
}
