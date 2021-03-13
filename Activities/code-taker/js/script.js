/**

Code Taker
Tutorial by: Pippin Barr
Coded by: Chip Limeburner

*/

"use strict";

$(`.secret`).one(`mouseover`, function(event) {
  $(this).addClass(`found`, 500);
  $(this).draggable({
    helper: `clone`
  });
});
