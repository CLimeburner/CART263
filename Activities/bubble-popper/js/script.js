"use strict";

/*****************

Bubble Popper
Tutorial: Pippin Barr
Coded: Chip Limeburner

An activity using machine learning!

******************/


let video = undefined; //a variable to store the user's webcam

let handpose = undefined; //a vairable to store the hand pose model

let predictions = []; //a variable to store predictions from the hand pose model

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
    console.log(results);
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
  background(0); //make the background black

  if (predictions.length > 0) {
    //break down data from predictions
    let hand = predictions[0];
    let index = hand.annotations.indexFinger;
    let tip = index[3];
    let base = index[0];
    let tipX = tip[0];
    let tipY = tip[1];
    let baseX = base[0];
    let baseY = base[1];

    //draw the pin shaft
    push();
    noFill();
    stroke(255);
    strokeWeight(2);
    line(baseX, baseY, tipX, tipY);
    pop();

    //draw the pin ball
    push();
    noStroke();
    fill(255, 0, 0);
    ellipse(baseX, baseY, 20);
    pop();
  }

  //move the bubble
  bubble.x += bubble.vx;
  bubble.y += bubble.vy;

  //reset bubble position
  if (bubble.y < 0) {
    bubble.x = random(width);
    bubble.y = height;
  }

  //draw the bubble
  push();
  fill(0, 100, 200);
  noStroke();
  ellipse(bubble.x, bubble.y, bubble.size);
  pop();
}
