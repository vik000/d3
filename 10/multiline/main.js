//const:
const width = 800
const height = 600
const margins = {
    top: 10,
    bottom: 40, 
    left: 40,
    right: 40
}

let svg = d3.select('div#chart').append('svg').attr("width", width).attr("height", height)
let elementGroup = svg.append('g').attr('id', "elementGroup").attr('transform', `translate(${margins.left}, ${margins.top})`)

let y = d3.scaleLinear().range([height - margins.top - margins.bottom, 0])
let x = d3.scaleLinear().range([0, width - margins.left - margins.right])

let axisGroup = svg.append('g').attr('id', 'axisGroup')
let xAxisGroup = axisGroup.append('g').attr('id', 'xAxisGroup').attr('transform', `translate(${margins.left}, ${height - margins.bottom})`)
let yAxisGroup = axisGroup.append('g').attr('id', 'yAxisGroup').attr('transform', `translate(${margins.left}, ${margins.top})`)

let xAxis = d3.axisBottom().scale(x)
let yAxis = d3.axisLeft().scale(y)

// legend
let legendGroup = d3.select('div#chart').append('div').attr('id', 'legendGroup')
let colourCode = {
    y0: "p-primary",
    y1: "p-info",
    y2: "p-success",
    y3: "p-warning",
}

d3.csv('data.csv').then(data => {
    console.log(data)
    data.forEach(d => {
        d.x = +d.x
        d.y0 = +d.y0
        d.y1 = +d.y1
        d.y2 = +d.y2
        d.y3 = +d.y3
    });

    x.domain(d3.extent(data.map(d => d.x)))
    m0 = d3.min(data.map(d => d3.min([d.y0, d.y1, d.y2, d.y3])))
    m1 = d3.max(data.map(d => d3.max([d.y0, d.y1, d.y2, d.y3])))
    y.domain([m0, m1])

    xAxisGroup.call(xAxis)
    yAxisGroup.call(yAxis)

    for (let i = 0; i < data.columns.length - 1; i++) {
        let lineGroup = elementGroup.append('g').attr('class', `lineGroup line-${data.columns[i + 1]} hidden`)
        lineGroup.datum(data).append('path')
            .attr('d', d3.line()
                .x(d => x(d.x))
                .y(d => y(d[`y${i}`]))
            )
        
        let divPretty = legendGroup.append('div').attr('class', `pretty p-default p-round p-smooth y${i}`)
            .on('click', toggleLine)
        
        divPretty
            .append('input').attr('type', 'checkbox')

        divPretty
            .append('div').attr('class', `state ${Object.values(colourCode)[i]}`)
            .append('label').text(Object.keys(colourCode)[i])
    }
})

function toggleLine() {
    let element = d3.select(this)
    let target;
    selected = element.attr('selected')
    element.attr('class').split(" ").forEach(c => {
        if (/\d/.test(c)) {
            target = c;
        }
    })
    if (selected == "true") {
        d3.select(`g.line-${target}`).classed('hidden', true)
    } else {
        d3.select(`g.line-${target}`).classed('hidden', false)
    }
    element.attr('selected', selected == "true" ? "false" : "true")
}