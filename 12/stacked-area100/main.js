const width = 800
const height = 600
const margin = {
    top: 10, 
    bottom: 40, 
    left: 60, 
    right: 10
}

const svg = d3.select("#chart").append("svg").attr("width", width).attr("height", height)
const elementGroup = svg.append("g").attr("id", "elementGroup").attr("transform", `translate(${margin.left}, ${margin.top})`)

const axisGroup = svg.append("g").attr("id", "axisGroup")
const xAxisGroup = axisGroup.append("g").attr("id", "xAxisGroup").attr("transform", `translate(${margin.left}, ${height - margin.bottom})`)
const yAxisGroup = axisGroup.append("g").attr("id", "yAxisGroup").attr("transform", `translate(${margin.left}, ${margin.top})`)

let x = d3.scaleLinear().range([0, width - margin.left - margin.right])
let y = d3.scaleLinear().range([height - margin.top - margin.bottom, 0])
let xAxis = d3.axisBottom().scale(x)
let yAxis = d3.axisLeft().scale(y)

// tooltip:
let tooltip = svg.append("text").attr("id", "tooltip")
    .attr("class", "hidden")
    .attr("transform", `translate(${(width / 2)  + margin.left}, ${40})`)

let data
d3.csv("data.csv").then(_data => {
    // keys = names
    keys = [...new Set(_data.map(d => d.name))]

    // group by year:
    let newData = []
    let yearValues = new Set(_data.map(d => +d.year))
    yearValues.forEach(year => {
        newEntry = {year: year}
        filteredYear = _data.filter(d => +d.year == year)
        newEntry.total = filteredYear.map(d => d.amount).reduce((a,b) => +a + +b)
        filteredYear.forEach(d => newEntry[d.name] = +d.amount * 100 / newEntry.total)
        newData.push(newEntry)
    });

    let stacker = d3.stack().keys(keys)
    data = stacker(newData)

    // domains:
    x.domain(d3.extent([...yearValues]))
    y.domain([0, d3.max(data[data.length -1].map(d => d[1]))])

    xAxisGroup.call(xAxis)
    yAxisGroup.call(yAxis)

    let area = elementGroup.selectAll("g.area").data(data)
    area.enter().call(drawAreas)
})

function drawAreas(group) {
    area = d3.area()
        .x(d => x(d.data.year))
        .y0(d => y(d[0]))
        .y1(d => y(d[1]))
        .defined(d => !isNaN(d[1]) && !isNaN(d[0]))

    group.append("g")
        .on("mouseover", highlight)
        .on("mouseout", deluminate)
        .attr("class", d => `${d.key} area`)
        .datum(d => d)
        .append("path")
            .attr("d", area)

}

function highlight(d) {
    d3.selectAll("g.area").classed("soft", true)
    d3.select(this).classed("soft", false)
    tooltip.text(d.key).classed("hidden", false)
}

function deluminate() {
    d3.selectAll("g.area").classed("soft", false)
    tooltip.classed("hidden", true)
}