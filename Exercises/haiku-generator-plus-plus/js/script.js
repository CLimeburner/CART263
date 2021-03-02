/**

Haiku Generator ++
Coded by: Chip Limeburner


*/

"use strict";

//array of seasons
let seasons = [
  `Spring`,
  `Summer`,
  `Autumn`,
  `Winter`
];

//arrary of background colors for each season
let seasonBackgrounds = [
  `#acde73`,
  `#45e6d8`,
  `#b5783e`,
  `#69b3d1`
];

//array of text colors for each season
let seasonTextColors = [
  `#f8fcb8`,
  `#f6fcd2`,
  `#f0e8d3`,
  `#d3f0ed`
];

//aray of five syllable lines for each season
let fiveSyllableLines = [

  [`Crocuses in bloom`,
  `Warm rain falls to earth`,
  `Ripples on the pond`,
  `?`,
  `?`],

  [`Campfires at dusk`,
  `Soft beams of sunlight`,
  `?`,
  `?`,
  `?`],

  [`Leaves fall from branches`,
  `Birds migrating south`,
  `?`,
  `?`,
  `?`],

  [`Snow gently falling`,
  `Warm by the fire`,
  `?`,
  `?`,
  `Refrigerator`],

];

//array of seven syllable lines for each season
let sevenSyllableLines = [

  [`New offshoots in the forest`,
  `?`,
  `?`,
  `?`,
  `?`],

  [`Waves crash on the sandy beach`,
  `?`,
  `?`,
  `?`,
  `?`],

  [`The coming chill of winter`,
  `?`,
  `?`,
  `?`,
  `?`],

  [`?`,
  `?`,
  `?`,
  `?`,
  `?`],

];

//generate a random season title
let seasonIndex = Math.floor(Math.random() * 4);
let title = seasons[seasonIndex];
let titleH1 = document.getElementById(`title`);
titleH1.innerText = title;
titleH1.addEventListener(`click`, titleClicked);

// generate three random lines
let line1 = random(fiveSyllableLines);
let line2 = random(sevenSyllableLines);
let line3 = random(fiveSyllableLines);

let line1P = document.getElementById(`line-1`);
let line2P = document.getElementById(`line-2`);
let line3P = document.getElementById(`line-3`);

line1P.innerText = line1;
line2P.innerText = line2;
line3P.innerText = line3;

line1P.addEventListener(`click`, lineClicked);
line2P.addEventListener(`click`, lineClicked);
line3P.addEventListener(`click`, lineClicked);


document.body.style[`background-color`] = seasonBackgrounds[seasonIndex];
document.getElementById(`title`).style[`color`] = seasonTextColors[seasonIndex];
let lines = document.getElementsByClassName(`haiku-line`);
for (let i = 0; i < lines.length; i++) {
  lines[i].style[`color`] = seasonTextColors[seasonIndex];
}


function titleClicked(event) {
  fadeOut(event.target, 1);
}


function lineClicked(event) {
  fadeOut(event.target, 1);
}


function fadeOut(element, opacity) {
  opacity -= 0.01;
  element.style[`opacity`] = opacity;
  if (opacity > 0) {
    requestAnimationFrame(function() {
      fadeOut(element, opacity);
    });
  } else {
    if (element.id == `title`) {
      setNewTitle(element);
      setTimeout(function() {
        fadeOut(line1P, 1);
      }, 100);
      setTimeout(function() {
        fadeOut(line2P, 1);
      }, 600);
      setTimeout(function() {
        fadeOut(line3P, 1);
      }, 1100);
    } else {
      setNewLine(element);
    }
    fadeIn(element, 0);
  }
}


function fadeIn(element, opacity) {
  opacity += 0.01;
  element.style[`opacity`] = opacity;
  if (opacity < 1) {
    requestAnimationFrame(function() {
      fadeIn(element, opacity);
    });
  }
}


function setNewTitle(element) {
  seasonIndex = Math.floor(Math.random() * 4);
  element.innerText = seasons[seasonIndex];
  document.body.style[`background-color`] = seasonBackgrounds[seasonIndex];
  document.getElementById(`title`).style[`color`] = seasonTextColors[seasonIndex];
}


function setNewLine(element) {
  if(element === line1P || element === line3P) {
    element.innerText = random(fiveSyllableLines);
  } else if(element === line2P) {
    element.innerText = random(sevenSyllableLines);
  }
  lines = document.getElementsByClassName(`haiku-line`);
  for (let i = 0; i < lines.length; i++) {
    lines[i].style[`color`] = seasonTextColors[seasonIndex];
  }
}


function random(array) {
  let index = Math.floor(Math.random() * array[seasonIndex].length);
  return array[seasonIndex][index];
}
