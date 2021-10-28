let svg = d3.select('div#chart').append('svg').attr('width', 600).attr('height', 200)

let rect = svg.append('rect').attr('id', 'bar')
    .attr('x', 10)
    .attr('y', 10)
    .attr('width', 50)
    .attr('height', 20)

let circle = svg.append('circle').attr('id', 'dot')
    .attr('cx', 100)
    .attr('cy', 40)
    .attr('r', 20)

let line = svg.append('line').attr('id', 'line')
    .attr('x1', 0)
    .attr('y1', 80)
    .attr('x2', 800)
    .attr('y2', 80)

let path = svg.append('path').attr('id', 'path')
    .attr('d', "M 100 100 H 190 V 190 H 100 Z")


