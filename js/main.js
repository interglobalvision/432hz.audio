/* jshint browser: true, devel: true, indent: 2, curly: true, eqeqeq: true, futurehostile: true, latedef: true, undef: true, unused: true */
/* global $, jQuery, document, Modernizr */

function l(data) {
  'use strict';
  console.log(data);
}
CLIENT_ID = '1af5bd17adc32f47529ce064b5e03361';

var four32 = {
  audioContext: '',
  sourceNode: '',
  soundBuffer: null,
  isPlaying: false,
  init: function(urlInputId, playButtonId, tuningSwitchId) {
    l('init');
    var _this = this;

    // Set audio context
    _this.audioContext = new (window.AudioContext || window.webkitAudioContext);

    var playButton = document.getElementById(playButtonId);
    playButton.addEventListener("click", function() {
      
      // Stop if is playing
      if( _this.isPlaying ) {
        _this.stop();
      }
      
      // Create a sound source
      _this.sourceNode = _this.audioContext.createBufferSource();

      // Set playbak rate to pithc down to 443Hz
      _this.sourceNode.playbackRate.value = 0.981818182;


      // Connect source with audio destination
      _this.sourceNode.connect(_this.audioContext.destination);       // connect the source to the context's destination (the speakers)

      // Get track url from input
      var trackUrl = document.getElementById(urlInputId).value;

      // Get track id from Soundcloud
      SC.get('/resolve', { 
        url: trackUrl, 
      }, function(track) {

        // Set stream URL as player source
        var streamUrl = 'http://api.soundcloud.com/tracks/' + track.id + '/stream?client_id=' + CLIENT_ID;

        var request = new XMLHttpRequest();
        request.open('GET', streamUrl, true);
        request.responseType = 'arraybuffer';

        // Decode asynchronously
        // if(this.checked) {
        // } else {
        //
        request.onload = function() {
          _this.audioContext.decodeAudioData(request.response, function(buffer) {
            _this.soundBuffer = buffer;
            _this.sourceNode.buffer = _this.soundBuffer;                    // tell the source which sound to play
            _this.play();
          }, function(err) {
            console.log(err);
          });
        }

        request.send(); 
      });
    });

    var tuningSwitch = document.getElementById(tuningSwitchId);
    tuningSwitch.addEventListener('change', function() {
      if(this.checked) {
        _this.sourceNode.playbackRate.value = 0.981818182;
      } else {
        _this.sourceNode.playbackRate.value = 1;
      }
    });

    // Initialize Soundcloud SDK
    SC.initialize({
      client_id: CLIENT_ID
    });

  },
  play: function() {
    var _this = this;
    
    _this.sourceNode.start(0);  
    _this.isPlaying = true;
  },
  stop: function() {
    var _this = this;

    _this.sourceNode.stop(0);  
    _this.isPlaying = 0;
  }
};

$(document).ready(function () {
  'use strict';
  four32.init('track-url', 'play-button', 'tuning-switch');
});

$(window).load(function () {
});
