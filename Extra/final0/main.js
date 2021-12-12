// consts:
const margin = {
    top: 10,
    bottom: 40,
    left: 40, 
    right: 10
}

// como vamos a tener 2 gráficos, agrupamos las dimensiones en objetos para tenerlas más fáciles de controlar:
// así, el tamaño del svg será width.full, mientras que cuando necesite la del gráfico, será width.line (la del del líneas), 
// o width.volume (el de volumen)
width = {
    full: 1000
}
width.line = width.full - margin.left - margin.right
width.volume = width.full - margin.left - margin.right

height = {
    full: 600,
}
height.volume = 150
height.line = height.full - height.volume - margin.top - margin.bottom


// svg:
const svg = d3.select('#chart').append('svg').attr("width", width.full).attr("height", height.full).attr('id', "svg")
const lineElement = svg.append('g').attr('id', "lineElement").attr('transform', `translate(${margin.left}, ${0})`)
const volElement = svg.append('g').attr('id', "volElement").attr('transform', `translate(${margin.left}, ${height.line})`)

// scales (aqui vemos la ventaja de usar un solo objeto)
let x = d3.scaleBand().range([0, width.line])
let timeScale = d3.scaleTime().range([0, width.line]) // solo para el eje temporal, para los datos usaremos scaleBand
let y = d3.scaleLinear().range([height.line, 0])
let y1 = d3.scaleLinear().range([height.volume, 0])

// axes:
const axisGroup = svg.append('g').attr('id', "axisGroup")
const xAxisGroup = axisGroup.append('g').attr('id', "xAxisGroup").attr("transform", `translate(${margin.left}, ${height.line})`)
const xAxisGroup1 = axisGroup.append('g').attr('id', "xAxisGroup1").attr("transform", `translate(${margin.left}, ${height.line + height.volume})`)
const yAxisGroup = axisGroup.append('g').attr('id', "yAxisGroup").attr("transform", `translate(${margin.left}, ${0})`)
const yAxisGroup1 = axisGroup.append('g').attr('id', "yAxisGroup1").attr("transform", `translate(${margin.left}, ${height.line})`)

let xAxis = d3.axisBottom().scale(timeScale)
let xAxis1 = d3.axisBottom().scale(x)
let yAxis = d3.axisLeft().scale(y)
let yAxis1 = d3.axisLeft().scale(y1).tickFormat(x => `${x / 1000000} M`); 


//tooltip
const tipArea = svg.append('g').attr('id', "tipArea").attr('transform', `translate(${margin.left}, ${0})`)
let tooltipGroup = tipArea.append('g').attr('id', "tooltipGroup").attr('class', 'hidden')
let tipDot = tooltipGroup.append('circle').attr('id', "tipDot").attr('r', 5)
let crossX = tooltipGroup.append('line').attr('id', "crossX").attr('class', "lineTip tooltip")
let crossY = tooltipGroup.append('line').attr('id', "crossY").attr('class', "lineTip tooltip")
let dataBoxGroup = tooltipGroup.append('g').attr('id', "dataBoxGroup").attr('class', "tooltip databox")
let dataBoxWidth = 150
let dataBox = dataBoxGroup.append('rect').attr('id', "dataBox").attr('class', "tooltip databox").attr('width', dataBoxWidth).attr('height', 80)
let dataOpen = dataBoxGroup.append('text').attr('id', "tipDataOpen").attr('class', "tooltip databox data open").text("Open: ").append("tspan").attr('id', "dataBoxValOpen")
let dataClose = dataBoxGroup.append('text').attr('id', "tipDataClose").attr('class', "tooltip databox data close").text("Close: ").append("tspan").attr('id', "dataBoxValClose")
let dataHigh = dataBoxGroup.append('text').attr('id', "tipDataHigh").attr('class', "tooltip databox data high").text("High: ").append("tspan").attr('id', "dataBoxValHigh")
let dataLow = dataBoxGroup.append('text').attr('id', "tipDataLow").attr('class', "tooltip databox data low").text("Low: ").append("tspan").attr('id', "dataBoxValLow")

