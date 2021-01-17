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
  background(255,255,0); //set background color

  //making the animals visible
  for(let i = 0; i < animals.length; i++) {
    animals[i].update(); //call update() and by extension display() for each animal
  }

  sausageDog.update(); //draw the sausage dog
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
  for(let i = 0; i < NUM_ANIMALS; i++) {
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
  let y = random(0, height); //generate a random y position
  sausageDog = new SausageDog(x, y, sausageDogImage); //create the sausage dog
}
