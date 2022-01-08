const width = 600
const height = 180
const margin = {
    top: 40,
    bottom: 40,
    left: 15, 
    right: 15
}
const eHeight = height - margin.top - margin.bottom


const svg = d3.select("#chart").append("svg").attr("id", "svg")
    .attr("width", width)
    .attr("height", height)

let elementGroup = svg.append("g").attr("id", "elementGroup")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
let axisGroup = svg.append("g").attr("id", "axisGroup")
    .attr("transform", `translate(${margin.left}, ${height - margin.bottom})`)

// quantile, quartile, quantize:

// quantize groups elments in discrete increments (groups will have the same size): Groups the values (population)
// quantiles breaks into groups of similar sizes (the division will be equally separated): Groups data entries
// quartiles are quantiles of 4 divisions.

let range = [0, width - margin.left - margin.right]

let quantile = d3.scaleQuantile().range(["Q1", "Q2", "Q3", "Q4"])
let quantize = d3.scaleQuantize().range(["Q1", "Q2", "Q3", "Q4"])
let scale = d3.scaleLinear().range(range)

let axis = d3.axisBottom().scale(scale)

let data
d3.csv("data.csv").then(_data => {
    _data.map(d => {
        d.Age = +d.Age
        d.Population = +d.Population
    })
    data = _data
    let sorted = data.map(d=>d.Population).sort((a,b) => d3.ascending(a, b))
    
    quantile.domain(sorted) // needs the whole dataset, because it breaks the entries by number
    quantize.domain(d3.extent(data.map(d => d.Population))) // receives the extent, as it's continuous data (it will find the division points in the domain)
    scale.domain(d3.extent(data.map(d => d.Population)))
    
    axisGroup.call(axis)


    // the boxplot will draw the data distribution this way:
    let q1 = quantile.invertExtent("Q1")
    let q2 = quantile.invertExtent("Q2")
    let q3 = quantile.invertExtent("Q3")
    let q4 = quantile.invertExtent("Q4")

    elementGroup.selectAll("circle").data(data).enter()
        .append("circle")
        .attr("r", 3)
        .attr("cy", eHeight / 2)
        .attr("cx", d => scale(d.Population))

    // boxplot:
    let boxplot = svg.append("g").attr("id", "boxplot")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)

    boxplot.append("line").attr("id", "whiskers")
        .attr("x1", scale(q1[0]))
        .attr("x2", scale(q4[1]))
        .attr("y1", eHeight / 8)
        .attr("y2", eHeight / 8)

    boxplot.append("rect").attr("id", "box")
        .attr("height", eHeight / 4)
        .attr("width", scale(q3[1]) - scale(q1[1]))
        .attr("x", scale(q1[1]))
        .attr("y", 0)

    for(let i = 1; i < 4; i++) {
        function getQ(i) {
            return quantile.invertExtent(`Q${i}`)[1]
        }
        boxplot.append("text").attr("class", "qLabel")
            .attr("transform", 
                `translate(${scale(getQ(i))}, ${-10})`)
            .text(`Q${i}`)
            .attr("text-anchor", "middle")
    }

    elementGroup.append("line").attr("id", "median")
        .attr("x1", scale(q2[1]))
        .attr("x2", scale(q2[1]))
        .attr("y1", -margin.top)
        .attr("y2", eHeight)

})
