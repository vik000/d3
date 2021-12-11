// const:
const width = 800
const height = 600
const margin = {
    left: 80,
    right: 80,
    bottom: 80,
    top: 80
}

// svg
const svg = d3.select("#chart").append('svg').attr("id", "svg").attr("width", width).attr("height", height)
const elementGroup = svg.append('g').attr('id', "elementGroup").attr('transform', `translate(${margin.left}, ${margin.top})`)

const axisGroup = svg.append('g').attr('id', "axisGroup")
const xAxisGroup = axisGroup.append('g').attr('id', "xAxisGroup").attr('transform', `translate(${margin.left}, ${height - margin.bottom})`)
const yAxisGroup = axisGroup.append('g').attr('id', "yAxisGroup").attr('transform', `translate(${margin.left}, ${margin.top})`)

// scales:
let x = d3.scaleLinear().range([0, width - margin.left - margin.right])
let y = d3.scaleLinear().range([height - margin.top - margin.bottom, 0])
let z = d3.scaleLinear().range([1, 40])

// axes:
let xAxis = d3.axisBottom().scale(x)
let yAxis = d3.axisLeft().scale(y)

// data:
function getData() {
    d3.json('http://0.0.0.0:8000/bubbles').then(_data => {
        console.log(_data);
        data = _data[0]
        x.domain(d3.extent(data.map(d => d.position)))
        y.domain(d3.extent(data.map(d => d.cost)))
        z.domain(d3.extent(data.map(d => d.size)))
    
        xAxisGroup.transition().duration(1000).call(xAxis)
        yAxisGroup.transition().duration(1000).call(yAxis)

        updateBubbles(data)
    })
}
getData(); // llamamos a la función al principio para no tener que esperar al primer intervalo.
d3.interval(getData, 3000)

function updateBubbles(data) {
    elements = elementGroup.selectAll('g.bubbleGroup').data(data)
    elements.call(enter)
    elements.call(updateBubble)
    elements.call(exit)
}

function enter(selection) {
    bubble = selection.enter().append('g').attr('class', 'bubbleGroup')
    bubble.append('circle')
        .attr('fill', 'cornflowerblue')
        .attr('class', d => d.category)
        .attr('cx', d => x(d.position))
        .attr('cy', d => y(d.cost))
        .transition().duration(1000)
        .attr('r', d => z(d.size))
}

function updateBubble(selection) {
    selection.select('circle')
        .attr('class', d => d.category)
        .transition().duration(1000)
        .attr('fill', 'plum')
        .attr('cx', d => x(d.position))
        .attr('cy', d => y(d.cost))
        .attr('r', d => z(d.size))
}

function exit(selection) {
    selection.exit().select('circle') 
    // hay que hacer select porque estamos usando grupos y queremos usar una transición 
    // en un elemento contenido dentro de los grupos.
        .attr('fill', 'red')
        .transition().duration(1000)
        .attr('r', 0)
        .remove()
    // con esto eliminamos los grupos que queden sueltos
    setTimeout(function(){
        selection.exit().remove()
    }, 1000)
    
}