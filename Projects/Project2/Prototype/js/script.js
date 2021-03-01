"use strict";

let cnv; //variable to hold the canvas
let cnvX; //the canvas' X position
let cnvY; // the canvas' Y position


let layers = []; //an array of our layer objects
let activeLayer = 0; //the current active layer object
let layerCounter = 1; //a variable used for initializing and tracking total number of layers

let moveTracking = false;
let leftScaleTracking = false;
let rightScaleTracking = false;
let topScaleTracking = false;
let bottomScaleTracking = false;




function preload() {

}


function setup() {
  cnv = createCanvas(800, 600); //create the canvas
  cnv.parent(`viewport-pane`); //position canvas in the HTML framework
  cnv.background(0); //set canvas background
  //center the canvas
  cnvX = ((windowWidth - width) - 300)/2;
  cnvY = (windowHeight - height)/2;
  cnv.position(cnvX, cnvY);

}


function draw() {
  //update the canvas position
  cnvX = ((windowWidth - width) - 300)/2;
  cnvY = (windowHeight - height)/2;
  cnv.position(cnvX, cnvY);

  background(0);


  updateActiveLayer();

  drawLayerImages();

  drawTransformPoints();

}


// mousePressed()
// tracks mouse position based on certain prerequisites
function mousePressed() {
  if (mouseX > activeLayer.xOrigin - activeLayer.width/2
   && mouseX < activeLayer.xOrigin + activeLayer.width/2
   && mouseY > activeLayer.yOrigin - activeLayer.height/2
   && mouseY < activeLayer.yOrigin + activeLayer.height/2) {
     moveTracking = true;
   }
  if (mouseX > activeLayer.xOrigin - (activeLayer.width/2) - 5
   && mouseX < activeLayer.xOrigin - (activeLayer.width/2) + 5) {
      leftScaleTracking = true;
      moveTracking = false;
  }
  if (mouseX > activeLayer.xOrigin + (activeLayer.width/2) - 5
   && mouseX < activeLayer.xOrigin + (activeLayer.width/2) + 5) {
      rightScaleTracking = true;
      moveTracking = false;
  }
  if (mouseY > activeLayer.yOrigin - (activeLayer.height/2) - 5
   && mouseY < activeLayer.yOrigin - (activeLayer.height/2) + 5) {
     topScaleTracking = true;
     moveTracking = false;
  }
  if (mouseY > activeLayer.yOrigin + (activeLayer.height/2) - 5
   && mouseY < activeLayer.yOrigin + (activeLayer.height/2) + 5) {
     bottomScaleTracking = true;
     moveTracking = false;
  }
}


// mouseReleased()
// stops tracking the mouse on release
function mouseReleased() {
  moveTracking = false;
  leftScaleTracking = false;
  rightScaleTracking = false;
  topScaleTracking = false;
  bottomScaleTracking = false;
}


// updateActiveLayer()
// updates active layer properties based on moving and scaling actions
function updateActiveLayer() {
  //update active layer info
  if (moveTracking) {
    activeLayer.xOrigin += movedX;
    activeLayer.yOrigin += movedY;
  }
  if (topScaleTracking) {
    activeLayer.yOrigin += movedY/2;
    activeLayer.height -= movedY;
  }
  if (bottomScaleTracking) {
    activeLayer.yOrigin += movedY/2;
    activeLayer.height += movedY;
  }
  if (leftScaleTracking) {
    activeLayer.xOrigin += movedX/2;
    activeLayer.width -= movedX;
  }
  if (rightScaleTracking) {
    activeLayer.xOrigin += movedX/2;
    activeLayer.width += movedX;
  }
}


// drawLayerImages()
// iterates through the layers, drawing their images
function drawLayerImages() {
  //draw the layers
  imageMode(CENTER);
  for (let i = layers.length - 1; i > -1; i--) {
    if(layers[i].img) {
      image(layers[i].img, layers[i].xOrigin, layers[i].yOrigin, layers[i].width, layers[i].height);
    }
  }
}


// drawTransformPoints()
// draws the corner and edge points for scaling actions
function drawTransformPoints() {
  //draw tranform points for active layer
  if(activeLayer.img) {
    push();
    fill(255);
    ellipse(activeLayer.xOrigin - activeLayer.width/2, activeLayer.yOrigin - activeLayer.height/2, 10); //upper left corner
    ellipse(activeLayer.xOrigin, activeLayer.yOrigin - activeLayer.height/2, 10); //upper middle
    ellipse(activeLayer.xOrigin + activeLayer.width/2, activeLayer.yOrigin - activeLayer.height/2, 10); //upper right corner
    ellipse(activeLayer.xOrigin - activeLayer.width/2, activeLayer.yOrigin, 10); //middle left side
    ellipse(activeLayer.xOrigin + activeLayer.width/2, activeLayer.yOrigin, 10); //middle right side
    ellipse(activeLayer.xOrigin - activeLayer.width/2, activeLayer.yOrigin + activeLayer.height/2, 10); //lower left corner
    ellipse(activeLayer.xOrigin, activeLayer.yOrigin + activeLayer.height/2, 10); //lower middle
    ellipse(activeLayer.xOrigin + activeLayer.width/2, activeLayer.yOrigin + activeLayer.height/2, 10); //lower right corner
    pop();
  }
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


function updateImage() {
  activeLayer.img = loadImage(URL.createObjectURL(document.getElementById("layerImage").files[0])); //load the uploaded image data
  //assign appropriate initial sizes, given our canvas
  let wxhRatio = activeLayer.img.width/activeLayer.img.height;
  console.log(activeLayer.img.width);
  if(activeLayer.type == "background") {
    activeLayer.width = width;
    activeLayer.height = height;
  } else if(width > height) {
    activeLayer.height = height/2;
    activeLayer.width = activeLayer.height * wxhRatio;
  } else {
    activeLayer.width = width/2;
    activeLayer.height = activeLayer.width * wxhRatio;
  }
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
