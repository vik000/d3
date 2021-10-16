const width = 800;
const height = 300;
const margins = 40;

let svg = d3.select('#chart').append('svg').attr('id', 'svg');
svg.attr('width', width);
svg.attr('height', height);

let distance = d3.scaleLinear().range([0 + margins, width - margins]);
const axis = d3.axisBottom().scale(distance);


let drawLocation = function(x) {
    let spot = svg.append('circle')
    .attr('cx', x)
    .attr('r', 10)
    .attr('cy', 400)
    .transition()
    .duration(1000)
    .attr('cy', 100)
}



let drawLabel = function(x, text) {
    let label = svg.append('text').text(text).attr('text-anchor', 'start');
    label.attr('transform', `translate(${x}, 120) rotate(45)`);
} 

d3.json('data.json').then(d=>{
    let vals = d.data.map(d=>d.distance);
    distance.domain(d3.extent(vals));

    let xAxis = svg.append('g').attr('id', 'axis').call(axis);
    xAxis.attr('transform', `translate(0, 180)`);

    d.data.forEach(city => {
        drawLocation(distance(city.distance));
        drawLabel(distance(city.distance), city.city);
    });
});