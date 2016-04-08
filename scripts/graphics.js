var width = innerWidth * 0.96;
var height = innerHeight * 0.8;
var radius = 35;
var nodeNum = 12;

var svg = d3.select('main').append('svg')
  .attr('width', width)
  .attr('height', height);

svg.append('rect')
  .attr('width', width)
  .attr('height', height)
  .attr('class', '4');

for (var i = 0; i < nodeNum; i++) {
  var color = getRandomColor();
  svg.append('circle')
    .attr('cx', (Math.random() * (width - radius * 2) + radius))
    .attr('cy', (Math.random() * (height - radius * 2) + radius))
    .attr('r', radius)
    .attr('fill', color)
    .attr('class', '4 node')
    .attr('id', ("node" + i))
}

function newPosition(left, top) {
  var leftPos = parseInt(left, 10);
  var topPos = parseInt(top, 10);
  var newLeft = (Math.random() * 8) + leftPos - 4;
  var newTop = (Math.random() * 8) + topPos - 4;
  if (newLeft > radius && newTop > radius) {
    return [newLeft, newTop];
  } else {
    return [leftPos, topPos];
  }
}

function moveNodes() {
  var duration = 200;
  d3.selectAll('.node').each(function(d,i) {
    var node = d3.select(this);
    var left = node.attr('cx');
    var top = node.attr('cy');
    var newPos = newPosition(left, top);
    var color = node.style('fill');
    var newColor = changeColor(color, (Math.floor(Math.random() * 24 + .5) - 12));
      node.transition()
      .attr('cx', newPos[0])
      .attr('cy', newPos[1])
      .ease('linear')
      .style('fill', newColor)
      .duration(duration);
  })
  setTimeout(function() { moveNodes(); }, duration)
}

function getRandomColor() {
  var hexVals = '0123456789ABCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++) {
      color += hexVals[Math.floor(Math.random() * 16)];
  }
  return color;
}

function changeColor(color, change) {
  var newColor = ['rgb('];
  var changer = color.match(/([0-9]+)/g);
  changer.forEach(function(string, idx) {
    var num = parseInt(string, 10);
    if (num >= 20 || num <= 235) {
      num += change;
      newColor.push(num.toString());
      if (idx < 2) {
        newColor.push(', ');
      } else {
        newColor.push(')');
      }
    }
  })
  return newColor.join('');
}

moveNodes();