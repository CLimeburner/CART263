"use strict";

/*****************

Bubble Popper++
Tutorial: Pippin Barr
Coded: Chip Limeburner

An exercise extending the bubble popper activity.

******************/


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


// setup()
// Description of setup
function setup() {
  createCanvas(640, 480); //create the canvas

  //access the user's webcam and hide it
  video = createCapture(VIDEO);
  video.hide();

  //load the handpose model
  handpose = ml5.handpose(video, {
    flipHorizontal: true
  }, function() {
    console.log(`Model loaded.`);
  });

  //listen for predictions
  handpose.on(`predict`, function(results) {
    //console.log(results);
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
// Description of draw()
function draw() {
  background(120, 180, 255); //make the background light blue

  if (predictions.length > 0) {
    parseData(); //divide up incoming prediction data

    drawPin();

    //check bubble popping
    let d = dist(tipX, tipY, bubble.x, bubble.y);
    if (d < bubble.size/2) {
      resetBubble();
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


// drawPin()
// a function that draws our pin
function drawPin() {
  //draw the pin shaft
  push();
  noFill();
  stroke(225);
  strokeWeight(2);
  line(baseX, baseY, tipX, tipY);
  pop();

  //draw the pin ball
  push();
  noStroke();
  fill(255, 0, 0);
  ellipse(baseX, baseY, 20);
  //shading on pin ball
  for (let i = 0; i < 10; i++) {
    noFill();
    stroke(`rgba(0, 0, 0, ${i/40})`);
    ellipse(baseX, baseY, 10+i);
  }
  //highlight on pin ball
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

  //draw the edge of the bubble
  for (let i = 0; i <= bubble.size; i++) {
    stroke(`rgba(255, 255, 255, ${(i/bubble.size)/12})`);
    ellipse(bubble.x, bubble.y, bubble.size*(i/bubble.size));
  }

  //draw the specular reflection
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
