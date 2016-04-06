$(document).ready(function(){
  console.log("jQuery'd");

  $('#node1').click(start);
  $('#node2').click(stop);

})

// initialize context
try {
  window.AudioContext = window.AudioContext||window.webkitAudioContext;
  var context = new AudioContext();
}
catch(e) {
  alert('Web Audio API is not supported in this browser');
}

// new oscillator and amplifier
context = new AudioContext();
oscillator = context.createOscillator();
oscillator.frequency.value = 440;
oscillator.start(0);

vca = context.createGain();
vca.gain.value = 0;

// connections
oscillator.connect(vca);
vca.connect(context.destination);


function start() {
  vca.gain.value = 1;
}

function stop() {
  vca.gain.value = 0;
}