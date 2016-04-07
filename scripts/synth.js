$(document).ready(function(){
  console.log("jQuery'd");

  $('#node1').click(startMajor);
  $('#node2').click(startMinor);
  $('#brighter').click(brighten);
  $('#darker').click(darken);

})


active_voices = {};

function startMajor() {
  gmajor.forEach(function(note) {
    var voice = new Voice(pitches[note]);
    active_voices[note] = voice;
    voice.start();
    setTimeout(function() {stop()}, 6000);
  })
}

function startMinor() {
  cminor.forEach(function(note) {
    var voice = new Voice(pitches[note]);
    active_voices[note] = voice;
    voice.start();
    setTimeout(function() {stop()}, 6000);
  })
}

function stop() {
  for (var note in active_voices) {
    active_voices[note].stop();
    delete active_voices[note];
  }
}

function brighten() {
  var current = $('div').attr('class');
  if (current <= 90) {
    var newClass = parseInt(current, 10) + 10;
    $('div').attr('class', newClass);
  }
}

function darken() {
  var current = $('div').attr('class');
  if (current >= 10) {
    var newClass = parseInt(current, 10) - 10;
    $('div').attr('class', newClass);
  }
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
    this.releaseTime = 1;
  };

  Envelope.prototype.connect = function(amp) {
    this.amp = amp;
  };

  Envelope.prototype.trigger = function() {
    now = context.currentTime;
    this.amp.cancelScheduledValues(now);
    this.amp.setValueAtTime(0, now);
    this.amp.linearRampToValueAtTime(1, now + this.attackTime);
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
    var vca = new VCA
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

