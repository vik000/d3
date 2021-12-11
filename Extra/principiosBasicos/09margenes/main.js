// Constantes:
const width = 800
const height = 600
const margins = {
    top: 10, 
    left: 40, 
    right: 10,
    bottom: 40
}
const eWidth = width - margins.left - margins.right
const eHeight = height - margins.top - margins.bottom

// grupos:
let svg = d3.select('div#chart').append('svg').attr('width', width).attr('height', height)
let elementGroup = svg.append('g')
    .attr('id', 'elementGroup')
    .attr('width', eWidth)
    .attr('height', eHeight)
    .attr('transform', `translate(${margins.left}, ${margins.top})`) 
let axisGroup = svg.append('g').attr('id', "axisGroup")




// Para mostrar las áreas (no fijarse en esto aún):
elementGroup.append('rect').attr('width', eWidth).attr("height", eHeight)

