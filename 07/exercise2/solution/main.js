const width = 1000;
const height = 600;
const margin = {
    left: 60,
    bottom: 40,
    top: 10,
    right: 10,
};

let svg = d3.select("#chart").append("svg");
svg.attr('width', width);
svg.attr('height', height);

let chart = svg.append('g').attr('id', 'chart');

let axisGroup = svg.append('g').attr('id', 'axisGroup');
let xAxisGroup = axisGroup.append('g').attr('id', 'xAxisGroups').attr('transform', `translate(${0}, ${height - margin.bottom})`);
let yAxisGroup = axisGroup.append('g').attr('id', 'yAxisGroups').attr('transform', `translate(${margin.left}, ${margin.top})`);

let xScale = d3.scaleLinear().range([margin.left, width - margin.right - margin.left]); // population
let yScale = d3.scaleLinear().range([height - margin.top - margin.bottom, margin.top]); // gdp

let xAxis = d3.axisBottom();
let yAxis = d3.axisLeft();

d3.json('data.json').then(data=>{
    data = data.data;
    // finish scales:
    xScale.domain(d3.extent(data.map(d=>d.population)));
    yScale.domain(d3.extent(data.map(d=>d.gdp)));

    data.forEach(d => {
        plotCountry(d);
    });

    // plot axes:
    xAxis.scale(xScale);
    yAxis.scale(yScale);
    xAxisGroup.call(xAxis);
    yAxisGroup.call(yAxis);
});


function plotCountry(d) {
    let country = chart.append('g')
        .attr('id', `${d.country}`)
        .attr('class', 'contry')
        .attr('transform', `translate(${xScale(d.population)}, ${yScale(d.gdp)})`);
    drawCircle(country, d);
    drawLabel(country, d);
}

function drawCircle(group, d){
    group.append('circle')
        .attr('class', `countryCircle ${d.continent}`)
        .attr('r', 10)
}

function drawLabel(group, d){
    group.append('text').text(d.country)
        .attr('class', 'label')
        .attr('x', 10)
        .attr('y', 5)
}