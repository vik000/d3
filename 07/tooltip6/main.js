const data = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]
const svg = d3.select('svg#chart')
const colours = {
    'static': 'cadetblue',
    'active': 'darkred'
}

const group = svg.append('g').attr('id', 'elementGroup')
// Skipping scale as data is arbitrary

function drawBar(group){
    let element = group.append('g')

    element.append('rect')
        .attr('height', 40)
        .attr('class', 'bar')
        .attr('x', 0)
        .attr('y', (d, i) => 60 * i)
        .transition().duration(1000)
        .attr('width', d => d)
        .attr('fill', colours['static'])

    element.append('text')
        .text(d => d)
        .attr("x", d => d + 5)
        .attr("y", (d, i) => (60 * i) + 25)
        .style("visibility", "hidden")


    element
        // .on('mouseover', activate)
        // .on('mouseout', deactivate)
        .on('mousemove', moveTip)
}

group.selectAll('g').data(data).enter()
    .call(drawBar)

let tooltip = svg.append('g').attr('id', 'movingTip').attr('visibility', 'hidden')
    tooltip.append('rect')
        .attr('fill', 'white')
        .attr('stroke', 'black')
        .attr('width', 45)
        .attr('height', 30)
    tooltip.append('text')
        .attr('x', 10)
        .attr('y', 22)
        .style('font', 'bold 20px sans-serif')
        .text('')

function activate(d, i, a) {
    let item = d3.select(this)
 
    let r = item.select('rect')
    r.attr('fill', colours['active'])


    let tip = item.select('text')
    tip.style('visibility', 'visible')
}

function deactivate(d, i, a) {
    let item = d3.select(this)
 
    let r = item.select('rect')
    r.attr('fill', colours['static'])

    let tip = item.select('text')
    tip.style('visibility', 'hidden')
}

function moveTip(e, d) {
    let mouse = d3.pointer(e)
    tooltip.attr('transform', `translate(${mouse[0] + 3}, ${mouse[1] - 35})`)
    tooltip.attr('visibility', 'visible')
    tooltip.select('text').text(d)
}