$(document).ready(function(){

  // unlock audio events for iOS
  if ( /iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    isUnlocked = false;
    $('#unlock').css('display', 'inline-block');
    $('#unlock').on('touchend', unlockIos);
  } else {
    isUnlocked = true;
  }

  $('.node').click(playChord);
  $('#bright-buttons button').click(adjustBrightness);

})

function getLevel() {
  var current = $('circle').attr('class');
  var currentLevel = parseInt(current, 10);
  console.log(currentLevel);
  return currentLevel;
}

function playChord() {
  console.log(isUnlocked);
  var node = $(this).attr('id');
  flash(node);

  var tonality = setTonality(getLevel());
  console.log("tonality " + tonality);
  $('#tonality').html('tonality: ' + tonality);
  var chord = getChord(tonality);
  var displayChord = chord.map(function(pitch){
    return ' ' + pitch;
  })
  console.log("chord " + displayChord);
  $('#chord').html('chord: ' + displayChord);
  chord.forEach(function(note) {
    var voice = new Voice(pitches[note]);
    voice.start();

    setTimeout(function() {
      voice.stop()
    }, 3000);
  })
}

function unlockIos() {
  var buffer = context.createBuffer(1, 1, 22050);
  var source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(context.destination);

  source.start(0);
  // isUnlocked = true;
  $('#unlock').css('display', 'none');

  setTimeout(function() {
    if((source.playbackState === source.PLAYING_STATE || source.playbackState === source.FINISHED_STATE)) {
      isUnlocked = true;
    }
    console.log("unlocked: " + isUnlocked);
  }, 300);
}


// initialize context
try {
  window.AudioContext = window.AudioContext||window.webkitAudioContext;
  var context = new AudioContext();
}
catch(e) {
  alert('Web Audio API is not supported in this browser');
}


// VCO factory
var VCO = (function(context) {
  function VCO(frequency){
    this.oscillator = context.createOscillator();
    this.oscillator.type = 'sine';
    this.setFrequency(frequency);

    this.input = this.oscillator;
    this.output = this.oscillator;
  };

  VCO.prototype.setFrequency = function(frequency) {
    this.oscillator.frequency.setValueAtTime(frequency, context.currentTime);
  };

  VCO.prototype.connect = function(node) {
    if (node.hasOwnProperty('input')) {
      this.output.connect(node.input);
    } else {
      this.output.connect(node);
    };
  }

  return VCO;
})(context);


// Envelope factory
var Envelope = (function(context) {
  function Envelope() {
    this.attackTime = 1;
    this.releaseTime = 1.8;
  };

  Envelope.prototype.connect = function(amp) {
    this.amp = amp;
  };

  Envelope.prototype.trigger = function() {
    now = context.currentTime;
    this.amp.cancelScheduledValues(now);
    this.amp.setValueAtTime(0, now);
    this.amp.linearRampToValueAtTime(0.1, now + this.attackTime);
    this.amp.linearRampToValueAtTime(0, now + this.attackTime + this.releaseTime);
  };

  return Envelope;
})(context);


// VCA factory
var VCA = (function(context) {
  function VCA() {
    this.gain = context.createGain();
    this.gain.gain.value = 0;
    this.input = this.gain;
    this.output = this.gain;
    this.amplitude = this.gain.gain;
  };

  VCA.prototype.connect = function(node) {
    if (node.hasOwnProperty('input')) {
      this.output.connect(node.input);
    } else {
      this.output.connect(node);
    };
  }

  return VCA;
})(context);


var Voice = (function(context) {
  function Voice(frequency){
    this.frequency = frequency;
    this.oscillators = [];
  };

  Voice.prototype.start = function() {
    // create nodes
    var vco = new VCO(this.frequency);
    var vca = new VCA;
    var envelope = new Envelope;

    // connections
    vco.connect(vca);
    envelope.connect(vca.amplitude);
    vca.connect(context.destination);

    vco.oscillator.start(0);
    envelope.trigger();

    this.oscillators.push(vco);

  };

  Voice.prototype.stop = function() {
    this.oscillators.forEach(function(component) {
      component.oscillator.stop();
    });
  };

  return Voice;
})(context);

