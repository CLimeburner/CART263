"use strict";

/*****************

Rear Window
Chip Limeburner

Description

******************/


//varible for incoming serial port
let serial;

//variable to track if a peripheral is connected
let peripheralConnected = 0;

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

/* Arrays to track window information
Arrays are fully spelled out but blank, in part to aid initialization, but also
to sketch out their structure and kinds of data they will hold. Each represents
the 6x4 grid of windows as they appear on the house in the game, with
windowPositions holding coordinate pairs for each window. */
let windowPositions = [
  [ [ , ], [ , ], [ , ], [ , ], [ , ], [ , ] ],
  [ [ , ], [ , ], [ , ], [ , ], [ , ], [ , ] ],
  [ [ , ], [ , ], [ , ], [ , ], [ , ], [ , ] ],
  [ [ , ], [ , ], [ , ], [ , ], [ , ], [ , ] ]
];

let windowLights = [
  [ , , , , , ],
  [ , , , , , ],
  [ , , , , , ],
  [ , , , , , ]
];

let windowSprites = [
  [ , , , , , ],
  [ , , , , , ],
  [ , , , , , ],
  [ , , , , , ]
];

//size of the building
let houseWidth;
let houseHeight;

//offset values that create a "new origin" at the upper-left corner of the house.
let houseXOffset;
let houseYOffset;

//variables to size the windows
let archWindowWidth;
let archWindowHeight;

//grid coordinates for the window the players are focused on
let focusX;
let focusY;

//pixel coordinates for the window the players are focused on
let originX;
let originY;

//a variable to store the scale of objects being viewed
let viewScale = 1;

//variable that allows us to listen for "photo taking" whenever but avoid photographing non-digetic graphics
let snapshotBuffer = false;

//variable to provide the strength of glare when a photo is taken
let glare = 0;

//an array to hold the photos taken
let photo = [];

//a variable to track remaining film
let filmRemaining = 24;

//for storing the imported font
let gameFont;

//variable to store our sound effects
let flashbulb;
let gunshot;



////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////

let testSprite;

////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////



// preload()
// Description of preload
function preload() {
  testSprite = loadAnimation(`assets/images/bubbly0001.png`,`assets/images/bubbly0004.png`);

  //load the Mystery Forest font by Xerographer fonts (https://www.1001freefonts.com/mystery-forest.font)
  gameFont = loadFont('assets/fonts/mystery-forest/MysteryForest.ttf');

  //load our sound fx
  soundFormats('mp3');
  gunshot = loadSound('assets/sounds/gunshot.mp3'); //a single shot in the distance. Source: BBC, (raw audio: https://sound-effects.bbcrewind.co.uk/search?q=07010122)
  flashbulb = loadSound('assets/sounds/flashbulb.mp3'); //vintage flashbulb sound. Source: Instant Media Musics (https://www.youtube.com/watch?v=YDdYUN83aYc&ab_channel=InstantMediaMusics)
}


// setup()
// Description of setup
function setup() {
  serial = new p5.SerialPort(); //create serial port object

  serial.open("/dev/tty.usbserial-DA00WTHG"); //open the appropriate serial port

  //check to see if a peripheral "camera" was succesfully opened at the above serial port. If so, mark peripheralConnected as true.
  serial.on('open', function () {
    peripheralConnected = 1;
  });

  createCanvas(windowWidth, windowHeight); //create the canvas

  //set the size of the building
  houseWidth = width*0.6;
  houseHeight = height*0.7;

  //set the house's offset and the operational origin for game mechanics using the front fo the house
  houseXOffset = width*0.2;
  houseYOffset = height*0.25;

  //set the size of the windows
  archWindowWidth = houseWidth/12;
  archWindowHeight = houseHeight/6;

  //array to store all the window center points
  for (let i = 0; i < 4; i++) { //for each row
    for (let j = 0; j < 6; j++) { //for each column
      windowPositions[i][j][0] = houseWidth * ((1+(2*j))/12); //iterate X coordinates as ratio of houseWidth
      windowPositions[i][j][1] = houseHeight * ((1+(2*i))/8); //iterate Y coordinates as ratio of houseHeight
    }
  }

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
  originX = houseXOffset + windowPositions[focusY][focusX][0];
  originY = houseYOffset + windowPositions[focusY][focusX][1];


  //initialize all the window sprites
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 6; j++) {
      windowSprites[i][j] = createSprite(
              houseXOffset + windowPositions[i][j][0],   //X coordinate
              houseYOffset + windowPositions[i][j][1],   //Y coordinate
              archWindowWidth,                           //width
              archWindowHeight);                         //height
      windowSprites[i][j].visible = false;
    }
  }

  windowSprites[0][0].visible = true;
  //iterate over each animation frame and resize correctly
  for (let i = 0; i < testSprite.images.length; i++) {
    testSprite.images[i].resize(archWindowWidth, archWindowHeight); //makes sprites fit in the windows
  }


  ///////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////
  windowSprites[0][0].addAnimation(`bubble`,testSprite);
  windowSprites[0][0].changeAnimation(`bubble`);
  ///////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////


}


