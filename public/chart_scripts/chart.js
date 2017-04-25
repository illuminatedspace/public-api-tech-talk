function chart (div, file) {

//this donut chart was created with help from the following tutorial:
//D3.js Step by Step from Zero
//http://zeroviscosity.com/d3-js-step-by-step/step-0-intro

//~~~~~~~~~~~~~~~~~~DATA SET
/*let congressperson = {
  'id': 'S001141',
  'name': 'Jeff Sessions',
  'party': 'R',
  'state': 'AL',
  'total_votes': '60',
  'missed_votes': '39',
  'missed_votes_pct': '65.00',
  'rank': '1',
  'notes': 'Resigned on Feb. 8, 2017 to become Attorney General.'
}*/

/*let dataset = [
  { label: 'Missed Votes', count: congressperson.missed_votes },
  { label: 'Present Votes', count: congressperson.total_votes - congressperson.missed_votes }
];*/


//~~~~~~~~~~~~~~~~~~VARIABLES

  let width = 360;
  let height = 360;
  let donutHole = 75;

  //make the raidus the smaller of the the width and height divided by 2
  let radius = Math.min(width, height) / 2;

  //use a built in color palette from d3
  let color = d3.scaleOrdinal(d3.schemeCategory20b);

  //size of colored squares in legend
  let legendRectSize = 25;
  let legendSpacing = 4;


  //~~~~~~~~~~~~~~~~~~DONUT CHART
  //makes the svg chart

  //*refactor: can I export this as a function?

  //grab the element with the id chart
  let svg = d3.select(`#${div}`)
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
  let arc = d3.arc()
    .innerRadius(radius - donutHole)
    .outerRadius(radius);

  //define the start and end angle of each segment
  let pie = d3.pie()
    .value(function(d) { return d.count; })
    .sort(null);

  // //gets the chart data from the chart_data directory
  d3.json(`/chart_data/${file}.json`, function(error, dataset) {
    console.log(dataset);
    if (error) {
      console.error(error);
    }
    dataset.forEach(function(d) {
      d.count = +d.count;
    });

    //draws the chart
    let path = svg.selectAll('path')
      .data(pie(dataset))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', function(d, i) {
        return color(d.data.label);
      });


    //~~~~~~~~~~~~~~~~~~LEGEND IN DONUT HOLE SPACE

    //selects legend class
    let legend = svg.selectAll('.legend')
      //call data with an array of lables defined from the data set
      //color(d.data.label) created the array
      .data(color.domain())
      //creates placeholders
      .enter()
      //replace placeholders with g elements
      .append('g')
      //give each g the class 'legend'
      .attr('class', 'legend')
      //centers the legend, i is the index of the current data element, provide by D3
      .attr('transform', function(d, i) {
        //height of colored square + spacing
        let height = legendRectSize + legendSpacing;
        //vertical offset of entire legend, height of one element plus half total number of elements
        let offset =  height * color.domain().length / 2;
        //horizontal position of the left edge
        let horz = -2 * legendRectSize;
        //vertical position of the top edge
        let vert = i * height - offset;
        return 'translate(' + horz + ',' + vert + ')';
      });

    //adds the colored square
    legend.append('rect')
      .attr('width', legendRectSize)
      .attr('height', legendRectSize)
      .style('fill', color)
      .style('stroke', color);

    //adds the text
    legend.append('text')
      .attr('x', legendRectSize + legendSpacing)
      .attr('y', legendRectSize - legendSpacing)
      .text(function(d) { return d; });

  });


}

module.exports = chart;
