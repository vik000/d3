// constants:
const width = 450
const height = 450
const margin = 20
const radius = (width - (2 * margin)) / 2

// define SVG
const svg = d3.select("#chart").append('svg').attr('id', 'svg')
    .attr("width", width).attr("height", height)

const elementGroup = svg.append('g').attr('id', "elementGroup")
    .attr('transform', `translate(${width/2}, ${height/2})`)

// arc
let arc = d3.arc()
    .innerRadius(radius - 40)
    .outerRadius(radius)

// background donut:
const background = elementGroup.append('path')
    .datum({endAngle: Math.PI / 2, startAngle: -Math.PI / 2})
    .attr('class', "background")
    .attr('d', arc)

// foreground donut:
const foreground = elementGroup.append('path')
    .datum({endAngle: -Math.PI / 2, startAngle: -Math.PI/2})
    // .datum({endAngle: Math.PI / 2, startAngle: 0})
    // .datum({endAngle: Math.PI / 2, startAngle: -Math.PI / 2})
    .attr('class', "foreground")
    .attr('d', arc)

// functions:
d3.interval(function() {
    var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
    foreground.transition()
        .duration(750)
        .attrTween("d", arcTween(plusOrMinus * Math.random() * (Math.PI / 2)));
}, 1500);


function arcTween(newAngle) {
  return function(d) {
    var interpolate = d3.interpolate(d.endAngle, newAngle);
    return function(t) {
      d.endAngle = interpolate(t);
      return arc(d);
    };
  };
}