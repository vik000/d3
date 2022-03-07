const width = 900
const height = 600
const margin = {
    top: 10,
    right: 10,
    bottom: 40,
    left: 40
}

const svg = d3.select("#chart").append('svg').attr("id", "svg").attr("width", width).attr("height", height)
let elementGroup = svg.append("g").attr("id", "elementGroup").attr("transform", `translate(${margin.left}, ${margin.top})`)

let axisGroup = svg.append("g").attr("id", "axisGroup")
let xAxisGroup = axisGroup.append("g").attr("id", "xAxisGroup").attr("transform", `translate(${margin.left}, ${height
     - margin.bottom})`)
let yAxisGroup = axisGroup.append("g").attr("id", "yAxisGroup").attr("transform", `translate(${margin.left}, ${margin.top})`)

let x = d3.scaleTime().range([0, width - margin.left - margin.right])
let band = d3.scaleBand().range([0, width - margin.left - margin.right]).padding(0.35)
let y = d3.scaleLinear([height - margin.top - margin.bottom, 0])

let xAxis = d3.axisBottom().scale(x)
let yAxis = d3.axisLeft().scale(y)

let tipGroup = svg.append("g").attr("id", "tipGroup")
let line = tipGroup.append("line")
    .attr("stroke", "rgba(50, 50, 50, 0.5)")
    .attr("stroke-dasharray", "3 3")
    .attr("y1", margin.top)
    .attr("y2", height - margin.bottom)

let parseTime = d3.timeParse("%d/%m/%Y")
let data;
d3.csv("ibex.csv").then(_data => {
    _data.map(d => {
        d.date = parseTime(d.date)
        d.open = +d.open
        d.close = +d.close
        d.high = +d.high 
        d.low = +d.low 
        d.volume = +d.volume
    })
    data = _data

    x.domain(d3.extent(data.map(d => d.date)))
    y.domain(d3.extent([...data.map(d => d.high), ...data.map(d => d.low)]))
    band.domain(data.map(d => d.date))

    xAxisGroup.call(xAxis)
    yAxisGroup.call(yAxis)

    let elements = elementGroup.selectAll(".candle").data(data)
    elements.enter().call(drawCandles)

})

function drawCandles(group){
    let candle = group.append("g").attr("class", "candle")
        .on("mouseover", function(d) {
            console.log(d.date, d.open)
            line.attr("x1", x(d.date) + margin.left + (band.bandwidth() / 2))
            line.attr("x2", x(d.date) + margin.left + (band.bandwidth() / 2))
        })
    let box = candle.append("rect")
        .attr("width", band.bandwidth())
        // .attr("height", d => y(d.open) - y(d.close) < 0 ? y(d.close) - y(d.open) : y(d.open) - y(d.close))
        .attr("height", d => Math.abs(y(d.open) - y(d.close)))
        .attr("x", d => x(d.date))
        .attr("y", d => y(d.open) - y(d.close) < 0 ? y(d.open) : y(d.close))
        .attr("fill", d => "transparent")
        .attr("fill", d => y(d.open) - y(d.close) < 0 ? "red" : "green")

    let whiskers = candle.append("line")
        .attr("x1", d => x(d.date) + (band.bandwidth() / 2))
        .attr("x2", d => x(d.date) + (band.bandwidth() / 2))
        .attr("y1", d => y(d.low))
        .attr("y2", d => y(d.high))
        .attr("stroke", d => y(d.open) - y(d.close) < 0 ? "red" : "green")
}



