const barHeight = 25;
const height = 600
const width = 800
const margin = {top: 30, right: 0, bottom: 10, left: 30}

const svg = d3.select("#chart").append('svg')
    .attr("height", height).attr('width', width);

let axisGroup = svg.append('g').attr('class', 'axisGroup')
let elements = svg.append('g').attr('class', 'elements')

d3.csv('data.csv').then(data=>{
    console.log(data);

    elements.selectAll('.bars').data(data).enter()
        .append('rect')
        .attr('class', 'bars')
        .attr('width', d => d.frequency * 10000)
        .attr('height', 10)
        .attr('x', 0)
        .attr('y', (d, i) => i * 12)



})

