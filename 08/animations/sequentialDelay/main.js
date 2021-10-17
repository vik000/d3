const width = 800;
const height = 300;
const margins = 40;

let svg = d3.select('#chart').append('svg').attr('id', 'svg');
svg.attr('width', width);
svg.attr('height', height);
let elementGroup = svg.append('g').attr('id', 'elementGroup')

let distance = d3.scaleLinear().range([0 + margins, width - margins]);
const axis = d3.axisBottom().scale(distance);


let drawLocation = function(group) {
    group.attr('class', 'location')
    group.append('circle')
        .attr('cx', d => distance(d.distance))
        .attr('r', 10)
        .attr('cy', 400)
        .transition()
        .duration(1000)
        .delay((d, i) => i * 600)
        .attr('cy', 100)
}

d3.json('data.json').then(d=>{
    let vals = d.data.map(d=>d.distance);
    distance.domain(d3.extent(vals));

    let xAxis = svg.append('g').attr('id', 'axis').call(axis);
    xAxis.attr('transform', `translate(0, 180)`);

    elementGroup.selectAll('g.location').data(d.data).enter()
        .append('g').call(drawLocation)
});