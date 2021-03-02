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
  ,
  ,
  ,

];

//array of text colors for each season
let seasonTextColors = [
  ,
  ,
  ,

];

//aray of five syllable lines for each season
let fiveSyllableLines = [

  [`Crocuses in bloom`,
  `Warm rain falls to earth`,
  `?`,
  `?`,
  `?`],

  [`Campfires at dusk`,
  `Soft beams of sunlight`,
  `?`,
  `?`,
  `?`],

  [`Leaves fall from branches`,
  `?`,
  `?`,
  `?`,
  `?`],

  [`Snow gently falling`,
  `?`,
  `?`,
  `?`,
  `Refrigerator`],

];

//array of seven syllable lines for each season
let sevenSyllableLines = [

  [`?`,
  `?`,
  `?`,
  `?`,
  `?`],

  [`?`,
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
line1P.addEventListener(`click`, titleClicked);

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


function titleClicked(event) {

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
    setNewLine(element);
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


function setNewLine(element) {
  if(element === line1P || element === line3P) {
    element.innerText = random(fiveSyllableLines);
  } else if(element === line2P) {
    element.innerText = random(sevenSyllableLines);
  }
}


function random(array) {
  let index = Math.floor(Math.random() * array[seasonIndex].length);
  return array[seasonIndex][index];
}
