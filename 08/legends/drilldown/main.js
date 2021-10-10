const height = 600
const width = 800
const margins = {
    top: 10,
    bottom: 40,
    left: 40,
    right: 10
}
const centering = 40

let svg = d3.select("#chart").append('svg').attr('width', width).attr('height', height)
let elementGroup = svg.append('g').attr('class', "elementGroup")
let axisGroup = svg.append('g').attr('class', "axisGroup")
let xAxisGroup = axisGroup.append('g').attr('class', "xAxisGroup").attr("transform", `translate(${margins.left}, ${height - margins.bottom})`)
let yAxisGroup = axisGroup.append('g').attr('class', "yAxisGroup").attr("transform", `translate(${margins.left}, ${margins.top})`)

let x = d3.scalePoint().range([0, width - margins.left - margins.right])
let y = d3.scaleLinear().range([height - margins.top - margins.bottom, 0])
// let y = d3.scaleLinear().range([0, height - margins.top - margins.bottom])

let xAxis = d3.axisBottom().scale(x)
let yAxis = d3.axisLeft().scale(y)

let barSeparation;
let barWidth;
let barHeight = height - margins.top - margins.bottom;

let nested;
let originalData = []
let drilled = false;

function drilldown(d, i, a) {
    newData = drilled ? nested[i].values : originalData
    drilled = !drilled
    updateChart(newData)
}

function drawBar(group) {
    group.append('rect')
        .on('click', drilldown)
        .attr('class', d => `bar ${(d.key == "true" || d.EU_member) ? "EU" : 'non_EU'}`)
        .attr('width', barWidth)
        .attr('x', (d, i, a) => (barWidth) * i)
        .attr('y', d => barHeight)
        .transition().duration(1000)
        .attr('height', d => barHeight - y(d.population))
        .attr('y', d => y(d.population))
}

function updateBars(bars) {
    bars
        .transition().duration(1000)
        .attr('class', d => `bar ${(d.key == "true" || d.EU_member) ? "EU" : 'non_EU'}`)
        .attr('width', barWidth)
        .attr('x', (d, i, a) => (barWidth) * i)
        .attr('height', (d, i, a) => barHeight - y(d.population))
        .attr('y', d => y(d.population))
}

function updateChart(data) {
    barSeparation = 0
    barWidth = ((width - margins.left - margins.right - centering) / data.length)
     
    let extent = d3.extent(data.map(d => d.population))
    let dom = data.map(d => d.country)
    dom.push("")
    dom.splice(0, 0, " ")
    x.domain(dom)
    y.domain([0, extent[1]])
    
    xAxisGroup.transition().duration(1000).call(xAxis)
    yAxisGroup.transition().duration(1000).call(yAxis)

    elementGroup.attr("transform", `translate(${margins.left + (centering / 2)}, ${margins.top})`)
    
    let bars = elementGroup.selectAll('rect').data(data)
    bars.enter().call(drawBar)
    bars.call(updateBars)
    bars.exit().remove()
}

d3.csv('data.csv').then(data=>{
    data.forEach(d => {
        d.population = +d.population
        d.EU_member = d.EU_member == 'yes' ? true : false
    })

    // TREAT DATA:
    nested = d3.nest()
        .key(d => d.EU_member)
        .entries(data)

    nested.forEach(function(d, i) {
        let country = d.key == 'true' ? "EU" : "non EU"
        let population = nested[i].values.reduce((a,b) => 
            a + b.population, 0 
        )
        originalData.push({'country': country, 'population': population, "key": d.key})
    })

    data = originalData
    // data is now stored between nested and data
    updateChart(data)
})
