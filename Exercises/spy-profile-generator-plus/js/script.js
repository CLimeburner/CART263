"use strict";

/*****************

Spy Profile Generator+
Tutorial: Pippin Barr
Coded: Chip Limeburner

Exercise 3 extending activity 3.

******************/


let spyProfile = {
  name: `**REDACTED**`,
  alias: `**REDACTED**`,
  secretWeapon: `**REDACTED**`,
  posting:  `**REDACTED**`,
  mission: `**REDACTED**`,
  password: `**REDACTED**`
};

//array of tasks
let tasks = [
  `stop`,
  `prevent`,
  `instigate`,
  `initiate`,
  `assist`,
  `aid`,
  `delay`,
  `observe`,
  `document`
];

//array of titles
let titles = [
  `Dr.`,
  `Mr.`,
  `Mrs.`,
  `Miss`,
  `Agent`,
  `Operative`,
  `The Great`,
  `Fr.`,
  `Chairman`
];

//array names
let names = [
  `Scoopini`,
  `Voldosknaya`,
  `De La Battrie`,
  `Krausmann`,
  `Stevens`,
  `Noh`,
  `Garry`,
  `Kleinberg`,
  `Elroy`,
  `McBartles`,
  `Jones`,
  `Johnson`
];

//array of actions
let actions = [
  `blowing up`,
  `invading`,
  `incapacitating`,
  `stealing`,
  `sabotaging`,
  `targeting`,
  `damaging`,
  `hiding`,
  `relocating`,
  `counterfeiting`,
  `infiltraing`
];

//array of targets
let targets = [
  `the moldavian embassy`,
  `the moon`,
  `the hope diamond`,
  `the queen of England`,
  `the Smithsonian Museum`,
  `all the squirrels of Malta`,
  `15 tons of spanish gold`,
  `the Declaration of Independance`,
  `the stock market`,
  `important archaeological ruins`,
  `the Vatican archives`,
  `the last breeding pair of pandas`,
  `government secrets`,
  `nuclear weapons`,
  `hyperdrive technology`
];

let instrumentData = undefined;
let objectData = undefined;
let tarotData = undefined;
let countryData = undefined;

let data; //a buffer variable to store profile data pulled from local storage

let texture; //a variable to hold our aged paper texture


// preload()
// Description of preload
function preload() {
  //JSON files taken from dariusk https://github.com/dariusk/corpora/tree/master/data
  instrumentData = loadJSON(`https://raw.githubusercontent.com/dariusk/corpora/master/data/music/instruments.json`);
  objectData = loadJSON(`https://raw.githubusercontent.com/dariusk/corpora/master/data/objects/objects.json`);
  tarotData = loadJSON(`https://raw.githubusercontent.com/dariusk/corpora/master/data/divination/tarot_interpretations.json`);
  countryData = loadJSON(`https://raw.githubusercontent.com/dariusk/corpora/master/data/geography/countries.json`);

  texture = loadImage(`assets/images/texture.png`);
}


// setup()
// Description of setup
function setup() {
  createCanvas(windowWidth, windowHeight); //initialize canvas

  data = JSON.parse(localStorage.getItem(`spy-profile-data`)); //pull any relevant locally stored data

  if (data) {
    let password = prompt(`Agent! What is your password?`); //prompt user for their password

    //compare input password
    if (password === data.password) {
      setSpyData(); //if it's a match, import the appropriate data
    }
  } else {
    generateSpyProfile(); //if there is no existing profile to import, create one
  }
}


// setSpyData()
// a function that imports spy profile data from local storage
function setSpyData() {
  spyProfile.name = data.name;
  spyProfile.alias = data.alias;
  spyProfile.secretWeapon = data.secretWeapon;
  spyProfile.posting = data.posting;
  spyProfile.mission = data.mission;
  spyProfile.password = data.password;
}


// generateSpyProfile()
// a function that uses JSON data to create a new spy profile
function generateSpyProfile() {
  spyProfile.name = prompt(`Agent! What is your name?`); //prompt user for their name
  let instrument = random(instrumentData.instruments); //generate an alias
  spyProfile.alias = `The ${instrument}`;
  spyProfile.secretWeapon = random(objectData.objects); //generate a weapon
  spyProfile.posting = random(countryData.countries); //generate a Posting
  spyProfile.mission = `To ${random(tasks)} ${random(titles)} ${random(names)} ${random(actions)} ${random(targets)}`;
  let card = random(tarotData.tarot_interpretations); //generate a password
  spyProfile.password = random(card.keywords);

  localStorage.setItem(`spy-profile-data`, JSON.stringify(spyProfile)); //save profile to local storage after generation
}


// draw()
// Description of draw()
function draw() {
  displayPaper(); //draw the paper background

  //initialize a form string
  let profile = `** FOR YOUR EYES ONLY **

  Name: ${spyProfile.name}
  Alias: ${spyProfile.alias}
  Posting: ${spyProfile.posting}
  Mission: ${spyProfile.mission}
  Assigned Gadgets: ${spyProfile.secretWeapon}
  Password: ${spyProfile.password}`
  ;

  //draw the profile text
  push();
  textFont(`Courrier, monospace`);
  textSize(24);
  textAlign(TOP, LEFT);
  fill(0);
  text(profile, 100, 100);
  pop();
}


// displayPaper()
// a function that makes the background look like aged and creased paper
function displayPaper() {
  background(`rgba(245, 230, 190, 1)`); //slightly off-white yellow

  //draw low alpha stain texture on "page"
  push();
  tint(255, 45);
  image(texture, 0,0, width, height);
  pop();

  //draw the horizontal rules
  push();
  stroke(`rgba(50, 0, 200, 0.5)`); //light blue
  strokeWeight(2);
  for (let i = 105; i < height; i = i + 30) {
    line(0, i, width, i);
  }
  pop();

  //draw the vertical margin rule
  push();
  stroke(`rgba(150, 0, 100, 0.5)`); //light red
  strokeWeight(5);
  line(85, 0, 85, height);
  pop();

  //draw page crease
  push();
  //draw gradient of shadow in the crease
  for(let i = 0; i < 30; i++) {
    stroke(lerpColor(color(`rgba(0,0,0,0.25)`),color(`rgba(150,150,150,0)`),i/30));
    line(0,(height/2)-(i),width,(height/2)-(i));
    line(0,(height/2)+30-(30-i),width,(height/2)+30-(30-i));
  }
  //draw the crease line itself
  stroke(`rgba(0,0,0,0.1)`);
  strokeWeight(3);
  line(0,height/2,width,height/2);
  pop();
}
