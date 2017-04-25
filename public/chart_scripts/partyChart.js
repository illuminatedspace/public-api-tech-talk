//this donut chart was created with help from the following tutorial:
//D3.js Step by Step from Zero Viscosity
//http://zeroviscosity.com/d3-js-step-by-step/step-0-intro

//~~~~~~~~~~~~~~~~~~VARIABLES
let width2 = 360;
let height2 = 360;
let donutHole2 = 75;

//make the raidus the smaller of the the width2 and height divided by 2
let radius2 = Math.min(width2, height2) / 2;

//use a built in color palette from d3
let color2 = d3.scaleOrdinal(d3.schemeCategory20b);

//size of colored squares in legend
let legendRectSize2 = 25;
let legendSpacing2 = 4;

//~~~~~~~~~~~~~~~~~~DONUT CHART
//makes the svg chart

//*refactor: can I export this as a function?
//grab the element with the id chart
let svg2 = d3.select('#party-chart')
  //append an svg element to the chart element
  .append('svg')

  //define the width2 of the svg element
  .attr('width', width2)

  //define the height of the svg element
  .attr('height', height2)

  //append a g element to the svg element
  .append('g')

  //center the g element in the svg element
  .attr('transform', 'translate(' + (width2 / 2) +  ',' + (height2 / 2) + ')');

//defines the raidus(size)
let arc2 = d3.arc()
  .innerRadius(radius2 - donutHole2)
  .outerRadius(radius2);

//define the start and end angle of each segment
let pie2 = d3.pie()
  .value(function(d) { return d.count; })
  .sort(null);

//gets the chart data from the chart_data directory
d3.json('/chart_data/currentParty.json', function(error, dataset) {
  // console.log(dataset);
  dataset.forEach(function(d) {
    d.count = +d.count;
  });

//draws the chart
let path2 = svg2.selectAll('path')
  .data(pie2(dataset))
  .enter()
  .append('path')
  .attr('d', arc2)
  .attr('fill', function(d, i) {
    return color2(d.data.label);
  });


//~~~~~~~~~~~~~~~~~~LEGEND IN DONUT HOLE SPACE

//selects legend class
let legend2 = svg2.selectAll('.legend')
  //call data with an array of lables defined from the data set
  //color(d.data.label) created the array
  .data(color2.domain())
  //creates placeholders
  .enter()
  //replace placeholders with g elements
  .append('g')
  //give each g the class 'legend'
  .attr('class', 'legend')
  //centers the legend, i is the index of the current data element, provide by D3
  .attr('transform', function(d, i) {
    //height of colored square + spacing
    let height2 = legendRectSize2 + legendSpacing2;
    //vertical offset of entire legend, height of one element plus half total number of elements
    let offset =  height2 * color2.domain().length / 2;
    //horizontal position of the left edge
    let horz = -2 * legendRectSize2;
    //vertical position of the top edge
    let vert = i * height2 - offset;
    return 'translate(' + horz + ',' + vert + ')';
  });

//adds the colored square
legend2.append('rect')
  .attr('width', legendRectSize2)
  .attr('height', legendRectSize2)
  .style('fill', color2)
  .style('stroke', color2);

//adds the text
legend2.append('text')
  .attr('x', legendRectSize2 + legendSpacing2)
  .attr('y', legendRectSize2 - legendSpacing2)
  .text(function(d) { return d; });

});
