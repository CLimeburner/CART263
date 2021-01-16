"use strict";

/*****************

Where's Sausage Dog?
Author Name

A "Where's Wally" style game where you look for sausage dog!

******************/

const NUM_ANIMAL_IMAGES = 10; //number of animal images to use
const NUM_ANIMALS = 100; //number of animal objects to create

let animalImages = []; //array to store animal images
let animals = []; //array to store animal objects

let sausageDogImage = undefined; //initialize variable to hold the dog image
let sausageDog = undefined; //initialize the object to hold the dog

// preload()
// Description of preload
function preload() {
  //loop initializing animal images
  for(let i = 0; i < NUM_ANIMAL_IMAGES; i++) {
    let animalImage = loadImage(`assets/images/animal${i}.png`); //pull next image from assets folder
    animalImages.push(animalImage); //append image to end of our images array
  }

  sausageDogImage = loadImage(`assets/images/sausage-dog.png`); //load the dog image
}


// setup()
// Description of setup
function setup() {
  createCanvas(windowWidth, windowHeight); //initialize canvas

  // Create the animals
  for(let i = 0; i < NUM_ANIMALS; i++) {
    let x = random(0, width); //generate a random x position
    let y = random(0, height); //generate a random y position
    let animalImage = random(animalImages); //pull a random animal image
    let animal = new Animal(x, y, animalImage); //construct the animal
    animals.push(animal); //append the animal to our array of animals
  }

  let x = random(0, width); //generate a random x position
  let y = random(0, height); //generate a random y position
  sausageDog = new SausageDog(x, y, sausageDogImage); //create the sausage dog
}


// draw()
// Description of draw()
function draw() {
  background(255,255,0); //set background color

  //making the animals visible
  for(let i = 0; i < animals.length; i++) {
    animals[i].update(); //call update() and by extension display() for each animal
  }

  sausageDog.update(); //draw the sausage dog
}


// mousePressed()
// Description of mousePressed()
function mousePressed() {
  sausageDog.mousePressed(); //call sausage dog's click-testing function
}
