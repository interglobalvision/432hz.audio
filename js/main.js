/* jshint browser: true, devel: true, indent: 2, curly: true, eqeqeq: true, futurehostile: true, latedef: true, undef: true, unused: true */
/* global $, jQuery, document, Modernizr */

function l(data) {
  'use strict';
  console.log(data);
}

$(document).ready(function () {
  'use strict';

});

$(window).load(function () {

  /* PACKERY */
  var pckry = new Packery( document.getElementById("gallery-container"), {
    // options
    itemSelector: '.photo',
    percentPosition: true,
    columnWidth: '.photo',
    gutter: 0
  });

  // Display color overlay
  $('.photo').addClass('color-overlay');

  $('#gallery').animate({
    opacity: 1
  }, 600);
});
