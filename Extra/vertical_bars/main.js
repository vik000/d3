const width = 800
const height = 600

const margin = {
    top: 10, 
    bottom: 40,
    left: 40, 
    right: 10
}

const svg = d3.select("#chart").append("svg").attr('id', "svg").attr("width", width).attr("height", height)
const elementGroup = svg.append("g").attr('id', "elementGroup").attr("transform", `translate(${margin.left}, ${margin.top})`)
const axisGroup = svg.append("g").attr('id', "axisGroup")
const xAxisGroup = axisGroup.append("g").attr("id", "xAxisGroup").attr("transform", `translate(${margin.left}, ${height - margin.bottom})`)
const yAxisGroup = axisGroup.append("g").attr("id", "yAxisGroup").attr("transform", `translate(${margin.left}, ${margin.top})`)

let x = d3.scaleBand().range([0, width - margin.left - margin.right]).padding(0.2)
let y = d3.scaleLinear().range([height - margin.top - margin.bottom, 0])
const xAxis = d3.axisBottom().scale(x)
const yAxis = d3.axisLeft().scale(y)

d3.json("data.json").then(data => {
    data = Object.values(data.worldCupWinners)
    console.log(data)

    x.domain(data.map(d => d.country))
    y.domain([0, d3.max(data.map(d => d.titles))])

    xAxisGroup.call(xAxis)
    yAxisGroup.call(yAxis.ticks(5).tickSize(-width))
    yAxisGroup.select('.domain').remove()

    let bars = elementGroup.selectAll('rect').data(data)
    bars.enter().append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.country))
        .attr('y', d => y(d.titles))
        .attr('width', x.bandwidth())
        .attr('height', d => height - y(d.titles) - margin.bottom - margin.top)
})