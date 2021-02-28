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


// createNewLayer()
// initializes new layers
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
   <H3>${layers[layers.length-1].name}</H3>`;

  layerTab.addEventListener("click", tabSwitcher(layerTab)); //add the event listener that allows the tab to be selected
  layerTab.children[0].children[0].addEventListener("click", moveLayerUp(layerTab));
  layerTab.children[0].children[1].addEventListener("click", moveLayerDown(layerTab));
  if(layerCounter == 1) {
    activeLayer = layerTab;
    layerTab.id += "current-layer-tab";
  }
  layerCounter++; //increment layerCounter
}


// tabSwitcher(tab)
// makes tab the active layer and updates the toolbar to reflect as such
function tabSwitcher(tab) {
  return function() { //returns a function so the callback can take parameters
    setActiveLayer(tab); //assigns tab as the active layer
    setToolbarProperties(); //updates toolbar to display properties for the active layer
  }
}


// tabSelector(tab)
// makes tab the active layer and updates the toolbar to reflect as such
function tabSelector(tab) {
  setActiveLayer(tab); //assigns tab as the active layer
  setToolbarProperties(); //updates toolbar to display properties for the active layer
}


// moveLayerUp(tab)
// swaps the position of tab with the layer above it
function moveLayerUp(tab) {
  return function() {
    tabSelector(tab); //make the moving layer the active one
    if(layers[activeLayer.layersIndex-2]) {
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
  }
}

// moveLayerDown(tab)
// swaps the position of tab with the layer below it
function moveLayerDown(tab) {
  return function() {
    tabSelector(tab); //make the moving layer the active one
    if(layers[activeLayer.layersIndex]) {
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
  }
}


// updateName(event)
// updates the active layer's name
function updateName(event) {
  if(event.key == "Enter") {
    activeLayer.name = document.getElementById("layerName").value;
    document.getElementById("layer-list").children[activeLayer.layersIndex].children[1].innerHTML = activeLayer.name;
  }
}


// updateType()
// updates the active layer's type
function updateType() {
  activeLayer.type = document.getElementById("layerType").value;
}


// setActiveLayer(tab)
// makes the arrangements to set tab as the active layer
function setActiveLayer(tab) {
  for (let i = 2; i < document.getElementById("layer-list").childNodes.length; i++) {
    if (document.getElementById("layer-list").childNodes[i] === tab) {
      activeLayer = layers[i-3]; //if the iterated tab is the one you clicked, make it the active one
    } else {
      document.getElementById("layer-list").childNodes[i].id = "" //otherwise make sure it ISNT the active one
    }
  }
  tab.id += "current-layer-tab"; //give the clicked tab the current layer ID
}


// setToolbarProperties()
// updates the toolbar to display the active layer's properties
function setToolbarProperties() {
  document.getElementById("layerName").value = activeLayer.name;
  document.getElementById("layerType").value = activeLayer.type;
}
