const height = 600
const width = 800
const margin = {
    left: 40, 
    bottom: 40, 
    top: 10, 
    right: 10 
}
const svg = d3.select("#chart").append("svg").attr("height", height).attr("width", width)
const elementGroup = svg.append("g").attr("id", "elementGroup").attr("transform", `translate(${margin.left}, ${margin.top})`)
const axisGroup = svg.append("g").attr("id", "axisGroup")
const xAxisGroup = axisGroup.append("g").attr("id", "xAxisGroup").attr("transform", `translate(${margin.left}, ${height - margin.bottom})`)
const yAxisGroup = axisGroup.append("g").attr("id", "yAxisGroup").attr("transform", `translate(${margin.left}, ${margin.top})`)

const x = d3.scaleTime().range([0, width - margin.left - margin.right])
const y = d3.scaleLinear().range([height - margin.top - margin.bottom, 0])
const xAxis = d3.axisBottom().scale(x)
const yAxis = d3.axisLeft().scale(y)

const parse = d3.timeParse("%H:%M")
let data
let line = d3.line()
let path
let circles

d3.tsv("data.tsv").then(_data => {
    data = _data
    data.map(d => {
        d.price = +d.price
        d.increase = +d.increase
        d.time = parse(d.time)
    })
    draw(data)
})

function draw(data) {
    x.domain(d3.extent(data.map(d => d.time)))
    y.domain(d3.extent(data.map(d => d.price)))
    xAxisGroup.call(xAxis)
    yAxisGroup.call(yAxis)

    line.x(d => x(d.time)).y(d => y(d.price))
    path = elementGroup.datum(data).append("path").attr('d', line)
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .attr("fill", "transparent")
    circles = elementGroup.selectAll('circle').data(data).enter().append("circle")
        .attr("r", 2)
        .attr("cx", d => x(d.time))
        .attr("cy", d => y(d.price))
    elementGroup.selectAll('line').data(data).enter().append("line")
        .attr("x1", 0)
        .attr("x2", x.range()[1])
        .attr("y1", d => y(d.price))
        .attr("y2", d => y(d.price))
        .attr('stroke-dasharray', '2 2')
        .attr('stroke-width', 1)
        .attr('stroke', "lightgray")
}

d3.select("#filter").on('click', () => {
    if (d3.select("#filter").attr('data') == 'full') {
        x.domain([new Date(x.domain()[1].setMinutes(x.domain()[1].getMinutes() - 8)), x.domain()[1]])
        xAxisGroup.call(xAxis)
        path.attr("d", line)
        circles.attr("cx", d => x(d.time))
        d3.select("#filter").attr('data', 'end')
        d3.select("#filter").text('full day')
    } else {
        x.domain(d3.extent(data.map(d => d.time)))
        xAxisGroup.call(xAxis)
        path.attr("d", line)
        circles.attr("cx", d => x(d.time))
        d3.select("#filter").text('last 5 mins')
        d3.select("#filter").attr('data', 'full')
    }
})