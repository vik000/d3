// selección:
let svg = d3.select('div#chart').append('svg')

// atributos:
svg.attr('width', 800).attr('height', 600)


let data = [1, 1, 2, 3, 5, 8, 13]

data.forEach(function(d, i) {
    svg.append('circle')
        .attr('r', d * 8)
        .attr('cx', (i + 3) * 50)
        .attr('cy', 275)
})