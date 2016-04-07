var gmajor = ['g3', 'b3', 'd4']
var cminor = ['c4', 'd#4', 'g4']

var pitches = {
  // 'a2': 110.00, 'a#2': 116.54, 'b2': 123.47,
  'c3': 130.81, 'c#3': 138.59, 'd3': 146.83, 'd#3': 155.56, 'e3': 164.81, 'f3': 174.61, 'f#3': 185.00, 'g3': 196.00, 'g#3': 207.65, 'a3': 220.00, 'a#3': 233.08, 'b3': 246.94, 'c4': 261.63, 'c#4': 277.18, 'd4': 293.66, 'd#4': 311.13, 'e4': 329.63, 'f4': 349.23, 'f#4': 369.99, 'g4': 392.00, 'g#4': 415.30, 'a4': 440.00, 'a#4': 466.16, 'b4': 493.88, 'c5': 523.25, 'c#5': 554.37, 'd5': 587.33, 'd#5': 622.25, 'e5': 659.25, 'f5': 698.46, 'f#5': 739.99, 'g5': 783.99, 'g#5': 830.61, 'a5': 880.00, 'a#5': 932.33, 'b5': 987.77, 'c6': 1046.50, 'c#6': 1108.73, 'd6': 1174.66, 'd#6': 1244.51, 'e6': 1318.51, 'f6': 1396.91, 'f#6': 1479.98, 'g6': 1567.98, 'g#6': 1661.22, 'a6': 1760.00, 'a#6': 1864.66, 'b6': 1975.53
}

var pitchList = Object.keys(pitches);

var major = [4, 3, 5];
var minor = [3, 4, 5];

function getArpeggio(note, tonality) {
  var idx = Math.floor(Math.random() * 13);
  var end = pitchList.length - 12 + idx;
  var arpeggio = [];
  var toneIdx = 0;
  while (idx <= end) {
    arpeggio.push(pitchList[idx]);
    idx += tonality[toneIdx];
    if (toneIdx == tonality.length - 1) {
      toneIdx = 0
    } else {
      toneIdx += 1
    }
  }
  return arpeggio;
}