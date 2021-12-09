const width = 800
const height = 600
const margin = {
    top: 10,
    right: 10,
    bottom: 40,
    left: 70
}

const svg = d3.select("#chart")
    .append("svg")
        .attr("id", "svg")
        .attr("width", width)
        .attr("height", height)

const elementGroup = svg.append("g")
    .attr("id", "elementGroup")
    .attr('transform', `translate(${0}, ${margin.top})`)
const axisGroup = svg.append("g")
    .attr("id", "axisGroup")

let y = d3.scaleBand()
    .range([0, height - margin.top - margin.bottom])
    .paddingInner(0.2).paddingOuter(0.05)
let x = d3.scaleLinear()
    .range([50, width - margin.left - margin.right])

const xAxisGroup = axisGroup
    .append("g")
        .attr("id", "xAxisGroup")
        .attr('transform', `translate(${margin.left}, ${height - margin.bottom})`)
const yAxisGroup = axisGroup
    .append("g")
        .attr("id", "yAxisGroup")
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

const xAxis = d3.axisBottom().scale(x).ticks(5).tickSize(-height)
const yAxis = d3.axisLeft().scale(y)

d3.json('data.json').then(data => {
    data = Object.values(data.worldCupWinners)
    data.map(d => d.titles = +d.titles)

    x.domain(d3.extent(data.map(d=>d.titles)))
    y.domain(data.map(d => d.country))

    xAxisGroup.call(xAxis)
    yAxisGroup.call(yAxis)

    xAxisGroup.select('.domain').remove()

    elementGroup.selectAll('.bar').data(data).call(drawBar)

})


function drawBar(group) {
    group.enter().append("rect")
        .attr('id', d => d.country)
        .attr('class', 'bar')
        .attr('height', y.bandwidth())
        .attr('width', d => x(d.titles))
        .attr('x', margin.left)
        .attr('y', d => y(d.country))
}