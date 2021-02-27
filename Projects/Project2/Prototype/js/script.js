"use strict";

let cnv;


let layers = []; //an array of our layer objects
let activeLayer = 0; //the current active layer object
let layerCounter = 1; //a variable used for initializing and tracking total number of layers




function preload() {

}


function setup() {
  cnv = createCanvas(800, 600);
  cnv.parent(`viewport-pane`);
  cnv.background(0);

}


function draw() {

}

function keyPressed() {
  if (key === "y") {
    if (activeLayer.layersIndex-1 != 0) {
      //moveLayerUp(layers[activeLayer.layersIndex-1],layers[activeLayer.layersIndex-2]);
      moveLayerUp();
    }
  } else if (key === "h") {
    if (activeLayer.layersIndex != layers.length) {
      //moveLayerDown(layers[activeLayer.layersIndex-1],layers[activeLayer.layersIndex]);
      moveLayerDown();
    }
  }
}


function createNewLayer() {
  layers.push(new Layer(layerCounter)); //create the new layer object and add it to the layers array
  let layerTab = document.createElement("div"); //create the tab
  layerTab.className += "layer-tab"; //assign the tab's class

  document.getElementById("layer-list").appendChild(layerTab); //add the tab to the layer-list
  //addMovementButtons(layerTab);

  layerTab.innerHTML = //add some inner structure for button
  `<div style="float: left;">
     <div class="up-button"></div>
     <div class="down-button"></div>
   </div>
   <H3>Layer ${layerCounter}</H3>`;

  layerTab.addEventListener("click", tabSwitcher(layerTab)); //add the event listener that allows the tab to be selected
  layerTab.children[0].children[0].addEventListener("click", moveLayerUp);
  layerTab.children[0].children[1].addEventListener("click", moveLayerDown);
  if(layerCounter == 1) {
    activeLayer = layerTab;
    layerTab.id += "current-layer-tab";
  }
  layerCounter++; //increment layerCounter
}


function tabSwitcher(tab) {
  return function() { //returns a function so the callback can take parameters
    for (let i = 2; i < document.getElementById("layer-list").childNodes.length; i++) {
      if (document.getElementById("layer-list").childNodes[i] === tab) {
        activeLayer = layers[i-3]; //if the iterated tab is the one you clicked, make it the active one
      } else {
        document.getElementById("layer-list").childNodes[i].id = "" //otherwise make sure it ISNT the active one
      }
    }
    tab.id += "current-layer-tab"; //give the clicked tab the current layer ID
  }
}

function tabSelector(tab) {
  for (let i = 2; i < document.getElementById("layer-list").childNodes.length; i++) {
    if (document.getElementById("layer-list").childNodes[i] === tab) {
      activeLayer = layers[i-3]; //if the iterated tab is the one you clicked, make it the active one
    } else {
      document.getElementById("layer-list").childNodes[i].id = "" //otherwise make sure it ISNT the active one
    }
  }
  tab.id += "current-layer-tab"; //give the clicked tab the current layer ID
}


function moveLayerUp() {
  //////needs to change active layer somehow
  let layerA = layers[activeLayer.layersIndex-1]; //the active tab
  let layerB = layers[activeLayer.layersIndex-2]; //the tab it's replacing
  let list = document.getElementById("layer-list"); //get our layer-list object
  let buffer = layerB; //get the adjacent element above
  layers[layerA.layersIndex-2] = layerA; //move layerA up in the array
  layers[layerA.layersIndex-1] = buffer; //move layerB to where layerA used to be
  list.children[layerA.layersIndex-1].insertAdjacentElement("beforebegin", list.children[layerA.layersIndex]); //move the DOM element physically up in the child list
  //swap layer index values
  layerA.layersIndex--;
  layerB.layersIndex++;
}

function moveLayerDown() {
  //////needs to change active layer somehow
  let layerA = layers[activeLayer.layersIndex-1]; //the active tab
  let layerB = layers[activeLayer.layersIndex]; //the tab it's replacing
  let list = document.getElementById("layer-list"); //get our layer-list object
  let buffer = layerB; //get the adjacent element below
  layers[layerA.layersIndex] = layerA; //move layerA down in the array
  layers[layerA.layersIndex-1] = buffer; //move layerB to where layerA used to be
  list.children[layerA.layersIndex+1].insertAdjacentElement("afterend", list.children[layerA.layersIndex]);//move the DOM element physically down in the child list
  //swap layer index values
  layerA.layersIndex++;
  layerB.layersIndex--;
}
