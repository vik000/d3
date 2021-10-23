const height = 500
const width = 1400
const margins = {
    top: 20,
    bottom: 70,
    right: 10,
    left: 20
}

let svg = d3.select('#chart').append('svg').attr('width', width).attr('height', height)

let elementGroup = svg.append('g').attr('id', 'elementGroup')
    .attr('transform', `translate(${margins.left}, ${margins.top})`)

const h = height - margins.top - margins.bottom;

let axisGroup = svg.append('g').attr('id', 'axisGroup')
let xAxisGroup = axisGroup.append('g')
    .attr('id', 'xAxisGroup')
    .attr('transform', `translate(${margins.left}, ${height - margins.bottom})`)
let yAxisGroup = axisGroup.append('g')
    .attr('id', 'yAxisGroup')
    .attr('transform', `translate(${margins.left}, ${margins.top})`)

let x = d3.scaleBand().range([0, width - margins.left - margins.right])
let xAxis = d3.axisBottom().scale(x)
let y = d3.scaleLinear().range([height - margins.top - margins.bottom, 0])
let yAxis = d3.axisLeft().scale(y)

// tooltip:
let mainText = elementGroup.
    append('text')
        .attr('id', 'mainText')
        .attr('transform', `translate(${(width - margins.left - margins.right) / 2}, ${h/4})`)
        .attr('text-anchor', 'middle')

let refLineGroup = elementGroup
    .append('g').attr('id', "refLineGroup")
    
let refLine = refLineGroup
    .append('line')
            .attr('id', 'refLine')
            .attr('x1', 0)
            .attr('x2', width)
            .attr('y1', h/2)
            .attr('y2', h/2)

let refText = refLineGroup
    .append('text')
    .attr('class', 'refText hidden')

// data:
d3.csv('data.csv').then(data=> {
    data.forEach(d => {
        d.Twh = +d.Twh
        d.Number = +d.Number
    });
    // console.log(data)
    
    x.domain(data.map(d => d.Country)).paddingInner(0.1).paddingOuter(0.2)
    y.domain(d3.extent(data.map(d => d.Number)))

    let bars = elementGroup.selectAll('g.barItem').data(data)

    bars.enter().call(drawBars)
    bars.call(updateBars)
    bars.exit().remove()

    xAxisGroup.call(xAxis).selectAll('g.tick').selectAll('text').attr('text-anchor', 'end').attr('transform', `rotate(-45)`)
    yAxisGroup.call(yAxis)
})

function drawBars(bars) {
    let group = bars.append('g')
    group.attr('class', d => `barItem ${d.Country}`)
    group.append('rect')
        .attr('class', 'bar')
        .attr('height', d => h - y(d.Number))
        .attr('width', x.bandwidth())
        .attr('x', d => x(d.Country))
        .attr('y', d => y(d.Number))
        .on('mouseover', showTooltip)
        .on('mouseout', hideTooltip)
}

function updateBars(bars) {
    let group = bars.select('g')
    group.attr('class', d => `barItem ${d.Country}`)
    group.select('rect')
        .attr('class', 'bar')
        .attr('height', d => h - y(d.Number))
        .attr('width', x.bandwidth())
        .attr('x', d => x(d.Country))
        .attr('y', d => y(d.Number))
}

function showTooltip(d, i, a) {
    mainText.classed('hidden', false)
    mainText.text(`${d.Country}: ${d.Twh} Twh`)

    refLine.attr('y1', y(d.Number))
    refLine.attr('y2', y(d.Number))
    refLine.classed('hidden', false)
    
    refText.classed('hidden', false)
    refText.text(d.Number)
    refText.attr('transform', `translate(${15}, ${y(d.Number) - 5})`)

    d3.select(this).classed('selected', true)
    elementGroup.selectAll('rect:not(.selected)').classed('soften', true)
}

function hideTooltip() {
    mainText.classed('hidden', true)
    refLine.classed('hidden', true)
    refText.classed('hidden', true)

    elementGroup.selectAll('rect').classed('selected', false)
    elementGroup.selectAll('rect').classed('soften', false)
}