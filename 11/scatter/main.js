// const
const width = 800
const height = 600
const margin = {
    top: 20, 
    right: 40, 
    bottom: 80,
    left: 50
}

// svg:
const svg = d3.select("#chart")
    .append('svg')
        .attr('id', "svg")
        .attr("width", width)
        .attr("height", height)
const elementGroup = svg
    .append("g")
        .attr('id', "elementGroup")
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
const axisGroup = svg
    .append("g")
        .attr("id", "axisGroup")

// axis & scales:
let x = d3.scaleLinear().range([0, width - margin.left - margin.right])
let y = d3.scaleLinear().range([height - margin.top - margin.bottom, 0])
let z = d3.scaleLinear().range([6, 90])

let xAxisGroup = axisGroup
    .append("g")
        .attr("id", "xAxisGroup")
        .attr("transform", `translate(${margin.left}, ${height - margin.bottom})`)
let yAxisGroup = axisGroup
    .append("g")
        .attr("id", "yAxisGroup")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)

let xAxis = d3.axisBottom().scale(x)
let yAxis = d3.axisLeft().scale(y)

let xAxisLabel = axisGroup
    .append('text')
    .text("GDP per Capita")
    .attr('transform', `translate(${width - margin.right}, ${height - margin.bottom -10})`)
    .attr('text-anchor', 'end')
let yAxisLabel = axisGroup
    .append('text')
    .text("Life Expectancy")
        .attr('transform', `translate(${margin.left + 10}, ${margin.top}) rotate(90)`)

// tooltip


// data
d3.csv('data.csv').then(data => {
    data.map(d => {
        d.GDPpc = +d.GDPpc
        d.lifeExpectancy = +d.lifeExpectancy
        d.population = +d.population
    })
    // console.log(data)
    x.domain(d3.extent(data.map(d=>d.GDPpc)))
    y.domain(d3.extent(data.map(d=>d.lifeExpectancy)))
    z.domain(d3.extent(data.map(d=>d.population)))

    xAxisGroup.call(xAxis)
    yAxisGroup.call(yAxis)

    // data binding:
    let elements = elementGroup.selectAll('.country').data(data)
    elements.enter().call(drawCircles)

})

function drawCircles(group){
    group.append('circle')
        .attr('class', d=> `country ${d.continent}`)
        .attr("cx", d=> x(d.GDPpc))
        .attr("cy", d=> y(d.lifeExpectancy))
        .attr("r", d=> z(d.population))
}


