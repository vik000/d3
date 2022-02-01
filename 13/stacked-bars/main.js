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

let x = d3.scaleBand().range([0, width - margin.left - margin.right]).padding(0.1)
let xAxis = d3.axisBottom().scale(x)

let y = d3.scaleLinear().range([height - margin.top - margin.bottom, 0])
let yAxis = d3.axisLeft().scale(y)

let data;
let countries = []
d3.csv("data.csv").then(_data => {
    x.domain(_data.map(d => d.Country))
    xAxisGroup.call(xAxis)

    let categories = _data.columns.slice(2,)
    categories.forEach(cat => {
        _data.map(d => {
            d[cat] = +d[cat].replace("%", "")
        })
    });
    let stacker = d3.stack().keys(categories)
    data = stacker(_data)

    y.domain([0, data[data.length - 1][0][1]])
    yAxisGroup.call(yAxis)

    let elements = elementGroup.selectAll("g.blood").data(data)
    elements.enter().call(drawStack)

    console.log(data)
})

function drawStack(group) {
    stack = group.append("g").attr("class", d => `blood ${d.key}`)
    stack.selectAll("rect.bar").data(d => d)
        .enter().append("rect").attr("class", "bar")
            .attr("width", x.bandwidth())
            .attr("height", d => y(d[0]) - y(d[1]))
            .attr("x", d => x(d.data.Country))
            .attr("y", d => y(d[1]))
}