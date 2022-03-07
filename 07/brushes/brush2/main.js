const width = 600
const height = 600

const margins = {
    top: 10,
    bottom: 40,
    left: 40,
    right: 10
}

let x = d3.scaleLinear().range([0, width - margins.left - margins.right])
let y = d3.scaleLinear().range([height - margins.top - margins.bottom, 0])

let svg = d3.select('#chart').append('svg').attr('height', height).attr('width', width).style('background-color', 'azure')
let axisGroup = svg.append('g').attr('id', 'axisgroup')
let xAxisGroup = axisGroup.append('g').attr('class', 'axis xAxis xAxisGroup')
let yAxisGroup = axisGroup.append('g').attr('class', 'axis yAxis yAxisGroup')

let xAxis = d3.axisBottom()
let yAxis = d3.axisLeft()

let clip = svg.append("defs").append("svg:clipPath")
    .attr("id", "clip")
    .append("svg:rect")
    .attr("width", width - margins.left - margins.right )
    .attr("height", height - margins.top - margins.bottom)
    .attr("x", 0)
    .attr("y", 0);
  
let elementGroup = svg.append('g')
    .attr('id', 'elementGroup')
    .attr('transform', `translate(${margins.left}, ${margins.top})`)
    .attr("clip-path", "url(#clip)")

let xdomain = null

d3.csv('data.csv').then(data=>{
    // console.log(data)
    xdomain = d3.extent(data.map(d => +d.x))
    x.domain(xdomain)
    y.domain(d3.extent(data.map(d => +d.y)))

    xAxis.scale(x).ticks(10)
    yAxis.scale(y).ticks(10)

    xAxisGroup.call(xAxis)
    xAxisGroup.attr('transform', `translate(${margins.left}, ${height - margins.bottom})`)
    yAxisGroup.call(yAxis)
    yAxisGroup.attr('transform', `translate(${margins.left}, ${margins.top})`)

    elementGroup.selectAll('circle').data(data)
        .join('circle')
            .attr('class', 'static')
            .attr('r', 10)
            .attr('cx', d => x(+d.x))
            .attr('cy', d => y(+d.y))
            .on('mouseover', d=>print(d))
    
})

function print(d, i, a){
    console.log(d)
}

// brushes
let brush = d3.brushX()
    .extent([[0, 0], [width, height]])
    .on("end", updateChart)

let brushGroup = elementGroup.append('g').attr('class', 'brush')
brushGroup.call(brush) 

function updateChart() {
    extent = d3.event.selection

    if (!extent){
        x.domain(xdomain)
    } else {
        x.domain([x.invert(extent[0]), x.invert(extent[1])])
    }

    xAxisGroup.transition().duration(1000).call(d3.axisBottom(x))
    
    elementGroup
      .selectAll("circle")
      .transition().duration(1000)
      .attr("cx", d => x(+d.x))
      .attr("cy", d => y(+d.y))

}
