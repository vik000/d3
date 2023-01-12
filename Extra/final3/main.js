// consts:
const width = 800
const height = 500
const margin = {
    top: 10,
    right: 10,
    left: 60,
    bottom: 10,
}

// groups:
const svg = d3.select("#chart").append("svg").attr("id", "svg").attr("width", width).attr("height", height)
const elementGroup = svg.append("g").attr("class", "elementGroup")
const axisGroup = svg.append("g").attr("class", "axisGroup")
const xAxisGroup = axisGroup.append("g").attr("class", "xAxisGroup").attr("transform", `translate(${margin.left}, ${height - margin.bottom - margin.top})`)
const yAxisGroup = axisGroup.append("g").attr("class", "yAxisGroup").attr("transform", `translate(${margin.left}, ${0})`)

// scales & axes:
let x = d3.scaleLinear().range([0, width - margin.left - margin.right])
let y = d3.scaleBand().range([height - margin.top - margin.bottom, 0]).padding(0.1)

const xAxis = d3.axisBottom().scale(x).ticks(5)
const yAxis = d3.axisLeft().scale(y)

let years;
let winners;
let originalData;

// data:
d3.csv("data.csv").then(data => {
    data.map(d => {
        d.year = +d.year
    })
    data = data.filter(d => d.winner != "")

    originalData = data
    years = data.map(d => +d.year)
    winners = d3.nest()
        .key(d => d.winner)
        .entries(data)

    x.domain([0, d3.max(winners.map(d => d.values.length))])
    y.domain(winners.map(d => d.key))

    xAxisGroup.call(xAxis)
    yAxisGroup.call(yAxis)

    // update:
    update(winners)
    slider()
})

// update:
function update(data) {
    // identify top value:
    let max = d3.max(data.map(d => d.values.length))
    let elements = elementGroup.selectAll("rect").data(data)
    
    elements.enter()
        .append("rect")
            .attr("class", d => d.values.length == max ? "bar max" : "bar")
            .attr("height", y.bandwidth())
            .attr("x", margin.left)
            .attr("y", d => y(d.key))
            .transition()
                .duration(300)
            .attr("width", d => x(d.values.length))


    elements
    .attr("class", d => d.values.length == max ? "bar max" : "bar")
    .attr("height", y.bandwidth())
    .attr("x", margin.left)
    .attr("y", d => y(d.key))
    .transition()
        .duration(300)
    .attr("width", d => x(d.values.length))


    elements.exit()
        .transition()
            .duration(100)
        .attr("width", 0)
}

// treat data:
function filterDataByYear(year) {
    let updatedData = originalData.filter(d => d.year <= year)
    updatedData = d3.nest()
        .key(d => d.winner)
        .entries(updatedData)

    return updatedData
}


// slider:
function slider() {    
    var sliderTime = d3
        .sliderBottom()
        .min(d3.min(years))
        .max(d3.max(years))
        .step(4)
        .width(580)
        .ticks(years.length)
        .default(years[years.length -1])
        .on('onchange', val => {
            d3.select('p#value-time').text(val);
            update(filterDataByYear(val))
        });

        var gTime = d3
        .select('div#slider-time')
        .append('svg')
        .attr('width', width * 0.8)
        .attr('height', 100)
        .append('g')
        .attr('transform', 'translate(30,30)');

        gTime.call(sliderTime);

        d3.select('p#value-time').text(sliderTime.value());
}




