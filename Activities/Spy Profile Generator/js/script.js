"use strict";

/*****************

Spy Porfile Generator
Tutorial: Pippin Barr
Coded: Chip Limeburner

Description

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

  let data = JSON.parse(localStorage.getItem(`spy-profile-data`));

  if (data) {
    let password = prompt(`Agent! What is your password?`);

    if (password === data.password) {
      spyProfile.name = data.name;
      spyProfile.alias = data.alias;
      spyProfile.secretWeapon = data.secretWeapon;
      spyProfile.password = data.password;
    }

  } else {
    generateSpyProfile();
  }
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
