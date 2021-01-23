"use strict";

/*****************

Rear Window
Chip Limeburner

Description

******************/

//arrays to track window information
let windowPositions;
let windowLights;

//size of the building
let houseWidth;
let houseHeight;

//grid coordinateds for the window the players are focused on
let focusX;
let focusY;

//pixel coordinates for the window the players are focused on
let originX;
let originY;

//a variable to store the scale of objects being viewed
let viewScale = 1;


// preload()
// Description of preload
function preload() {

}


// setup()
// Description of setup
function setup() {
  createCanvas(windowWidth, windowHeight); //create the canvas

  //set the size of the building
  houseWidth = width*0.6;
  houseHeight = height*0.7;

  //array to store all the window center points
  windowPositions = [
    [ [houseWidth*1/12, houseHeight*1/8], [houseWidth*3/12, houseHeight*1/8], [houseWidth*5/12, houseHeight*1/8], [houseWidth*7/12, houseHeight*1/8], [houseWidth*9/12, houseHeight*1/8], [houseWidth*11/12, houseHeight*1/8] ],
    [ [houseWidth*1/12, houseHeight*3/8], [houseWidth*3/12, houseHeight*3/8], [houseWidth*5/12, houseHeight*3/8], [houseWidth*7/12, houseHeight*3/8], [houseWidth*9/12, houseHeight*3/8], [houseWidth*11/12, houseHeight*3/8] ],
    [ [houseWidth*1/12, houseHeight*5/8], [houseWidth*3/12, houseHeight*5/8], [houseWidth*5/12, houseHeight*5/8], [houseWidth*7/12, houseHeight*5/8], [houseWidth*9/12, houseHeight*5/8], [houseWidth*11/12, houseHeight*5/8] ],
    [ [houseWidth*1/12, houseHeight*7/8], [houseWidth*3/12, houseHeight*7/8], [houseWidth*5/12, houseHeight*7/8], [houseWidth*7/12, houseHeight*7/8], [houseWidth*9/12, houseHeight*7/8], [houseWidth*11/12, houseHeight*7/8] ]
  ];

  //array to track in which windows the lights are on
  windowLights = [
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0]
  ];

  //grid coordinateds for the window the players are focused on
  focusX = 0;
  focusY = 0;

  //pixel coordinates for the window the players are focused on
  originX = width*0.2 + windowPositions[focusY][focusX][0];
  originY = height*0.3 + windowPositions[focusY][focusX][1];
}


// draw()
// Description of draw()
function draw() {
  viewScale = 1; //default graphics to zoomed out view

  //zoom in when the SHIFT key is pressed
  if (keyIsDown(SHIFT)) {
    zoomIn();
  }

  //update "origin" used for focus and zooming in
  originX = width*0.2 + windowPositions[focusY][focusX][0];
  originY = height*0.3 + windowPositions[focusY][focusX][1];

  background('rgba(0, 150, 200, 1)'); //make the background sky blue
  noStroke(); //set shapes to not have an outline by default

  //draw the building
  displayHouse();

  //show which window the camera is focused on
  displayFocus();

  //when zoomed in, use a "barrel" effect to restrict peripheral vision
  if (keyIsDown(SHIFT)) {
    displayCameraBarrel();
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


function zoomIn() {
  viewScale = 6;
  scale(viewScale);
  translate(-originX + width/(2*viewScale), -originY + height/(2*viewScale));
}


function displayHouse() {
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
}


function displayFocus() {
  //draw a dashed outline
  push();
  stroke(200);
  //top
  for (let i = 0; i < 20; i = i + 2) {
    line(originX - houseWidth/12 + houseWidth*(i)/114, originY - houseHeight/8, originX - houseWidth/12 + houseWidth*(i+1)/114, originY - houseHeight/8);
  }
  //left
  for (let i = 0; i < 20; i = i + 2) {
    line(originX - houseWidth/12, originY - houseHeight/8 + houseHeight*(i)/76, originX - houseWidth/12, originY - houseHeight/8 + houseHeight*(i+1)/76);
  }
  for (let i = 0; i < 20; i = i + 2) {
    line(originX + houseWidth/12, originY - houseHeight/8 + houseHeight*(i)/76, originX + houseWidth/12, originY - houseHeight/8 + houseHeight*(i+1)/76);
  }
  //bottom
  for (let i = 0; i < 20; i = i + 2) {
    line(originX - houseWidth/12 + houseWidth*(i)/114, originY + houseHeight/8, originX - houseWidth/12 + houseWidth*(i+1)/114, originY + houseHeight/8);
  }
  pop();
}


function displayCameraBarrel() {
  push();
  noFill();
  strokeWeight(100);
  stroke(0);
  circle(originX, originY, width*0.2);
  pop();
}
