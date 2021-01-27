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
  password: `**REDACTED**`
};

let instrumentData = undefined;
let objectData = undefined;
let tarotData = undefined;

let data;


// preload()
// Description of preload
function preload() {
  instrumentData = loadJSON(`https://raw.githubusercontent.com/dariusk/corpora/master/data/music/instruments.json`);
  objectData = loadJSON(`https://raw.githubusercontent.com/dariusk/corpora/master/data/objects/objects.json`);
  tarotData = loadJSON(`https://raw.githubusercontent.com/dariusk/corpora/master/data/divination/tarot_interpretations.json`);
}


// setup()
// Description of setup
function setup() {
  createCanvas(windowWidth, windowHeight);

  data = JSON.parse(localStorage.getItem(`spy-profile-data`));

  if (data) {
    let password = prompt(`Agent! What is your password?`);

    if (password === data.password) {
      setSpyData();
    }
  } else {
    generateSpyProfile();
  }
}


function setSpyData() {
  spyProfile.name = data.name;
  spyProfile.alias = data.alias;
  spyProfile.secretWeapon = data.secretWeapon;
  spyProfile.password = data.password;
}


function generateSpyProfile() {
  spyProfile.name = prompt(`Agent! What is your name?`);
  let instrument = random(instrumentData.instruments);
  spyProfile.alias = `The ${instrument}`;
  spyProfile.secretWeapon = random(objectData.objects);
  let card = random(tarotData.tarot_interpretations);
  spyProfile.password = random(card.keywords);

  localStorage.setItem(`spy-profile-data`, JSON.stringify(spyProfile));
}


// draw()
// Description of draw()
function draw() {
  background(255);

  let profile = `** FOR YOUR EYES ONLY **

  Name: ${spyProfile.name}
  Alias: ${spyProfile.alias}
  Secret Weapon: ${spyProfile.secretWeapon}
  Password: ${spyProfile.password}`
  ;

  push();
  textFont(`Courrier, monospace`);
  textSize(24);
  textAlign(TOP, LEFT);
  fill(0);
  text(profile, 100, 100);
  pop();
}
