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

// preload()
// Description of preload
function preload() {

}


// setup()
// Description of setup
function setup() {
  createCanvas(windowWidth, windowHeight);

  spyProfile.name = prompt(`Agent! What is your name?`);
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
