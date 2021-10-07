const width = 900
const height = 560

const margins = {
    left: 40,
    right: 10, 
    top: 10,
    bottom: 150
}

const sliderDims = {
    left: 0,
    right: 0, 
    top: 40,
    bottom: 40,
}

let svg = d3.select('#chart').append('svg').attr('height', height).attr('width', width)

svg.append('defs')
.append('svg:clipPath')
    .attr('id', 'clipper')
    .append('svg:rect')
        .attr("width", width - margins.left - margins.right)
        .attr("height", height - margins.top - margins.bottom)

let elementGroup = svg.append('g').attr('id', 'elementGroup').attr('transform', `translate(${margins.left}, ${margins.top})`)
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

const formatTime = d3.timeParse("%Y-%m-%d")

let brush = d3.brushX()
    .extent([[0, 0], [width - margins.right - margins.left, margins.bottom - sliderDims.bottom - sliderDims.top]])
    .on("brush end", zoom)

let xAxis = d3.axisBottom().scale(x)
let yAxis = d3.axisLeft().scale(y)
let xAxis2 = d3.axisBottom().scale(x2)
let path;

d3.csv('data.csv').then(data=>{
    data.forEach(d => {
        d.date = formatTime(d.date);
        d.price = +d.price
    });

    x.domain(d3.extent(data.map(d => d.date)))
    x2.domain(d3.extent(data.map(d => d.date)))
    y.domain(d3.extent(data.map(d => d.price)))
    y2.domain(d3.extent(data.map(d => d.price)))
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
                .y(d => y(d.price))
            )

    sliderLineGroup.datum(data)
        .append('path')
        .attr('id', 'line')
        .attr('fill', 'none')
        .attr('stroke', 'black')
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(d => x2(d.date))
            .y(d => y2(d.price))
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
        .y(d => y(d.price))
)

}

