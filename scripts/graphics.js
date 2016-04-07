var width = innerWidth * 0.96;
var height = innerHeight * 0.8;
var radius = 35;

var svg = d3.select('main').append('svg')
  .attr('width', width)
  .attr('height', height);

svg.append('rect')
  .attr('width', width)
  .attr('height', height)

for (var i = 0; i < 8; i++) {
  svg.insert('circle', 'rect')
    .attr('cx', Math.random() * (width - radius))
    .attr('cy', Math.random() * (height - radius))
    .attr('r', radius)
    .attr('class', '3 node')
}