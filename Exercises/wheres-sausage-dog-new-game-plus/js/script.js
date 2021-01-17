"use strict";

/*****************

Where's Sausage Dog?
Tutorial by: Pippin Barr
Coded by: Chip Limeburner

A "Where's Wally" style game where you look for sausage dog!

******************/

const NUM_ANIMAL_IMAGES = 10; //number of animal images to use
const NUM_ANIMALS = 100; //number of animal objects to create

const IMAGE_PATH = 'assets/images/'; //a global constant to store our image file path in case we need to update it

let animalImages = []; //array to store animal images
let animals = []; //array to store animal objects

let sausageDogImage = undefined; //initialize variable to hold the dog image
let sausageDog = undefined; //initialize the object to hold the dog

let level = 1; //initialize a variable to track the level players are on
let numAnimals = level * 5; //a variable to scale the number of interference animals with each level

let levelTime = 1000 + (level * 5); //a variable to track the total time given for the level
let timeRemaining = levelTime; //a variable to track the time remaining in the level
let isTiming = true; //a variable to start and stop the timer

// preload()
// a function to prepare assets before initializing the game
function preload() {
  //loop initializing animal images
  for(let i = 0; i < NUM_ANIMAL_IMAGES; i++) {
    let animalImage = loadImage(IMAGE_PATH + `animal${i}.png`); //pull next image from assets folder
    animalImages.push(animalImage); //append image to end of our images array
  }

  sausageDogImage = loadImage(IMAGE_PATH + `sausage-dog.png`); //load the dog image
}


// setup()
// a function to initialize our game
function setup() {
  createCanvas(windowWidth, windowHeight); //initialize canvas

  createAnimals(); //create all the generic animals

  createSausageDog(); //create out sausage dog hero
}


// draw()
// a function to draw our graphics
function draw() {
  timeUpdate(); //update time remaining

  background(250,195,42); //set background color

  //making the animals visible
  for(let i = 0; i < animals.length; i++) {
    animals[i].update(); //call update() and by extension display() for each animal
  }

  sausageDog.update(); //draw the sausage dog

  displayLevel(); //draw the current level numeral
  displayTimerBar(); //draw the timer bar
}


// mousePressed()
// a function called when the mouse clicks anywhere on the window
function mousePressed() {
  sausageDog.mousePressed(); //call sausage dog's click-testing function
}


// createAnimals()
// a function that initializes all our generic animals
function createAnimals() {
  // Create the animals
  for(let i = 0; i < numAnimals; i++) {
    let x = random(0, width); //generate a random x position
    let y = random(0, height); //generate a random y position
    let animalImage = random(animalImages); //pull a random animal image
    let animal = new Animal(x, y, animalImage); //construct the animal
    animals.push(animal); //append the animal to our array of animals
  }
}


// createSausageDog()
// a function that creates our sausage dog
function createSausageDog() {
  let x = random(0, width); //generate a random x position
  let y = random(80, height); //generate a random y position that isn't under the GUI
  sausageDog = new SausageDog(x, y, sausageDogImage); //create the sausage dog
}


// timeUpdate()
// a function that manages the timer values
function timeUpdate() {
  //if the time remaining is zero, stop the clock
  if (timeRemaining === 0) {
    isTiming = false;
  }

  //if the clock is running, reduce the time remaining
  if (isTiming) {
    timeRemaining--; //update time remaining to find the dog
  }
}



// displayLevel()
// a function that displays the current level in the upper-right-hand corner
function displayLevel() {
  push();
  textSize(128); //make the numeral big
  fill(255, 255, 255); //make it white
  strokeWeight(20);
  stroke(0); // stroke around outside of numeral for easier visibility
  textFont('Courier'); //set font to Courier
  textAlign(RIGHT); //align right so as digits increase it doesn't run off the screen
  text(level, width - 50, 120); //position it in the upper right-hand corner
  pop();
}


// displayTimerBar()
// a function that draws the timer bar at each frame
function displayTimerBar() {
  let timerPercent = 100;

  push();

  //draw the timer bar background
  fill(0, 0, 0);
  rect(30, 50, 310, 50);

  timerPercent = timeLeft(timeRemaining); //determine what percentage of time is left

  //draw the timer bar based on the percentage of time left
  fill(255-255*timerPercent, 255*timerPercent, 0);
  rect(35, 55, (300*timerPercent), 40);

  pop();
}


// timeLeft(time)
// a function that calculates how much time is left of the total level time based on an input of time remaining
function timeLeft(time) {
  return (time/levelTime);
}


// levelUpdate()
// a function that sets a timer when Sausage Dog is found and updates the screen to the next level when the timer runs out
function levelUpdate() {
  level++; //increment the level
  numAnimals = level * 5; //increase the number of animals to increase the difficulty
  levelTime = level * 1000; //update time
  timeRemaining = levelTime; //start timer again
  isTiming = true; //start the clock
  setup(); //reset the screen
}
