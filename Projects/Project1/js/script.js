"use strict";

/*****************

Rear Window
Chip Limeburner

Description

******************/


//varible for incoming serial port
let serial;

//variable for incoming serial data
let data = 0;

//arrays to store translated data from the serial input
let upButton = 0;
let downButton = 0;
let leftButton = 0;
let rightButton = 0;
let lightSensor = 0;
let snapButton = 0;

//arrays to store previous value for translated data from the serial input
let prevUpButton = 0;
let prevDownButton = 0;
let prevLeftButton = 0;
let prevRightButton = 0;
let prevLightSensor = 0;
let prevSnapButton = 0;

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

//variable to provide the strength of glare when a photo is taken
let glare = 0;

//an array to hold the photos taken
let photo = [];

//a variable to track remaining film
let filmRemaining = 24;


// preload()
// Description of preload
function preload() {

}


// setup()
// Description of setup
function setup() {
  serial = new p5.SerialPort(); //create serial port object

  serial.open("/dev/tty.usbserial-DA00WTHG"); //open the appropriate serial port

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
    [0, 0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0, 0],
    [0, 0, 1, 0, 1, 1],
    [1, 1, 1, 1, 1, 1]
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
  //pull the serial comms data
  if (serial.available() > 0) {
    data = serial.last();
  }

  storePreviousData(); //store last serial data states for signal edge detection

  parseData(); //breakdown serial data into usable variables

  peripheralKeyPressed(); //acts like keyPressed() but checks the formatted data from the serial input

  viewScale = 1; //default graphics to zoomed out view

  //zoom in when the SHIFT key is pressed
  if (keyIsDown(SHIFT) /*|| !lightSensor*/) {
    zoomIn();
  }

  //update "origin" used for focus and zooming in
  originX = width*0.2 + windowPositions[focusY][focusX][0];
  originY = height*0.25 + windowPositions[focusY][focusX][1];

  noStroke(); //set shapes to not have an outline by default

  //draw the background
  displayBackground();

  //draw the building
  displayHouse();

  //show which window the camera is focused on
  displayFocus();

  //when zoomed in, use a "barrel" effect to restrict peripheral vision
  if (keyIsDown(SHIFT) /*|| !lightSensor*/) {
    displayCameraBarrel();
  }

  push();
  textSize(100);
  fill(255);
  text(filmRemaining, 50, 100);
  pop();

  //fade the flash from taking a photo
  if (glare > 0) {
    glare--;
    push();
    fill(`rgba(255,255,255,${glare/50})`);
    rect(width/2,height/2,width,height);
    pop();
  }
}


// keyPressed()
// a function that listens for key presses and responds accordingly
function keyPressed() {
  if (keyCode === 65 && focusX > 0) {
    focusX--;
  } else if (keyCode === 68 && focusX < 5) {
    focusX++;
  } else if (keyCode === 87 && focusY > 0) {
    focusY--;
  } else if (keyCode === 83 && focusY < 3) {
    focusY++;
  } else if (keyCode === 32 && filmRemaining > 0) {
    filmRemaining--; //reduce film left
    photo.push(get(0, 0, width, height)); //save the snapshot to the photo array
    glare = 50; //create the flashbulb effect
  }
}


// peripheralKeyPressed()
// a function that basically does the same as keyPressed but with the input from serial data
function peripheralKeyPressed() {
  if (upButton > prevUpButton && focusY > 0) {
    focusY--;
  } else if (rightButton > prevRightButton && focusX < 5) {
    focusX++;
  } else if (leftButton > prevLeftButton && focusX > 0) {
    focusX--;
  } else if (downButton > prevDownButton && focusY < 3) {
    focusY++;
  } else if (snapButton > prevSnapButton && filmRemaining > 0) {
    filmRemaining--; //reduce film left
    photo.push(get(0, 0, width, height)); //save the snapshot to the photo array
    glare = 50; //create the flashbulb effect
  }
}

// storePreviousData
// a function to store last states for signal edge detection
function storePreviousData() {
  prevUpButton = upButton;
  prevDownButton = downButton;
  prevLeftButton = leftButton;
  prevRightButton = rightButton;
  prevLightSensor = lightSensor;
  prevSnapButton = snapButton;
}


// parseData()
// a function that translates incoming serial data to a format we need it in
function parseData() {
  snapButton = Math.floor(data/32);
  lightSensor = Math.floor((data % 32)/16);
  downButton = Math.floor((data % 16)/8);
  leftButton = Math.floor((data % 8)/4);
  rightButton = Math.floor((data % 4)/2);
  upButton = Math.floor((data % 2));
}


// zoomIn()
// a function that "zooms in", scaling graphics accordingly and centering them on screen based on your "focus"
function zoomIn() {
  viewScale = 6;
  scale(viewScale);
  translate(-originX + width/(2*viewScale), -originY + height/(2*viewScale));
}


