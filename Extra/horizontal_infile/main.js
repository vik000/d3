// datos:
let data = [
{
letter: "A",
frequency: 0.08167
},
{
letter: "B",
frequency: 0.01492
},
{
letter: "C",
frequency: 0.02782
},
{
letter: "D",
frequency: 0.04253
},
{
letter: "E",
frequency: 0.12702
},
{
letter: "F",
frequency: 0.02288
},
{
letter: "G",
frequency: 0.02015
},
{
letter: "H",
frequency: 0.06094
},
{
letter: "I",
frequency: 0.06966
},
{
letter: "J",
frequency: 0.00153
},
{
letter: "K",
frequency: 0.00772
},
{
letter: "L",
frequency: 0.04025
},
{
letter: "M",
frequency: 0.02406
},
{
letter: "N",
frequency: 0.06749
},
{
letter: "O",
frequency: 0.07507
},
{
letter: "P",
frequency: 0.01929
},
{
letter: "Q",
frequency: 0.00095
},
{
letter: "R",
frequency: 0.05987
},
{
letter: "S",
frequency: 0.06327
},
{
letter: "T",
frequency: 0.09056
},
{
letter: "U",
frequency: 0.02758
},
{
letter: "V",
frequency: 0.00978
},
{
letter: "W",
frequency: 0.0236
},
{
letter: "X",
frequency: 0.0015
},
{
letter: "Y",
frequency: 0.01974
},
{
letter: "Z",
frequency: 0.00074
},
]

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
let elementGroup = svg.append('g').attr('id', 'elementGroup').attr('width', eWidth).attr('height', eHeight)
    .attr('transform', `translate(${margins.left}, ${margins.top})`) 
let axisGroup = svg.append('g').attr('id', "axisGroup")

// escalas:
let x = d3.scaleLinear().range([0, eWidth]).domain(d3.extent(data.map(d=>d.frequency)))
let y = d3.scaleBand().range([0, eHeight]).domain(data.map(d=>d.letter))

// ejes:
let xAxisGroup = axisGroup.append('g').attr('id', "xAxisGroup")
let yAxisGroup = axisGroup.append('g').attr('id', "yAxisGroup")
let xAxis = d3.axisBottom().scale(x) // los ejes tienen que recibir la escala, y se hace así
let yAxis = d3.axisLeft().scale(y)

xAxisGroup.call(xAxis)
yAxisGroup.call(yAxis)

xAxisGroup.attr('transform', `translate(${margins.left}, ${height - margins.bottom})`)
yAxisGroup.attr('transform', `translate(${margins.left}, ${margins.top})`)

// data call (cuando está en el mismo archivo no se usa función de llamada):
// 1. data transformations:
data.forEach(function(d) {
    d.frequency = +d.frequency
})

// 2. normalmente, aqui se pasa el dominio, pero cuando está en el mismo archivo se puede hacer antes.
// 3. data binding:
let bars = elementGroup.selectAll('rect').data(data)
// 4. función enter:
bars.enter().call(drawBars) // la función drawBars la podemos definir luego, que queda más limpito. 
// 5. función update (en este caso no hay)
// 6. función exit (en este caso no hay)

// definición de las funciones usadas:
function drawBars(bars) {
    bars.append('rect')
        .attr("id", d=>d.letter)
        .attr('height', y.bandwidth)
        .attr('width', d=> x(d.frequency))
        .attr('x', 0)
        .attr('y', (d, i) => i * y.bandwidth())
}
