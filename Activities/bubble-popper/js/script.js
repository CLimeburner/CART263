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
}


// draw()
// Description of draw()
function draw() {

}