// draw()
// Description of draw()
function draw() {

  //pull the serial comms data and parse it appropriately. Send "key" commands if neccesary.
  if (serial.available() > 0) {
    data = serial.last();
  }
  storePreviousData(); //store last serial data states for signal edge detection
  parseData(); //breakdown serial data into usable variables
  peripheralKeyPressed(); //acts like keyPressed() but checks the formatted data from the serial input


  //handling zooming effects and scaling on the back end
  viewScale = 1; //default graphics to zoomed out view
  //zoom in when the SHIFT key is pressed
  if (checkZoom()) {
    zoomIn();
  }
  //update "origin" used for focus and zooming in
  originX = houseXOffset + windowPositions[focusY][focusX][0];
  originY = houseYOffset + windowPositions[focusY][focusX][1];


  //draw the actual graphics
  noStroke(); //set shapes to not have an outline by default
  displayBackground(); //draw the background
  displayHouse(); //draw the building
  displayFocus(); //show which window the camera is focused on
  drawSprites(); //draw sprites for window animations
  if (checkZoom()) {
    displayCameraBarrel(); //when zoomed in, use a "barrel" effect to restrict peripheral vision
  }
  displayGlare(); //checks if snapshotBuffer is true, and if so, creates a bulb flash effect. Also fades the flash effect each frame.
  displayFilmRemaining(); //show the number of photos you have left to take


  //draws photos taken on screen
  /*for (let i = 0; i < photo.length; i++) {
    image(photo[i], 250 + (i * 200), 30, 160, 90);
  }*/
}


// keyPressed()
// a function that listens for key presses and responds accordingly
function keyPressed() {
  if (keyCode === 65 && focusX > 0) { //A to move left
    focusX--;
  } else if (keyCode === 68 && focusX < 5) { //D to move right
    focusX++;
  } else if (keyCode === 87 && focusY > 0) { //W to move up
    focusY--;
  } else if (keyCode === 83 && focusY < 3) { //S to move down
    focusY++;
  } else if (keyCode === 32 && filmRemaining > 0) { //spacebar to take a picture
    snapshotBuffer = true;
  }
}


