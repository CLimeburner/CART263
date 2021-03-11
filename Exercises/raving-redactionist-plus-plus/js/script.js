/**
Raving Redactionist++

Coded by: Chip Limeburner

*/

"use strict";

let difficulty = 0.05; //a variable to allow us to manipulate the probablity of elements becoming visible

$(`.top-secret`).on(`click`, redact); //add an event listener for clicking on top-secret elements

setInterval(revelation, 750); //every "timer" interval, call the revelation function

// redact(event)
// hide elements that have been clicked
function redact(event) {
  $(this).removeClass(`revealed`);
  $(this).addClass(`redacted`);
  $(`#counter`).html($(`.revealed`).length); //update counter of revealed secrets
}

//  revelation()
//  for each redacted element, attempt to reveal it
function revelation() {
  $(`.redacted`).each(attemptReveal);
  difficulty += 0.001; //increase the probability of a reveal
}

// attemptReveal()
// reveals elements at a random probabilityx
function attemptReveal() {
  let r = Math.random();
  if(r < difficulty) {
    $(this).removeClass(`redacted`);
    $(this).addClass(`revealed`);
  }
  $(`#counter`).html($(`.revealed`).length); //update counter of revealed secrets
}
