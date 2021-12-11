const width = 800
const height = 200
const margin = {
    top:10, 
    bottom: 40,
    right: 50,
    left: 50
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
    elements = elementGroup.selectAll('g.city').data(data)
    elements.call(enter)
    elements.call(updateCircle)
    elements.call(updateLabel)
    elements.call(exit)
}

function enter(selection) {
    city = selection.enter().append('g').attr('class', 'city')
        .on('mouseover', highlight)
        .on('mouseout', removeHighlight)
    city.append('circle')
        // .on('mouseover', changeColour)
        // .on('click', changeColour)
        // .on('mouseout', changeBack)
        .call(updateCircle)
    city.append('text').call(updateLabel)
}

function updateCircle(selection) {
    selection
        .attr('class', 'cityShape')
        .attr('id', d => d.city)
        .attr('cx', d => x(d.distance))
        .attr('cy', 50)
        .attr('r', 10)
}

function updateLabel(selection) {
    selection
        .attr('class', 'cityName')
        .attr('y', 30)
        .text( d => d.city)
        .attr('x', d => x(d.distance))
        .attr('fill-opacity', 0)
        // .transition().duration(1500)
        // .attr('fill-opacity', 1)
}

function exit(selection) {
    selection.exit().remove()
}

function changeColour(d, i, a) {
    // console.log(this); // nodo seleccionado
    // console.log(d); // datos enlazados al nodo
    // console.log(i); // índice del nodo en el array de datos
    // console.log(a); // el array completo
    d3.selectAll('circle.cityShape').classed('selected', false)
    d3.select(this).classed('selected', true)
}

function changeBack(d, i, a){
    d3.selectAll('circle.cityShape').classed('selected', false)
}

function highlight() {
    d3.selectAll('circle.cityShape').classed('selected', false)
    d3.select(this).select('circle').classed('selected', true)
    d3.selectAll('text.cityName').attr('fill-opacity', 0)
    d3.select(this).select('text').transition().duration(300).attr('fill-opacity', 1)
}

function removeHighlight() {
    d3.selectAll('circle.cityShape').classed('selected', false)
    d3.selectAll('text.cityName').attr('fill-opacity', 0)
}