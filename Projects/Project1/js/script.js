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
  originY = height*0.3 + windowPositions[focusY][focusX][1];

  background('rgba(0, 150, 200, 1)'); //make the background sky blue
  noStroke(); //set shapes to not have an outline by default

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


// displayHouse()
// a function that draws the house and its details
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
