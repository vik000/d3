const width = 600
const height = 400
const margin = {
    top: 10, 
    bottom: 40,
    left: 60, 
    right: 10
}

const svg = d3.select("#chart").append("svg").attr("id", "svg")
    .attr("width", width)
    .attr("height", height)
let elementGroup = svg.append("g").attr("id", "elementGroup").attr("transform", `translate(${margin.left}, ${margin.top})`)
let axisGroup = svg.append("g").attr("id", "axisGroup")
let xAxisGroup = axisGroup.append("g", "xAxisGroup").attr("transform", `translate(${margin.left}, ${height - margin.bottom})`)
let yAxisGroup = axisGroup.append("g", "yAxisGroup").attr("transform", `translate(${margin.left}, ${margin.top})`)

let x = d3.scaleLinear().range([0, width - margin.left - margin.right])
let y = d3.scaleLinear().range([height - margin.top - margin.bottom, 0])

let xAxis = d3.axisBottom().scale(x)
let yAxis = d3.axisLeft().scale(y)

d3.csv("data.csv").then(data => {
    data.map(d => {
        d.Age = +d.Age
        d.Population = +d.Population
    })

    x.domain(d3.extent(data.map(d => d.Age)))
    xAxisGroup.call(xAxis)

    // histogram:
    let histogram = d3.histogram() // this has been replaced for d3.bin in version 7+
        .value(d => d.Age)   // I need to give the vector of value
        .domain(x.domain())  // then the domain of the graphic
        .thresholds(x.ticks(100)); // then the numbers of bins

    let bins = histogram(data)
    // ----------

    y.domain([0, d3.max(data, d => d.Population)])
    yAxisGroup.call(yAxis)

    let bars = elementGroup.selectAll('rect').data(bins)

    bars.enter().append("rect")
        .attr('fill', "steelblue")
        .attr("x", d => x(d[0].Age))
        .attr("y", d => y(d[0].Population))
        .attr("height", d => height - y(d[0].Population) - margin.top - margin.bottom)
        .attr("width", d => x(d.x1) - x(d.x0))
})