// peripheralKeyPressed()
// a function that basically does the same as keyPressed but with the input from serial data
function peripheralKeyPressed() {
  if (upButton > prevUpButton && focusY > 0) { //up to move up
    focusY--;
  } else if (rightButton > prevRightButton && focusX < 5) { //right to move right
    focusX++;
  } else if (leftButton > prevLeftButton && focusX > 0) { //left to move left
    focusX--;
  } else if (downButton > prevDownButton && focusY < 3) { //down to move down
    focusY++;
  } else if (snapButton > prevSnapButton && filmRemaining > 0) { //snap to take a picture
    snapshotBuffer = true;
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
// a function that translates incoming serial data to a format we need it in, uses modulo to break up the incoming byte
// Metaphorically speaking, incoming byte (0-0-0-0-0-0-0-0) digits formated as:
// null - null - snapButton - lightButton - downButton - leftButton - rightButton - upButton
// but actual incoming number is a 0-to-255 situation, hence the base 2 division and modulo
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
  translate(
        -originX + width/(2*viewScale),
        -originY + height/(2*viewScale));
}


// displayBackground()
// a function that draws the background and trees
function displayBackground() {
  background(0,20,60); //dark blue sky

  //moon
  for (let i = 0; i < 40; i++) {
    fill(`rgba(250,250,200,${(1-(i/40))/2})`);
    circle( //draw the paraselene
        6*width/7,          //X coordinate
        height/7,           //Y coordinate
        (i/25)*width/16);   //size
  }
  fill(250, 250, 200); //pale yellow moon
  circle(  //draw the moon itself
        6*width/7,          //X coordinate
        height/7,           //Y coordinate
        width/16);          //size

  //////////////////// BEGINNING OF A BUNCH OF ARBIRARILY PLACED TREES ///////////////////////////////////

  //Broadly speaking these trees are drawn in rows from left of screen to right.
  //They were positioned to taste rather than through any pattern.

  //back row of trees
  fill(0, 10, 0); //very dark green
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

  //middle row of trees
  fill(0, 20, 0); //lighter green
  triangle (width/14, width/8, width/7, height, 0, height);
  triangle (width/14 + width/1.15, width/8, width/7 + width/1.15, height, 0 + width/1.15, height);
  triangle (width/14 + width/1.35, width/8, width/7 + width/1.35, height, 0 + width/1.35, height);

  //front row of trees
  fill(0, 30, 0); //lightest green
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

  //////////////////// END OF A BUNCH OF ARBIRARILY PLACED TREES ////////////////////////////////////////

  //gradient from the ground up, just to set some ambience and mood
  for (let i = 0; i < 40; i++) {
    push();
    fill(`rgba(0,0,0,${1-(i/40)})`);
    rectMode(LEFT, TOP);
    rect(0, height - (i * 10), width, 10);
    pop();
  }
}


// displayHouse()
// a function that draws the house and its details
function displayHouse() {
  //draw the building
  fill(30, 0, 0);
  rectMode(CENTER);
  rect(
      width/2,                  //X Coordinate
      height*0.15 + height/2,   //Y Coordinate
      houseWidth,               //width
      houseHeight);             //height

  //draw the roof
  fill(60, 80, 60);
  quad(  //draw the parallelogram that is the roof
      width/2 - houseWidth/2, height/4.5,                                 //upper left corner X and Y coordinates
      width/2 + houseWidth/2, height/4.5,                                 //upper right corner X and Y coordinates
      width/2 + houseWidth/2 + width/48, height/4.5 + houseHeight/3.5,    //lower right corner X and Y coordinates
      width/2 - houseWidth/2  - width/48, height/4.5 + houseHeight/3.5);  //lower left corner X and Y coordinates

  //draw the windows
  rectMode(CENTER);
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 6; j++) {
      //window frame slightly bigger than window opening
      fill(250, 250, 180);
      rect(
          houseXOffset + windowPositions[i][j][0],  //X position
          houseYOffset + windowPositions[i][j][1],  //Y position
          houseWidth/10,                            //width
          houseHeight/5.25);                        //height

      //window openings
      if (windowLights[i][j] == 0) {
        fill(0, 0, 20); //dark
      } else {
        fill(200, 200, 80); //light
      }
      rect(
          houseXOffset + windowPositions[i][j][0],  //X position
          houseYOffset + windowPositions[i][j][1],  //Y position
          archWindowWidth,                          //width
          archWindowHeight);                        //height

      //window sills
      fill(80, 80, 100);
      let windowSillOffset = height*0.0685; //offset to bottom edge of window
      rect(
          houseXOffset + windowPositions[i][j][0],                      //X position
          houseYOffset + windowPositions[i][j][1] + windowSillOffset,   //Y position
          houseWidth/9,                                                 //width
          houseHeight/32);                                              //height
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
    line(
        originX - houseWidth/12 + houseWidth*(i)/114,    //Point A X coordinate
        originY - houseHeight/8,                         //Point A Y coordinate
        originX - houseWidth/12 + houseWidth*(i+1)/114,  //Point B X coordinate
        originY - houseHeight/8);                        //Point B Y coordinate
  }
  //left
  for (let i = 0; i < 20; i = i + 2) {
    line(
        originX - houseWidth/12,                         //Point A X coordinate
        originY - houseHeight/8 + houseHeight*(i)/76,    //Point A Y coordinate
        originX - houseWidth/12,                         //Point B X coordinate
        originY - houseHeight/8 + houseHeight*(i+1)/76); //Point B Y coordinate
  }
  for (let i = 0; i < 20; i = i + 2) {
    line(
        originX + houseWidth/12,                         //Point A X coordinate
        originY - houseHeight/8 + houseHeight*(i)/76,    //Point A Y coordinate
        originX + houseWidth/12,                         //Point B X coordinate
        originY - houseHeight/8 + houseHeight*(i+1)/76); //Point B Y coordinate
  }
  //bottom
  for (let i = 0; i < 20; i = i + 2) {
    line(
        originX - houseWidth/12 + houseWidth*(i)/114,    //Point A X coordinate
        originY + houseHeight/8,                         //Point A Y coordinate
        originX - houseWidth/12 + houseWidth*(i+1)/114,  //Point B X coordinate
        originY + houseHeight/8);                        //Point B Y coordinate
  }
  pop();
}


// displayFilmRemaining()
// a function that draws the number of photos you have left to take
function displayFilmRemaining() {
  push();
  textFont(gameFont);
  textAlign(CENTER);
  textSize(120);
  fill(255);
  text(filmRemaining, 120, 100);
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


// displayGlare()
// a function that draws the glare and fades it when you take a pictues
function displayGlare() {
  //fade the flash from taking a photo
  if (glare > 0) {
    glare--;
    push();
    fill(`rgba(255,255,255,${glare/50})`); //slowly fade the glare with alpha value
    rect(width/2, height/2, width, height); //draw the white glare overlay the size of the screen and centered
    pop();
  }

  //if a photo has been taken, create a new flash effects
  if (snapshotBuffer) {
    snapshotBuffer = false;
    filmRemaining--; //reduce film left
    photo.push(get(0, 0, width, height)); //save the snapshot to the photo array
    glare = 50; //create the flashbulb effect
    flashbulb.play(); //flash sound effect
  }
}


// checkZoom()
// a function that conviently checks for a zoomed state from either the keyboard or the camera controller
function checkZoom() {
  if (keyIsDown(SHIFT)) {
    return true; //if shift is pressed, zoom
  } else if (peripheralConnected && !lightSensor) {
    return true; //if the camera is sending data and the lightsensor is blocked, zoom
  } else {
    return false; //otherwise do nothing
  }
}
