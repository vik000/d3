const width = 900
const height = 500

const margins = {
    left: 40,
    right: 10, 
    top: 10,
    bottom: 90
}

let svg = d3.select('#chart').append('svg').attr('height', height).attr('width', width).style('background-color', 'azure')
let elementGroup = svg.append('g').attr('id', 'elementGroup')

let x = d3.scaleTime().range([0, width - margins.left - margins.right])
let y = d3.scaleLinear().range([height - margins.top - margins.bottom, 0])

const formatTime = d3.timeParse("%Y-%m-%d")

d3.csv('data.csv').then(data=>{
    data.forEach(d => {
        d.date = formatTime(d.date);
        d.price = +d.price
    });

    x.domain(d3.extent(data.map(d => d.date)))
    y.domain(d3.extent(data.map(d => d.price)))
    console.log(data)

    elementGroup.datum(data)
        .append('path')
            .attr('fill', 'none')
            .attr('stroke', 'black')
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(d => x(d.date))
                .y(d => y(d.price))
            )
})


// brushes
// elementGroup.call(d3.brush()
//     .extent([[0, 0], [width, height]])
//     .on("start end", highlight)
// ) 

// function isBrushed(extent, d) {
//     if (extent[0][0] <= d.x && extent[1][0] >= d.x &&
//         extent[0][1] <= d.y && extent[1][1] >= d.y) {
//             return true
//         }
// }

// function highlight() {
//     extent = d3.event.selection
//     d3.select(this).selectAll('circle').each((d, i, a)=>{
//         let item = d3.select(a[i])
//         item.classed('selected', isBrushed(extent, d))
//     })
// }

