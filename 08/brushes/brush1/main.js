const width = 600
const height = 600


let svg = d3.select('#chart').append('svg').attr('height', height).attr('width', width).style('background-color', 'azure')
let elementGroup = svg.append('g').attr('id', 'elementGroup')

d3.csv('data.csv').then(data=>{
    // console.log(data)
    elementGroup.selectAll('circle').data(data)
        .join('circle')
            .attr('class', 'static')
            .attr('r', 10)
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
})


// brushes
elementGroup.call(d3.brush()
    .extent([[0, 0], [width, height]])
    .on("start end", highlight)
) 

function isBrushed(extent, d) {
    if (extent[0][0] <= d.x && extent[1][0] >= d.x &&
        extent[0][1] <= d.y && extent[1][1] >= d.y) {
            return true
        }
}

function highlight() {
    extent = d3.event.selection
    d3.select(this).selectAll('circle').each((d, i, a)=>{
        let item = d3.select(a[i])
        item.classed('selected', isBrushed(extent, d))
    })
}

