const width = 800
const height = 600
const margin = {
    top: 10,
    bottom: 40,
    left: 40, 
    right: 10
}

const svg = d3.select("div#chart").append("svg").attr("id", "svg").attr("width", width).attr("height", height)
const elementGroup = svg.append("g").attr('id', "elementGroup").attr("transform", `translate(${margin.left}, ${margin.top})`)
const axisGroup = svg.append("g").attr('id', "axisGroup")
const xAxisGroup = axisGroup.append("g").attr('id', "xAxisGroup").attr("transform", `translate(${margin.left}, ${height - margin.bottom})`)
const yAxisGroup = axisGroup.append("g").attr('id', "yAxisGroup").attr("transform", `translate(${margin.left}, ${margin.top})`)

let x = d3.scaleBand().range([0, width - margin.left - margin.right])
let y = d3.scaleLinear().range([height - margin.top - margin.bottom, 0])
const xAxis = d3.axisBottom().scale(x)
const yAxis = d3.axisLeft().scale(y)

let line = d3.line()

d3.csv('data.csv').then(data => {
    data.map(d => {
        d["Cork-min"] = +d["Cork-min"]
        d["Cork-max"] = +d["Cork-max"]
        d["Madrid-min"] = +d["Madrid-min"]
        d["Madrid-max"] = +d["Madrid-max"]
    })
    let minY = d3.min(data.map(d => Math.min(d["Cork-min"], d["Madrid-min"])))
    let maxY = d3.max(data.map(d => Math.max(d["Cork-max"], d["Madrid-max"])))
    
    x.domain(data.map(d => d.Month))
    y.domain([minY, maxY])

    xAxisGroup.call(xAxis)
    yAxisGroup.call(yAxis)

    let corkMin = data.map(d => ({ month: d.Month, value: d["Cork-min"] }))
    let corkMax = data.map(d => ({ month: d.Month, value: d["Cork-max"] }))
    let madridMin = data.map(d => ({ month: d.Month, value: d["Madrid-min"] }))
    let madridMax = data.map(d => ({ month: d.Month, value: d["Madrid-max"] }))

    elementGroup.datum(corkMin).append("path").attr("d", d3.line().x(d => x(d.month)).y(d => y(d.value))).attr("class", "line cork min")
    elementGroup.datum(corkMax).append("path").attr("d", d3.line().x(d => x(d.month)).y(d => y(d.value))).attr("class", "line cork max")
    elementGroup.datum(madridMin).append("path").attr("d", d3.line().x(d => x(d.month)).y(d => y(d.value))).attr("class", "line madrid min")
    elementGroup.datum(madridMax).append("path").attr("d", d3.line().x(d => x(d.month)).y(d => y(d.value))).attr("class", "line madrid max")

})
