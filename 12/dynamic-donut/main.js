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

// pie scales:
let pie = d3.pie().value(d => d.value)    

let arc = d3.arc()
    .innerRadius(radius - 40)
    .outerRadius(radius)

// background donut:
const background = elementGroup.append('path')
    .datum({endAngle: 2 * Math.PI, startAngle: 0})
    .attr('class', "background")
    .attr('d', arc)

// foreground donut:
const foreground = elementGroup.append('path')
    .datum({endAngle: 2 * Math.PI, startAngle: 0})
    .attr('class', "foreground")
    .attr('d', arc)

// functions:
d3.interval(function() {
    foreground.transition()
        .duration(750)
        .attrTween("d", arcTween(Math.random() * Math.PI * 2));
}, 1500);


function arcTween(newAngle) {

  // The function passed to attrTween is invoked for each selected element when
  // the transition starts, and for each element returns the interpolator to use
  // over the course of transition. This function is thus responsible for
  // determining the starting angle of the transition (which is pulled from the
  // element’s bound datum, d.endAngle), and the ending angle (simply the
  // newAngle argument to the enclosing function).
  return function(d) {

    // To interpolate between the two angles, we use the default d3.interpolate.
    // (Internally, this maps to d3.interpolateNumber, since both of the
    // arguments to d3.interpolate are numbers.) The returned function takes a
    // single argument t and returns a number between the starting angle and the
    // ending angle. When t = 0, it returns d.endAngle; when t = 1, it returns
    // newAngle; and for 0 < t < 1 it returns an angle in-between.
    var interpolate = d3.interpolate(d.endAngle, newAngle);

    // The return value of the attrTween is also a function: the function that
    // we want to run for each tick of the transition. Because we used
    // attrTween("d"), the return value of this last function will be set to the
    // "d" attribute at every tick. (It’s also possible to use transition.tween
    // to run arbitrary code for every tick, say if you want to set multiple
    // attributes from a single function.) The argument t ranges from 0, at the
    // start of the transition, to 1, at the end.
    return function(t) {

      // Calculate the current arc angle based on the transition time, t. Since
      // the t for the transition and the t for the interpolate both range from
      // 0 to 1, we can pass t directly to the interpolator.
      //
      // Note that the interpolated angle is written into the element’s bound
      // data object! This is important: it means that if the transition were
      // interrupted, the data bound to the element would still be consistent
      // with its appearance. Whenever we start a new arc transition, the
      // correct starting angle can be inferred from the data.
      d.endAngle = interpolate(t);

      // Lastly, compute the arc path given the updated data! In effect, this
      // transition uses data-space interpolation: the data is interpolated
      // (that is, the end angle) rather than the path string itself.
      // Interpolating the angles in polar coordinates, rather than the raw path
      // string, produces valid intermediate arcs during the transition.
      return arc(d);
    };
  };
}