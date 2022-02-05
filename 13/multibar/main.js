const width = 700;
const height = 500;
const margin = {
    top: 10, 
    bottom: 40, 
    left: 40, 
    right: 10
}

const svg = d3.select("#chart").append("svg").attr("width", width).attr("height", height)
const elementGroup = svg.append("g").attr("id", "elementGroup").attr("transform", `translate(${margin.left}, ${margin.top})`)
const axisGroup = svg.append("g").attr("id", "axisGroup")
const xAxisGroup = axisGroup.append("g").attr("id", "xAxisGroup").attr("transform", `translate(${margin.left}, ${height - margin.bottom})`)
const yAxisGroup = axisGroup.append("g").attr("id", "yAxisGroup").attr("transform", `translate(${margin.left}, ${margin.top})`)

let x0 = d3.scaleBand().range([0, width - margin.left - margin.right]).padding(0.1)
let x1 = d3.scaleBand()
let y = d3.scaleLinear().range([height - margin.top - margin.bottom, 0])

let xAxis = d3.axisBottom().scale(x0)
let yAxis = d3.axisLeft().scale(y)


d3.csv("data.csv").then(data => {
    data.map(d => {
        d.field1 = +d.field1
        d.field2 = +d.field2
        d.field3 = +d.field3
    })

    x0.domain(data.map(d => d.name))
    x1.domain(data.columns.slice(1)).range([0, x0.bandwidth()])
    y.domain([0, d3.max(data.map(d => d3.max([+d.field1, +d.field2, +d.field3])))])

    xAxisGroup.call(xAxis)
    yAxisGroup.call(yAxis)

    let elements = elementGroup.selectAll("g.barGroup").data(data)
    elements.enter().call(drawBars)
    // console.log(data)
})

function drawBars(group) {
    let g = group.append("g").attr("class", d => `${d.name} barGroup`)
        .attr("transform", d => `translate(${x0(d.name)}, ${0})`)

    bar = g.selectAll("rect.bar").data(d => d3.entries(d).slice(1))
    bar.enter().append("rect").attr("class", d => `bar ${d.key}`)
        .attr("x", d => x1(d.key))
        .attr("width", x1.bandwidth())
        .attr("height", d => height - margin.top - margin.bottom - y(d.value))
        .attr("y", d => y(d.value))
}