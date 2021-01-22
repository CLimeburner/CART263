"use strict";

/*****************

Slamina-new-game-plus
Tutorial: Pippin Barr
Coded: Chip Limeburner

******************/

// list of animals imported from Darius Kazemi https://github.com/dariusk/corpora/blob/master/data/animals/common.json
const ANIMALS = [
      "aardvark",
      "alligator",
      "alpaca",
      "antelope",
      "ape",
      "armadillo",
      "baboon",
      "badger",
      "bat",
      "bear",
      "beaver",
      "bison",
      "boar",
      "buffalo",
      "bull",
      "camel",
      "canary",
      "capybara",
      "cat",
      "chameleon",
      "cheetah",
      "chimpanzee",
      "chinchilla",
      "chipmunk",
      "cougar",
      "cow",
      "coyote",
      "crocodile",
      "crow",
      "deer",
      "dingo",
      "dog",
      "donkey",
      "dromedary",
      "elephant",
      "elk",
      "ewe",
      "ferret",
      "finch",
      "fish",
      "fox",
      "frog",
      "gazelle",
      "gila monster",
      "giraffe",
      "gnu",
      "goat",
      "gopher",
      "gorilla",
      "grizzly bear",
      "ground hog",
      "guinea pig",
      "hamster",
      "hedgehog",
      "hippopotamus",
      "hog",
      "horse",
      "hyena",
      "ibex",
      "iguana",
      "impala",
      "jackal",
      "jaguar",
      "kangaroo",
      "koala",
      "lamb",
      "lemur",
      "leopard",
      "lion",
      "lizard",
      "llama",
      "lynx",
      "mandrill",
      "marmoset",
      "mink",
      "mole",
      "mongoose",
      "monkey",
      "moose",
      "mountain goat",
      "mouse",
      "mule",
      "muskrat",
      "mustang",
      "mynah bird",
      "newt",
      "ocelot",
      "opossum",
      "orangutan",
      "oryx",
      "otter",
      "ox",
      "panda",
      "panther",
      "parakeet",
      "parrot",
      "pig",
      "platypus",
      "polar bear",
      "porcupine",
      "porpoise",
      "prairie dog",
      "puma",
      "rabbit",
      "raccoon",
      "ram",
      "rat",
      "reindeer",
      "reptile",
      "rhinoceros",
      "salamander",
      "seal",
      "sheep",
      "shrew",
      "silver fox",
      "skunk",
      "sloth",
      "snake",
      "squirrel",
      "tapir",
      "tiger",
      "toad",
      "turtle",
      "walrus",
      "warthog",
      "weasel",
      "whale",
      "wildcat",
      "wolf",
      "wolverine",
      "wombat",
      "woodchuck",
      "yak",
      "zebra"
    ];

let currentAnimal = ``; //a variable to hold the current animal to be guessed
let currentAnswer = ``; //stores the last thing the player guessed

let answerChecked = 1; //a variable to track if the answer has been checked

let correctCounter = 0; //tracker for the number of correct answers
let wrongCounter = 0; //tracker for the number of wrong answers


// setup()
// Description of setup
function setup() {
  createCanvas(windowWidth, windowHeight); //create the canvas

  //set general font style for the game
  textSize(32);
  textStyle(BOLD);
  fill(255, 255, 255);

  displayScore(); //create initial graphics

  //implement annyang
  if (annyang) {
    let commands = {
      'I think it is *animal': guessAnimal
    };
    annyang.addCommands(commands); //add the command we just defined
    annyang.start(); //start annyang running
  }
}


// draw()
// Description of draw()
function draw() {

}


// mousePressed()
// a function that triggers on a mouse click
function mousePressed() {
  nextQuestion(); //advance to the next question
}


// guessAnimal(animal)
// a function that determines if a guessed "animal" is correct
function guessAnimal(animal) {
  answerChecked = 0; //signify the current answer hasn't been checked yet
  currentAnswer = animal.toLowerCase(); //store input

  checkCorrect(); //update score and feedback color
  displayScore(); //update score graphic
  displayAnswer(); //show feedback answer on screen
}


// sayBackwards(animal)
// a function that will take an "animal" input and say it backwards
function sayBackwards() {
  let reverseAnimal = reverseString(currentAnimal); //reverse the current animal
  responsiveVoice.speak(reverseAnimal); //say the reversed animal with responsive voice
}


// nextQuestion()
// a function that advances to the next question
function nextQuestion() {
  currentAnimal = random(ANIMALS); //pull a random animal
  sayBackwards(); //say the currentAnimal backwards

  displayScore(); //clear the screen and update the score
}


// displayScore()
// a function that draws the score on screen
function displayScore() {
  clear(); //clear screen
  background(0); // black background

  //draw the score in the upper left corner
  textAlign(LEFT, TOP);
  text(`Correct Guesses: ${correctCounter}`, 10, 10);
  text(`Wrong Guesses: ${wrongCounter}`, 10, 50);
}


// displayAnswer()
// a function that colors text and then displays it as feedback for the player
function displayAnswer() {
  //set some rules for the text we'll use as game feedback
  textAlign(CENTER, CENTER);
  text(currentAnswer, width/2, height/2); //display the guessed answer with appropriate color

  answerChecked = 1; //signify that the answer has been process already
}


// checkCorrect()
// a function to carry out the neccesary steps based on if an answer is correct or not
function checkCorrect() {
  //check to see if the answer was correct
  if (currentAnswer === currentAnimal) {
    fill(0, 255, 0); //if correct, make the text green
    correctCounter++; //increment the number of correct guesses
  }
  else {
    fill(255, 0, 0); //if wrong, make the text red
    wrongCounter++; //increment the number of wrong guesses
  }
}


// reverseString(string)
// a function that takes a string "string" and reverses it
function reverseString(string) {
  // Split the string into an array of characters
  let characters = string.split('');
  // Reverse the array of characters
  let reverseCharacters = characters.reverse();
  // Join the array of characters back into a string
  let result = reverseCharacters.join('');
  // Return the result
  return result;
}
