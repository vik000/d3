// const
const width = 800
const height = 600
const margin = {
    top: 10, 
    bottom: 20,
    left: 40, 
    right: 40
}

// svg
const svg = d3.select("#chart").append('svg')
    .attr("id", "svg")
    .attr("width", width)
    .attr("height", height)

let elementGroup = svg.append("g").attr("id", "elementGroup")
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

let axisGroup = svg.append("g").attr("id", "axisGroup")
let xAxisGroup = axisGroup.append("g").attr("id", "xAxisGroup")
    .attr('transform', `translate(${margin.left}, ${height - margin.bottom})`)
let yAxisGroup = axisGroup.append("g").attr("id", "yAxisGroup")
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

let x = d3.scaleLinear().range([0, width - margin.right - margin.left])
let y = d3.scaleLinear().range([height - margin.bottom - margin.top, 0])

let xAxis = d3.axisBottom().scale(x)
let yAxis = d3.axisLeft().scale(y)

d3.csv("data.csv").then(data => {
    data.map(d => {
        d.year = +d.year
        d.prop = +d.prop
        d.n = +d.n
    })
    
    // scale domain:
    x.domain(d3.extent(data.map(d => d.year)))
    y.domain(d3.extent(data.map(d => d.n)))

    // call axes
    xAxisGroup.call(xAxis)
    yAxisGroup.call(yAxis)
    
    
    let Helen = data.filter(d => d.name == "Helen")
    // console.log(Helen);

    // datum!
    elementGroup.datum(Helen).append('path')
        .attr("id", "Helen")
        .attr("d", d3.line()
            .x(d => x(d.year))
            .y(d => y(d.n))
        )
})

