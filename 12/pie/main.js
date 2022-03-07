// constants:
const width = 450
const height = 450
const margin = 20
const radius = (width - (2 * margin)) / 2

// define SVG
const svg = d3.select("#chart").append('svg').attr('id', 'svg')
    .attr("width", width).attr("height", height)

const elementGroup = svg.append('g').attr('id', "elementGroup")
    .attr('transform', `translate(${width/2}, ${height/2})`)

// pie scales:
let pie = d3.pie().value(function(d) {
    return d.value 
})

d3.json('data.json').then(_data => {
    // data transform
    let data = pie(d3.entries(_data))

    // data binding:
    let sector = elementGroup.selectAll('.sector').data(data)

    sector.enter().append('path')
        .attr('class', 'sector')
        .attr('d', d3.arc()
            // .innerRadius(0)
            .innerRadius(radius - 40)
            .outerRadius(radius)
        )

})