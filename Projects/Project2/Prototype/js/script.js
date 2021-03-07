"use strict";


let newHTMLDocument;
let demoURL;




$(`#interface-container`).click(compileHtmlDoc);








function compileHtmlDoc() {

newHTMLDocument = ``;

newHTMLDocument +=
`<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0>

    <title>Demo-frame</title>

    <style>`

newHTMLDocument +=
`body {height: 100%;, width: 100%; background-color: blue;}
`




newHTMLDocument +=
    `</style>
  </head>
  <body>`







newHTMLDocument +=
`</body>
</html>`

//console.log(newHTMLDocument);
let htmlBlob = new Blob([newHTMLDocument], {type : 'text/html'});
demoURL = URL.createObjectURL(htmlBlob);
console.log(demoURL)
$(`iframe`).attr(`src`, demoURL);
}
