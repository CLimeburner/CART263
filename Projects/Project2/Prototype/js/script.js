"use strict";


let newHTMLDocument;
let demoURL;

let backingColor = `#ffffff`;
let title = `Choose a title`;
let paragraph = `Enter some paragraph text`;


compileHtmlDoc();



function updateBackgroundColor() {
  backingColor = $(`#color-box`).val();
  compileHtmlDoc();
}


function updateTitle() {
  title = $(`#title-box`).val();
  compileHtmlDoc();
}


function updateParagraph() {
  paragraph = $(`#copy-box`).val();
  compileHtmlDoc();
}


function compileHtmlDoc() {

//clear the html
newHTMLDocument = ``;

//open the head tag + generic head contents
newHTMLDocument +=
`<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0>

    <title>Demo-frame</title>`

//open the style tag
newHTMLDocument +=
    `<style>`

//insert our CSS
newHTMLDocument +=
`body {
  position: fixed;
  height: 600px;
  width: 400px;
  top: 0;
  left: 0;
  margin: 0px;
}

 #diagram-container {
  position: fixed;
  height: 600px;
  width: 400px;
  top: 0;
  left: 0;
  background-color: ${backingColor};
 }`

//close the style and body tags
newHTMLDocument +=
    `</style>
  </head>`

//open the body tag
newHTMLDocument +=
  `<body>
    <div id="diagram-container">`

//insert our body html
newHTMLDocument +=
  `<h1>${title}</h1>
  <p>${paragraph}
  </p>`

//close the body tag
newHTMLDocument +=
`</div>
 </body>
</html>`

//make a blob from our html, create a URL for it, and push it to the iframe
let htmlBlob = new Blob([newHTMLDocument], {type : 'text/html'});
demoURL = URL.createObjectURL(htmlBlob);
$(`iframe`).attr(`src`, demoURL);
}


function exportHtml() {
  $(`#download-link`).attr(`download`, `${title}.html`);
  $(`#download-link`).attr(`href`, demoURL);
  document.getElementById(`download-link`).click();
}
