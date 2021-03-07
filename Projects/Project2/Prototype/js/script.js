"use strict";


let newHTMLDocument;
let demoURL;




$(`#interface-container`).click(compileHtmlDoc);








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
  height: 100%;
  width: 100%;
  background-color: blue;}`

//close the style and body tags
newHTMLDocument +=
    `</style>
  </head>`

//open the body tag
newHTMLDocument +=
  `<body>`

//insert our body html
newHTMLDocument +=
  ``

//close the body tag
newHTMLDocument +=
`</body>
</html>`

//make a blob from our html, create a URL for it, and push it to the iframe
let htmlBlob = new Blob([newHTMLDocument], {type : 'text/html'});
demoURL = URL.createObjectURL(htmlBlob);
$(`iframe`).attr(`src`, demoURL);

}
