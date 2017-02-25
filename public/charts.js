//this donut chart was created with help from the following tutorial:
//D3.js Step by Step from Zero Viscosity
//http://zeroviscosity.com/d3-js-step-by-step/step-0-intro

let congressperson = {
  'id': 'S001141',
  'name': 'Jeff Sessions',
  'party': 'R',
  'state': 'AL',
  'total_votes': '60',
  'missed_votes': '39',
  'missed_votes_pct': '65.00',
  'rank': '1',
  'notes': 'Resigned on Feb. 8, 2017 to become Attorney General.'
}

let dataset = [
  { label: 'missed', count: congressperson.missed_votes },
  { label: 'present', count: congressperson.total_votes - congressperson.missed_votes }
];

var width = 360;
var height = 360;
var donutHole = 75;

//make the raidus the smaller of the the width and height divided by 2
var radius = Math.min(width, height) / 2;

//use a built in color palette from d3
var color = d3.scaleOrdinal(d3.schemeCategory20b);

//makes the svg chart
//grab the element with the id chart
var svg = d3.select('#chart')
  //append an svg element to the chart element
  .append('svg')

  //define the width of the svg element
  .attr('width', width)

  //define the height of the svg element
  .attr('height', height)

  //append a g element to the svg element
  .append('g')

  //center the g element in the svg element
  .attr('transform', 'translate(' + (width / 2) +  ',' + (height / 2) + ')');

//defines the raidus(size)
var arc = d3.arc()
  .innerRadius(radius - donutHole)
  .outerRadius(radius);

//define the start and end angle of each segment
var pie = d3.pie()
  .value(function(d) { return d.count; })
  .sort(null);

//draws the chart
var path = svg.selectAll('path')
  .data(pie(dataset))
  .enter()
  .append('path')
  .attr('d', arc)
  .attr('fill', function(d, i) {
    return color(d.data.label);
  });