let backRect = tipArea.append('rect')
    .attr('id', "backRect")
    .attr('width', width.line)
    .attr('height', height.full - margin.top - margin.bottom)
    .attr('fill', "#FFF").style('opacity', 0)
svg.on('mousemove', showTooltip)
svg.on('mouseout', hideTooltip)


// data:
// la transformación de fecha solo sirve para asegurar el orden de los datos
// porque luego, al usar scaleBand, van a entrar como string otra vez

let data;
const formatDate = d3.timeParse("%d/%m/%Y");
d3.csv('ibex.csv').then(_data => {
    _data.map(d => {
        d.close = +d.close
        d.open = +d.open
        d.high = +d.high
        d.low = +d.low
        d.volume = +d.volume
        d.date = formatDate(d.date)
    })
    data = _data.sort(function(a, b) {
        return a.date - b.date
    })
    console.log(data);

    timeScale.domain(d3.extent(data.map(d => d.date)))    
    x.domain(data.map(d => `${d.date.getFullYear()}/${d.date.getMonth() + 1}/${d.date.getDate()}`))
    y.domain(d3.extent(data.map(d => d.close)))
    y1.domain(d3.extent(data.map(d => d.volume)))

    xAxisGroup.call(xAxis)
    xAxisGroup1.call(xAxis) // usamos el mismo porque mola más, pero para el gráfico usamos la otra escala que para eso la hemos hecho.

    yAxisGroup.call(yAxis)
    yAxisGroup1.call(yAxis1)
    yAxisGroup1.select('.domain').remove()

    // data binding:
    line = lineElement.datum(data)
    line.append('path')
        .attr('class', 'line')
        .attr('d', d3.line().x(d => timeScale(d.date)).y(d => y(d.close)))

    volume = volElement.selectAll('rect').data(data)
    volume.enter().append('rect')
        .attr('class', d => `volBar ${d.close >= d.open ? "up" : "down"}`)
        .attr('x', d => x(`${d.date.getFullYear()}/${d.date.getMonth() + 1}/${d.date.getDate()}`))
        .attr('y', d => y1(d.volume))
        .attr('width', x.bandwidth())
        .attr('height', d => height.volume - y1(d.volume))

    console.log()
})

let findX = d3.scaleLinear().domain([margin.left, width.full]).range([0, 1])
function showTooltip() {
    mouse = d3.event
    // show:
    tooltipGroup.classed('hidden', false)

    //
    index = Math.round(findX(mouse.x) * data.length)
    val = data[index]

    //
    mx = timeScale(val.date)
    my = y(val.close)

    //
    tipDot.attr('transform', `translate(${mx}, ${my})`)
    crossX.attr('x1', mx).attr('x2', mx).attr('y1', 0).attr('y2', height.line + height.volume)
    crossY.attr('x1', 0).attr('x2', width.line).attr('y1', my).attr('y2', my)
    
    xAdd = mouse.x + dataBoxWidth + 10 >= width.line ? - (dataBoxWidth + 10) : 10
    dataBoxGroup.attr('transform', `translate(${mx + xAdd}, ${my + 10})`)
    d3.select("text#tipDataOpen").attr('transform', `translate(${5}, ${12})`)
    d3.select("text#tipDataClose").attr('transform', `translate(${5}, ${32})`)
    d3.select("text#tipDataHigh").attr('transform', `translate(${5}, ${52})`)
    d3.select("text#tipDataLow").attr('transform', `translate(${5}, ${72})`)
    dataOpen.text(val.open)
    dataClose.text(val.close)
    dataHigh.text(val.high)
    dataLow.text(val.low)
}

function hideTooltip() {
    // hide:
    tooltipGroup.classed('hidden', true)
}
