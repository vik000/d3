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
    .startAngle(-0.5 * Math.PI)
    .endAngle(0.5 * Math.PI)

let arc = d3.arc()
    .innerRadius(radius - 40)
    .outerRadius(radius)

let data;
d3.json('data.json').then(_data => {
    // data transform
    data = pie(d3.entries(_data))

    // data binding:
    let sector = elementGroup.selectAll('.sector').data(data)

    sector.enter()
        .append('g').call(drawSlices)
})

// functions
function drawSlices(group) {
    group.attr('class', 'sector')
        .append('path')
            .attr('class', d => d.data.key)
            .attr('d', arc)
            .on('click', isolate)
    group.append('text')
        .attr('transform', d =>`translate(${arc.centroid(d)})`)
        .text(d => d.data.key)
}

function update(group) {
    group.select('path')
        .transtion()
        .duration(750)
        .attrTween('d', arcTween(arc))
    group.select('text')
        .attr('transform', d =>`translate(${arc.centroid(d)})`)
        .text(d => d.data.key)
}

function arcTween(newAngle) {
    return function(d) {
      var interpolate = d3.interpolate(d.endAngle, newAngle);
      return function(t) {
        d.endAngle = interpolate(t);
        return arc(d);
      };
    };
}

function isolate(d, i, a) {
    // 1. modify data:
    newData = pie([d.data])
    // 2. update arc:
    let sector = elementGroup.selectAll(".sector")
    sector.each((d, i, a) => {
        // d3.select(a[i]).call(update)
        return d
    });
}