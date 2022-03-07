const height = 700
const width = 800
const margins = {
    top: 20,
    bottom: 70,
    right: 30,
    left: 92
}

let svg = d3.select('#chart').append('svg').attr('width', width).attr('height', height)

let elementGroup = svg.append('g').attr('id', 'elementGroup')
    .attr('transform', `translate(${margins.left}, ${margins.top})`)


let x = d3.scaleLinear().range([0, width - margins.left - margins.right])
let y = d3.scaleBand().range([height - margins.bottom - margins.top, 0])

let axisGroup = svg.append('g').attr('id', 'axisGroup')
let xAxisGroup = axisGroup.append('g').attr('id', 'xAxisGroup').attr('transform', `translate(${margins.left}, ${height - margins.bottom})`)
let yAxisGroup = axisGroup.append('g').attr('id', 'yAxisGroup').attr('transform', `translate(${margins.left}, ${margins.top})`)

let xAxis = d3.axisBottom().scale(x)
let yAxis = d3.axisLeft().scale(y)

let tooltip = svg.append('g').attr('id', 'tooltip').attr('transform', `translate(${margins.left}, ${margins.top})`)
let refLine = tooltip
    .append('line')
        .attr('id', 'refLine')
        .attr('class', 'hidden')
        .attr('y1', margins.top)
        .attr('y1', height - margins.bottom - margins.top)

let tipText = tooltip.append('text').attr('id', 'tipText')

d3.csv('data.csv').then(data => {
    data.forEach(d => {
        d.Twh = +d.Twh
        d.Number = +d.Number
    });
    
    x.domain(d3.extent(data.map(d => d.Number)))
    y.domain(data.map(d => d.Country))

    xAxisGroup.call(xAxis)
    yAxisGroup.call(yAxis)

    let bars = elementGroup.selectAll('g.bars').data(data)

    bars.enter().call(drawBars)
    
    // console.log(data)
})

function drawBars(group) {
    let bar = group.append('g').attr('class', 'barGroup')
    bar.append('rect')
        .attr('class', 'bar')
        .attr('height', y.bandwidth)
        .attr('width', d=>x(d.Number))
        .attr('x', 0)
        .attr('y', d=>y(d.Country))
        .on('mouseover', showTooltip)
        .on('mouseout', hideTooltip)
}

function showTooltip (d, i, a) {
    refLine.classed('hidden', false)
    refLine.attr('x1', x(d.Number))
    refLine.attr('x2', x(d.Number))
    d3.select(this).classed('selected', true)
    d3.selectAll('rect:not(.selected)').classed('soften', true)
    tipText.classed('hidden', false)
    tipText.text(d.Number)
    tipText.attr('transform', `translate(${x(d.Number) + 10}, ${y(d.Country) +  10})`)
}

function hideTooltip () {
    refLine.classed('hidden', true)
    d3.selectAll("rect").classed('soften', false)
    d3.selectAll("rect").classed('selected', false)
    tipText.classed('hidden', true)
}