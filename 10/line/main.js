const width = 900
const height = 560

const margins = {
    left: 40,
    right: 10, 
    top: 20,
    bottom: 150
}

const sliderDims = {
    left: 0,
    right: 0, 
    top: 40,
    bottom: 40,
}

let svg = d3.select('#chart').append('svg').attr('height', height).attr('width', width)
let elementGroup = svg.append('g').attr('id', 'elementGroup').attr('transform', `translate(${margins.left}, ${margins.top})`)

svg.append('defs')
.append('svg:clipPath')
    .attr('id', 'clipper')
    .append('svg:rect')
        .attr("width", width - margins.left - margins.right)
        .attr("height", height - margins.top - margins.bottom)

elementGroup.attr('clip-path', 'url(#clipper)')

let axisGroup = svg.append('g').attr('class', 'axisGroup')
let xAxisGroup = axisGroup.append('g').attr('class', 'axisGroup xAxisGroup').attr('transform', `translate(${margins.left}, ${height - margins.bottom})`)
let yAxisGroup = axisGroup.append('g').attr('class', 'axisGroup yAxisGroup').attr('transform', `translate(${margins.left}, ${margins.top})`)

let sliderGroup = svg.append('g').attr('id', 'sliderGroup').attr('transform', `translate(${margins.left}, ${height - margins.bottom + sliderDims.top})`)
let sliderLineGroup = sliderGroup.append('g').attr('id', 'sliderLineGroup').attr('transform', `translate(${0}, ${0})`)
let xAxisGroup2 = sliderGroup.append('g').attr('class', 'axisGroup xAxisGroup').attr('transform', `translate(${0}, ${margins.bottom -sliderDims.top - sliderDims.bottom})`)

let x = d3.scaleTime().range([0, width - margins.left - margins.right])
let x2 = d3.scaleTime().range([0, width - margins.left - margins.right])
let y = d3.scaleLinear().range([height - margins.top - margins.bottom, 0])
let y2 = d3.scaleLinear().range([margins.bottom - sliderDims.top - sliderDims.bottom, 0])

const formatTime = d3.timeParse("%d/%m/%Y")

let brush = d3.brushX()
    .extent([[0, 0], [width - margins.right - margins.left, margins.bottom - sliderDims.bottom - sliderDims.top]])
    .on("brush end", zoom)

let xAxis = d3.axisBottom().scale(x)
let yAxis = d3.axisLeft().scale(y)
let xAxis2 = d3.axisBottom().scale(x2)
let path;

//tooltip
let tooltipGroup = svg.append('g').attr('id', "tooltipGroup").attr('class', 'hidden')
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

let backRect = elementGroup.append('rect').attr('width', width - margins.left - margins.right).attr('height', height - margins.top - margins.bottom).attr('fill', "#FFF").style('opacity', 0)
elementGroup.on('mousemove', showTooltip)
elementGroup.on('mouseout', hideTooltip)

d3.csv('ibex.csv').then(data=>{
    data.forEach(d => {
        d.date = formatTime(d.date);
        d.close = +d.close
        d.open = +d.open
        d.high = +d.high
        d.low = +d.low
    });

    x.domain(d3.extent(data.map(d => d.date)))
    x2.domain(d3.extent(data.map(d => d.date)))
    y.domain(d3.extent(data.map(d => d.close)))
    y2.domain(d3.extent(data.map(d => d.close)))
    // console.log(data)

    xAxisGroup.call(xAxis)
    yAxisGroup.call(yAxis)
    xAxisGroup2.call(xAxis2)

    path = elementGroup.datum(data)
        .append('path')
            .attr('id', 'line')
            .attr('fill', 'none')
            .attr('stroke', 'black')
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(d => x(d.date))
                .y(d => y(d.close))
            )

    sliderLineGroup.datum(data)
        .append('path')
        .attr('id', 'line')
        .attr('fill', 'none')
        .attr('stroke', 'black')
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(d => x2(d.date))
            .y(d => y2(d.close))
        )

    sliderLineGroup.call(brush).call(brush.move, x2.range());
})


function zoom(){
    extent = d3.event.selection
    x.domain([
        x2.invert(extent[0]),
        x2.invert(extent[1])
    ])
    xAxisGroup.call(xAxis)
    path.attr("d", d3.line()
        .x(d => x(d.date))
        .y(d => y(d.close))
    )
}

let findX = d3.scaleLinear().domain([margins.left, width]).range([0, 1])

function showTooltip() {
    mouse = d3.event
    // show:
    tooltipGroup.classed('hidden', false)
    zoomedData = path.data()[0].filter(d => d.date >= x.domain()[0] && d.date <= x.domain()[1])
    index = Math.round(findX(mouse.x) * zoomedData.length)
    val = zoomedData[index]
    mx = x(val.date) + margins.left
    my = y(val.close) + margins.top
    tipDot.attr('transform', `translate(${mx}, ${my})`)
    crossX.attr('x1', mx).attr('x2', mx).attr('y1', margins.top).attr('y2', height - margins.bottom)
    crossY.attr('x1', margins.left).attr('x2', width - margins.right).attr('y1', my).attr('y2', my)
    
    xAdd = mouse.x + dataBoxWidth + 10 >= width ? - (dataBoxWidth + 10) : 10
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

