const width = 800
const height = 200
const margin = {
    top:10, 
    bottom: 40,
    right:10,
    left: 10
}

const svg = d3.select('#chart').append('svg').attr('id', 'svg').attr("width", width).attr("height", height)
const elementGroup = svg.append('g').attr('id', "elementGroup")
    .attr('transform', `translate(${margin.left}, ${0})`)

const axisGroup = svg.append('g').attr('id', "axisGroup")
const xAxisGroup = axisGroup.append("g").attr('id', "xAxisGroup")
    .attr('transform', `translate(${margin.left}, ${height - margin.bottom})`)

let x = d3.scaleLinear().range([0, width - margin.left - margin.right])

let xAxis = d3.axisBottom().scale(x)

d3.json("data.json").then(data => {
    data = data.data
    x.domain(d3.extent(data.map(d => d.distance)))
    xAxisGroup.call(xAxis)

    updatePattern(data)
})

function updatePattern(data) {
    elements = elementGroup.selectAll('circle').data(data)
    elements.call(enter)
}

function enter(selection) {
    selection.enter().append('circle')
        .call(update)
}

function update(selection) {
    selection
        .attr('class', 'city')
        .attr('id', d => d.city)
        .attr('cx', d => x(d.distance))
        .attr('cy', 50)
        .attr('r', 10)
}

function exit(selection) {
    selection.exit().remove()
}