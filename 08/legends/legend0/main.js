const height = 600
const width = 800
const margins = {
    top: 10,
    bottom: 40,
    left: 40,
    right: 150
}
const centering = 40

let svg = d3.select("#chart").append('svg').attr('width', width).attr('height', height)
let elementGroup = svg.append('g').attr('class', "elementGroup")
let axisGroup = svg.append('g').attr('class', "axisGroup")
let xAxisGroup = axisGroup.append('g').attr('class', "xAxisGroup").attr("transform", `translate(${margins.left}, ${height - margins.bottom})`)
let yAxisGroup = axisGroup.append('g').attr('class', "yAxisGroup").attr("transform", `translate(${margins.left}, ${margins.top})`)
let legendGroup = svg.append('g').attr('id', 'legendGroup').attr('transform', `translate(${width - margins.right + 35}, ${height - margins.bottom - 180})`)
let legendBack = legendGroup.append('rect')
                        .attr('id', "legendBack")
                        .attr('width', margins.right - 35)
                        .attr('height', 120)
                        .attr('x', 0)
                        .attr('y', 0)

let legendTitle = legendGroup
    .append('text')
        .attr('class', 'legendText legendTitle')
        .text('EU member')
        .attr('text-anchor', 'middle')
        .attr('x', 55)
        .attr('y', 20)


let x = d3.scalePoint().range([0, width - margins.left - margins.right])
let y = d3.scaleLinear().range([height - margins.top - margins.bottom, 0])
// let y = d3.scaleLinear().range([0, height - margins.top - margins.bottom])

let xAxis = d3.axisBottom().scale(x)
let yAxis = d3.axisLeft().scale(y)

let barSeparation;
let barWidth;
let barHeight = height - margins.top - margins.bottom;

function drawBar(group) {
    group.append('rect')
        .attr('class', d => `bar ${d.country} ${d.EU_member ? "EU" : 'non_EU'}`)
        .attr('width', barWidth)
        .attr('x', (d, i, a) => (barWidth) * i)
        .attr('y', d => barHeight)
        .transition().duration(1000)
        .attr('height', d => barHeight - y(d.population))
        .attr('y', d => y(d.population))
}

function updateBars(bars) {
    bars
        .attr('width', barWidth)
        .attr('x', (d, i, a) => (barWidth) * i)
        .transition().duration(1000)
        .attr('height', d => barHeight - y(d.population))
        .attr('y', d => y(d.population))
}

function hideElse(e) {
    let selected = e
    let allBars = d3.selectAll('.bar')
    allBars.classed("hide", (d, i, a) => !a[i].classList.contains("EU") == selected);
}

function showAll(e) {
    let selected = e
    let allBars = d3.selectAll('.bar')
    allBars.classed("hide", d => false);
}

function drawLegend(group) {
    let legendItem = group.append('g').attr('class', 'legendItem')
        .attr('transform', (d, i) => `translate(${14}, ${60 + i * 30})`)
        .on('mouseover', hideElse)
        .on('mouseout', showAll)

    legendItem.append('circle')
        .attr('class', d => `legend ${d ? 'EU' : 'non_EU'}`)
        .attr('r', 7)

    legendItem.append('text')
        .attr('class', 'legendText')
        .text(d => d ? "EU member" : "non member")
        .attr('x', 10)
        .attr('y', 4)
}

d3.csv('data.csv').then(data=>{
    data.forEach(d => {
        d.population = +d.population
        d.EU_member = d.EU_member == 'yes' ? true :false
    })

    barSeparation = 0
    barWidth = ((width - margins.left - margins.right - centering) / data.length)
     
    let extent = d3.extent(data.map(d => d.population))
    let dom = data.map(d => d.country)
    dom.push("")
    dom.splice(0, 0, " ")
    x.domain(dom)
    y.domain([0, extent[1]])
    
    xAxisGroup.call(xAxis)
    yAxisGroup.call(yAxis)

    elementGroup.attr("transform", `translate(${margins.left + (centering / 2)}, ${margins.top})`)
    
    elementGroup.selectAll('rect').data(data).enter().call(drawBar)
    elementGroup.call(updateBars)
    elementGroup.exit().remove()


    // legend:
    let EU_member = data.map(d => d.EU_member)
    legendGroup.selectAll('.legendItem').data([...new Set(EU_member)]).enter().call(drawLegend)

    // console.log(data);
})
