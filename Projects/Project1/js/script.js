"use strict";

/*****************

Rear Window
Chip Limeburner

Description

******************/

let windowPositions;
let windowLights;

let houseWidth;
let houseHeight;

let focusX;
let focusY;

let originX;
let originY;

let viewScale = 1;

let isZooming = false;


// preload()
// Description of preload
function preload() {

}


// setup()
// Description of setup
function setup() {
  createCanvas(windowWidth, windowHeight); //create the canvas

  houseWidth = width*0.6;
  houseHeight = height*0.7;

  windowPositions = [
    [ [houseWidth*1/12, houseHeight*1/8], [houseWidth*3/12, houseHeight*1/8], [houseWidth*5/12, houseHeight*1/8], [houseWidth*7/12, houseHeight*1/8], [houseWidth*9/12, houseHeight*1/8], [houseWidth*11/12, houseHeight*1/8] ],
    [ [houseWidth*1/12, houseHeight*3/8], [houseWidth*3/12, houseHeight*3/8], [houseWidth*5/12, houseHeight*3/8], [houseWidth*7/12, houseHeight*3/8], [houseWidth*9/12, houseHeight*3/8], [houseWidth*11/12, houseHeight*3/8] ],
    [ [houseWidth*1/12, houseHeight*5/8], [houseWidth*3/12, houseHeight*5/8], [houseWidth*5/12, houseHeight*5/8], [houseWidth*7/12, houseHeight*5/8], [houseWidth*9/12, houseHeight*5/8], [houseWidth*11/12, houseHeight*5/8] ],
    [ [houseWidth*1/12, houseHeight*7/8], [houseWidth*3/12, houseHeight*7/8], [houseWidth*5/12, houseHeight*7/8], [houseWidth*7/12, houseHeight*7/8], [houseWidth*9/12, houseHeight*7/8], [houseWidth*11/12, houseHeight*7/8] ]
  ];

  windowLights = [
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0]
  ];

  focusX = 0;
  focusY = 0;

  originX = width*0.2 + windowPositions[focusY][focusX][0];
  originY = height*0.3 + windowPositions[focusY][focusX][1];
}


// draw()
// Description of draw()
function draw() {
  if (keyIsDown(SHIFT)) {
    scale(6);
    translate(-originX + width/12, -originY + height/12);
  }

  originX = width*0.2 + windowPositions[focusY][focusX][0];
  originY = height*0.3 + windowPositions[focusY][focusX][1];

  background('rgba(0, 150, 200, 1)'); //make the background sky blue

  noStroke();

  //draw the building
  fill(30, 0, 0);
  rectMode(CENTER);
  rect(width/2, height*0.15 + height/2, houseWidth, houseHeight);

  //draw the windows
  rectMode(CENTER);
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 6; j++) {
      if (windowLights[i][j] == 0) {
        fill(0, 0, 20);
      } else {
        fill(200, 200, 0);
      }
      rect(width*0.2 + windowPositions[i][j][0], height*0.3 + windowPositions[i][j][1], houseWidth/12, houseHeight/6);
    }
  }

  fill('rgba(255, 255, 255, 0.1)');
  rect(originX, originY, houseWidth/6, houseHeight/4);

  if (keyIsDown(SHIFT)) {
    noFill();
    strokeWeight(100);
    stroke(0);
    circle(originX, originY, width*0.2);
  }

}

function keyPressed() {
  if (keyCode === LEFT_ARROW && focusX > 0) {
    focusX--;
  } else if (keyCode === RIGHT_ARROW && focusX < 5) {
    focusX++;
  } else if (keyCode === UP_ARROW && focusY > 0) {
    focusY--;
  } else if (keyCode === DOWN_ARROW && focusY < 3) {
    focusY++;
  }
}
