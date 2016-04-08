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
    .attr('cx', Math.random() * (width - radius))
    .attr('cy', Math.random() * (height - radius))
    .attr('r', radius)
    .attr('fill', color)
    .attr('class', '4 node')
    .attr('id', ("node" + i))
}

function newPosition() {
  var newLeft = Math.random() * (width - radius);
  var newTop = Math.random() * (height - radius);
  return [newLeft, newTop];
}

function moveNodes() {
  d3.selectAll('.node').each(function(d,i) {
    var newPos = newPosition();
    var duration = Math.floor(Math.random() * (30000 - 10000) + 10000);
    var color = getRandomColor();
    var node = d3.select(this);
      node.transition()
      .attr("cx", newPos[0])
      .attr("cy", newPos[1])
      .style("fill", color)
      .duration(duration);
  })
  // moveNodes();
}

function getRandomColor() {
  var hexVals = '0123456789ABCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++) {
      color += hexVals[Math.floor(Math.random() * 16)];
  }
  return color;
}

moveNodes();