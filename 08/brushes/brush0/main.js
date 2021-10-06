const width = 600
const height = 600
const colours = {
    'static': 'darkslategrey',
    'active': 'mediumvioletred'
}

let svg = d3.select('#chart').append('svg').attr('height', height).attr('width', width).style('background-color', 'azure')
let dot = svg.append('circle').attr('r', 10).attr('cx', width / 2).attr('cy', height / 2).attr('fill', colours['static'])


// brushes
svg.call(d3.brush()
    .extent([[0, 0], [width, height]])
    .on("start end", update)
) 

function update(d, i, a) {
    extent = d3.event.selection
    isBrushed = extent[0][0] <= dot.attr('cx') && extent[1][0] >= dot.attr('cx') &&
                extent[0][1] <= dot.attr('cy') && extent[1][1] >= dot.attr('cy')
    
    // console.log('A', extent[0])
    // console.log('B', extent[1])
    // console.log(isBrushed)
    if (isBrushed) {
        dot.attr('fill', colours['active'])
    } else {
        dot.attr('fill', colours['static'])
    }
}

