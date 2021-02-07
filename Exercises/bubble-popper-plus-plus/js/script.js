"use strict";

/*****************

Bubble Popper++
Tutorial: Pippin Barr
Coded: Chip Limeburner

An exercise extending the bubble popper activity.

******************/


let popFX = undefined; //a variable for our pop sound fx

let scoreFont = undefined; //a variable to store a bubbly font

let video = undefined; //a variable to store the user's webcam

let handpose = undefined; //a vairable to store the hand pose model

let predictions = []; //a variable to store predictions from the hand pose model

//global variables to handle handpose data
let hand;
let index;
let tip;
let base;
let tipX;
let tipY;
let baseX;
let baseY;

let bubble = undefined; //a variable to store our bubble

let score = 0; //a variable tracking how many bubbles we've popped


// preload()
// Preload loads up our sound effect for the bubble
function preload() {
  soundFormats('mp3', 'ogg'); //set file formats for audio
  popFX = loadSound('assets/sounds/pop.mp3'); //popping sound, taken from the BBC: https://sound-effects.bbcrewind.co.uk/search?q=07042178

  scoreFont = loadFont('assets/fonts/bubble.ttf');//bubble font, downloaded from: https://www.1001freefonts.com/bubble---soap.font
}


// setup()
// Setup loads our machine learning hand model for use in the draw loop
function setup() {
  createCanvas(640, 480); //create the canvas

  //access the user's webcam and hide it
  video = createCapture(VIDEO);
  video.hide();

  //load the handpose model
  handpose = ml5.handpose(video, {
    flipHorizontal: true //flipping input so it's more intuitive
  }, function() {
    console.log(`Model loaded.`);
  });

  //listen for predictions
  handpose.on(`predict`, function(results) {
    predictions = results;
  });

  //defining Bubble
  bubble = {
    x: random(width),
    y: height,
    size: 100,
    vx: 0,
    vy: -2
  };
}


// draw()
// Updates our game every frame
function draw() {
  background(120, 180, 255); //make the background light blue

  drawScore(); //update the score on screen

  if (predictions.length > 0) {
    parseData(); //divide up incoming prediction data

    drawPin(); //draw the pin

    //check bubble popping
    let d = dist(tipX, tipY, bubble.x, bubble.y);
    if (d < bubble.size/2) {
      resetBubble(); //reset bubble to the bottom of the screen
      score++;
      popFX.play(); //play the bubble popping sound effect
    }
  }

  //move the bubble
  bubble.x += bubble.vx;
  bubble.y += bubble.vy;

  //reset bubble position
  if (bubble.y < 0) {
    resetBubble();
  }

  drawBubble();
}


// parseData()
// a function that divides our model rediction into useable chunks of data
function parseData() {
  //break down data from predictions
  hand = predictions[0];
  index = hand.annotations.indexFinger;
  tip = index[3];
  base = index[0];
  tipX = tip[0];
  tipY = tip[1];
  baseX = base[0];
  baseY = base[1];
}


// drawScore()
// a function that draws the score
function drawScore() {
  push();
  fill(255); //white text
  textSize(72); //good size
  textAlign(RIGHT, TOP); //upper-left corner
  textFont(scoreFont); //use the bubble font we imported
  text(score, width - 30, 20);
  pop();
}


// drawPin()
// a function that draws our pin
function drawPin() {
  //draw the pin shaft
  push();
  noFill();
  stroke(225); //make it a very light grey
  strokeWeight(2); //a little thick
  line(baseX, baseY, tipX, tipY); //draw the line from base to tip of our finger
  pop();


  push();

  //draw the pin ball
  noStroke();
  fill(255, 0, 0); //make the ball red
  ellipse(baseX, baseY, 20);

  //shading on pin ball using gradient
  for (let i = 0; i < 10; i++) {
    noFill();
    stroke(`rgba(0, 0, 0, ${i/40})`);
    ellipse(baseX, baseY, 10+i);
  }

  //highlight on pin ball using gradient
  for (let i = 0; i < 10; i++) {
    noFill();
    stroke(`rgba(255, 255, 255, ${0.5*(1-(i/10))})`);
    ellipse(baseX+2, baseY-3, i+1);
  }

  pop();
}


// drawBubble()
// a function that draws our Bubble
function drawBubble() {
  //draw the bubble
  push();
  noFill();

  //draw the edge of the bubble with a gradient
  for (let i = 0; i <= bubble.size; i++) {
    stroke(`rgba(255, 255, 255, ${(i/bubble.size)/12})`);
    ellipse(bubble.x, bubble.y, bubble.size*(i/bubble.size));
  }

  //draw the specular reflection with a gradient
  for (let i = 0; i <= bubble.size; i++) {
    stroke(`rgba(255, 255, 255, ${(i/bubble.size)/6})`);
    ellipse(bubble.x+10, bubble.y-10, (bubble.size-(bubble.size*(i/bubble.size)))/1.5);
  }
  pop();
}


// resetBubble()
// a function that resets the bubble to the bottom of the screen
function resetBubble() {
  bubble.x = random(width);
  bubble.y = height;
}
