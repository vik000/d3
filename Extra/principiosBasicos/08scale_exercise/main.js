const width = 800
const height = 600
const margin = {
    top: 10, 
    bottom: 40,
    left: 40,
    right: 10
}

const svg = d3.select("#chart").append('svg').attr("id", "svg").attr("width", width).attr("height", height)
const elementGroup = svg.append("g").attr("id", "elementGroup").attr('transform', `translate(${margin.left}, ${0})`)

let scale = d3.scaleLinear().range([0, width - margin.left - margin.right])

d3.json("data.json").then(data =>{
    data = data.data
    scale.domain(d3.extent(data.map(d => d.distance)))

    updateSpots(data) // juntamos el patrón entero en una única función (se puede hacer de más formas) 
})

function updateSpots(data) {
    cities = elementGroup.selectAll('circle').data(data)
    cities.enter().call(enter)
    // cities.call(update)
    // cities.exit().call(exit)
    // estas solo hacen falta si usamos el patrón de actualización
}

function enter(selection) {
    selection.append('circle').call(update)
}

function update(selection) {
    selection
        .attr('cy', 100)
        .attr('r', 10)
        .attr('class', d => d.city)
        .attr('cx', d => scale(d.distance))
}

function exit(selection) {
    // selection.exit().transition().delay(1000).remove() // en esta hay un retardo en la elimninación. 
    selection.exit().remove()
}