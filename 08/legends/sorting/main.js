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

let xAxis = d3.axisBottom().scale(x)
let yAxis = d3.axisLeft().scale(y)

let barSeparation;
let barWidth;
let barHeight = height - margins.top - margins.bottom;

let iconParams = {
    // make a class?
    ascending: true, 
    angle: 270,
    x: width - margins.right + 10, 
    y: height - margins.bottom,
    height: 20, 
    width: 20,
    flip: function () {
        this.angle = this.ascending ? 90 : 270
        this.x = this.ascending ? width - margins.right + 10 + this.width : width - margins.right + 10
        this.y = this.ascending ? height - margins.bottom - this.height : height - margins.bottom
        this.ascending = !this.ascending
    }
}

let sortButton = svg.append('g')
    .on('click', sortChart)
    .attr('cursor', 'pointer')
    .attr('id', 'sortButton')
    .attr('transform', `translate(${iconParams.x}, ${iconParams.y}) rotate(${iconParams.angle})`)

sortButton.append('i')
    .attr('class', 'fas fa-sort-amount-up')
    .attr('width', iconParams.width)
    .attr('height', iconParams.height)

sortButton.append('rect')
    .attr('width', 25)
    .attr('height', 25)
    .attr('x', 0)
    .attr('y', 0)
    .attr('fill', 'black')
    .attr('fill-opacity', 0)

function sortChart() {
    let icon = d3.select(this)
    iconParams.flip()
    icon.attr('transform', `translate(${iconParams.x}, ${iconParams.y}) rotate(${iconParams.angle})`)
    let newData = originalData.sort(function(a, b) {
        if (iconParams.ascending) {
            return d3.descending(a.population, b.population)
        } else {
            return d3.ascending(a.population, b.population)
        }
    })
    updateChart(newData)
}


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

function updateBars(bar) {
    bar
        .attr('class', d => `bar ${d.country} ${d.EU_member ? "EU" : 'non_EU'}`)
        .transition().duration(1000)
        .attr('width', barWidth)
        .attr('x', (d, i, a) => (barWidth) * i)
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

function changeChart(e){
    let newData = originalData.filter(d=>d.EU_member == e)
    updateChart(newData)
}

function drawLegend(group) {
    let legendItem = group.append('g').attr('class', 'legendItem')
        .attr('transform', (d, i) => `translate(${14}, ${60 + i * 30})`)
        .on('mouseover', hideElse)
        .on('mouseout', showAll)
        .on('click', changeChart)

    legendItem.append('circle')
        .attr('class', d => `legend ${d ? 'EU' : 'non_EU'}`)
        .attr('r', 7)

    legendItem.append('text')
        .attr('class', 'legendText')
        .text(d => d ? "EU member" : "non member")
        .attr('x', 10)
        .attr('y', 4)
}

let originalData;
let updateChart = function(data) {
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

    let bars = elementGroup.selectAll('rect').data(data)
    bars.enter().call(drawBar)
    bars.call(updateBars)
    bars.exit().remove()
}

d3.csv('data.csv').then(data=>{
    originalData = data
    data.forEach(d => {
        d.population = +d.population
        d.EU_member = d.EU_member == 'yes' ? true :false
    })

    elementGroup.attr("transform", `translate(${margins.left + (centering / 2)}, ${margins.top})`)
    updateChart(data)

    // legend:
    let EU_member = data.map(d => d.EU_member)
    legendGroup.selectAll('.legendItem').data([...new Set(EU_member)]).enter().call(drawLegend)

    // console.log(data);
})