// displayBackground()
// a function that draws the background and trees
function displayBackground() {
  background(0,20,60);

  //moon
  fill(250, 250, 200);
  circle(6*width/7, height/7, width/16);

  //back row
  fill(0, 10, 0);
  triangle (width/20 - width/40, width/12, width/10 - width/40, height, 0 - width/40, height);
  triangle (width/20 + width/24, width/12, width/10 + width/24, height, 0 + width/24, height);
  triangle (width/20 + width/14, width/12, width/10 + width/14, height, 0 + width/14, height);
  triangle (width/20 + width/7, width/12, width/10 + width/7, height, 0 + width/7, height);
  triangle (width/20 + width/3, width/12, width/10 + width/3, height, 0 + width/3, height);
  triangle (width/20 + width/2, width/12, width/10 + width/2, height, 0 + width/2, height);
  triangle (width/20 + width/1.65, width/12, width/10 + width/1.65, height, 0 + width/1.65, height);
  triangle (width/20 + width/1.55, width/12, width/10 + width/1.55, height, 0 + width/1.55, height);
  triangle (width/20 + width/1.5, width/12, width/10 + width/1.5, height, 0 + width/1.5, height);
  triangle (width/20 + width/1.25, width/12, width/10 + width/1.25, height, 0 + width/1.25, height);
  triangle (width/20 + width/1.2, width/12, width/10 + width/1.2, height, 0 + width/1.2, height);
  triangle (width/20 + width/1.1, width/12, width/10 + width/1.1, height, 0 + width/1.1, height);
  triangle (width/20 + width/1.075, width/12, width/10 + width/1.075, height, 0 + width/1.075, height);

  //middle row
  fill(0, 20, 0);
  triangle (width/14, width/8, width/7, height, 0, height);
  triangle (width/14 + width/1.15, width/8, width/7 + width/1.15, height, 0 + width/1.15, height);
  triangle (width/14 + width/1.35, width/8, width/7 + width/1.35, height, 0 + width/1.35, height);

  //front row
  fill(0, 30, 0);
  triangle (width/14 - width/15, width/7, width/7 - width/15, height, 0 - width/15, height);
  triangle (width/14 - width/35, width/7, width/7 - width/35, height, 0 - width/35, height);
  triangle (width/14 + width/35, width/7, width/7 + width/35, height, 0 + width/35, height);
  triangle (width/14 + width/12, width/7, width/7 + width/12, height, 0 + width/12, height);
  triangle (width/14 + width/10, width/7, width/7 + width/10, height, 0 + width/10, height);
  triangle (width/14 + width/1.45, width/7, width/7 + width/1.45, height, 0 + width/1.45, height);
  triangle (width/14 + width/1.32, width/7, width/7 + width/1.32, height, 0 + width/1.32, height);
  triangle (width/14 + width/1.28, width/7, width/7 + width/1.28, height, 0 + width/1.28, height);
  triangle (width/14 + width/1.18, width/7, width/7 + width/1.18, height, 0 + width/1.18, height);
  triangle (width/14 + width/1.12, width/7, width/7 + width/1.12, height, 0 + width/1.12, height);
}


// displayHouse()
// a function that draws the house and its details
function displayHouse() {
  //draw the building
  fill(30, 0, 0);
  rectMode(CENTER);
  rect(width/2, height*0.15 + height/2, houseWidth, houseHeight);

  //draw the roof
  fill(60, 80, 60);
  quad(width/2 - houseWidth/2, height/4.5, width/2 + houseWidth/2, height/4.5, width/2 + houseWidth/2 + width/48, height/4.5 + houseHeight/3.5, width/2 - houseWidth/2  - width/48, height/4.5 + houseHeight/3.5);

  //draw the windows
  rectMode(CENTER);
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 6; j++) {
      fill(250, 250, 180);
      rect(width*0.2 + windowPositions[i][j][0], height*0.25 + windowPositions[i][j][1], houseWidth/10, houseHeight/5.25)
      if (windowLights[i][j] == 0) {
        fill(0, 0, 20);
      } else {
        fill(200, 200, 80);
      }
      rect(width*0.2 + windowPositions[i][j][0], height*0.25 + windowPositions[i][j][1], houseWidth/12, houseHeight/6);
      fill(80, 80, 100);
      rect(width*0.2 + windowPositions[i][j][0], height*0.25 + windowPositions[i][j][1] + height*0.06, houseWidth/9, houseHeight/32);
    }
  }
}


// displayFocus
// a function that draws the dashed box to indicate on which window you're "focused"
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


// displayCameraBarrel()
// a function that draws the masking simulating the field of view of a camera barrel
function displayCameraBarrel() {
  push();
  noFill();
  strokeWeight(100);
  stroke(0);
  circle(originX, originY, width*0.2);
  pop();
}
