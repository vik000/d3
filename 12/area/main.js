const width = 800
const height = 600
const margin = {
    top: 10, 
    bottom: 40, 
    left: 60, 
    right: 10
}

const svg = d3.select("#chart").append("svg").attr("width", width).attr("height", height)
const elementGroup = svg.append("g").attr("id", "elementGroup").attr("transform", `translate(${margin.left}, ${margin.top})`)

const axisGroup = svg.append("g").attr("id", "axisGroup")
const xAxisGroup = axisGroup.append("g").attr("id", "xAxisGroup").attr("transform", `translate(${margin.left}, ${height - margin.bottom})`)
const yAxisGroup = axisGroup.append("g").attr("id", "yAxisGroup").attr("transform", `translate(${margin.left}, ${margin.top})`)

let x = d3.scaleTime().range([0, width - margin.left - margin.right])
let y = d3.scaleLinear().range([height - margin.top - margin.bottom, 0])
let xAxis = d3.axisBottom().scale(x)
let yAxis = d3.axisLeft().scale(y)

const timeParse = d3.timeParse("%Y")

d3.csv("data.csv").then(data => {
    data.map(d => {
        d.perc = +d.perc
        d.amount = +d.amount
        d.year = timeParse(d.year)
    })

    y.domain([0, d3.max(data.map(d => d.amount))])
    x.domain(d3.extent(data.map(d => d.year)))

    xAxisGroup.call(xAxis)
    yAxisGroup.call(yAxis)

    elementGroup.datum(data)
        .append("path")
            .attr("class", "rodrigo")
            .attr("d", d3.area()
                .x(d => x(d.year))
                .y0(d => y(0))
                .y1(d => y(d.amount))
            )

})