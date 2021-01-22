"use strict";

/*****************

Slamina
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


// setup()
// Description of setup
function setup() {
  //implement annyang
  if (annyang) {
    let commands = {
      'I think it is *animal': guessAnimal
    };
    annyang.addCommands(commands); //add the command we just defined
    annyang.start(); //start annyang running

    //set some rules for the text we'll use as game feedback
    textSize(32);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
  }
}


// draw()
// Description of draw()
function draw() {

}


// mousePressed()
// a function that triggers on a mouse click
function mousePressed() {
  currentAnimal = random(ANIMALS); //pull a random animal
  let reverseAnimal = reverseString(currentAnimal); //reverse the current animal
  responsiveVoice.speak(reverseAnimal); //say the reversed animal with responsive voice
}


// guessAnimal(animal)
// a function that determines if a guessed "animal" is correct
function guessAnimal(animal) {
  currentAnswer = animal; //store input
  console.log(currentAnswer); //print input to console.log
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
