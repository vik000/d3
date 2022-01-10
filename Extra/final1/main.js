const diCaprioBirthYear = 1974;
const age = function(year) { return year - diCaprioBirthYear}
const today = new Date().getFullYear()
const ageToday = age(today)

// ----------------------------------------------------------
const width = 700;
const height = 500;
const margin = {
    'top': 50,
    'bottom': 20,
    'left': 20,
    'right': 10
}

const svg = d3.select('#chart').append('svg').attr("width", width).attr("height", height).attr('id', "svg")
const elementGroup = svg.append('g').attr('id', "elementGroup").attr('transform', `translate(${margin.left}, ${margin.top})`)
const axisGroup = svg.append('g').attr('id', "axisGroup")
const xAxisGroup = svg.append('g').attr('id', "xAxisGroup").attr('transform', `translate(${margin.left}, ${height - margin.bottom})`)
const yAxisGroup = svg.append('g').attr('id', "yAxisGroup").attr('transform', `translate(${margin.left}, ${margin.top})`)

let x = d3.scaleBand().range([0, width - margin.left - margin.right]).padding(0.1)
let y = d3.scaleLinear().range([height - margin.top - margin.bottom, 0])

let xAxis = d3.axisBottom().scale(x)
let yAxis = d3.axisLeft().scale(y)

let tipGroup = svg.append('g').attr('id', "tipGroup").attr('transform', `translate(${width / 2}, ${30})`)
let tipName = tipGroup.append('text').attr('id', "tipName").attr("x", -200)
let tipAge = tipGroup.append('text').attr('id', "tipAge")
let tipDifference = tipGroup.append('text').attr('id', "tipDifference").attr("x", 200)

d3.csv('data.csv').then(data=>{
    data.map(d => {
        d.year = +d.year
        d.age = +d.age
    })
    x.domain(data.map(d => d.year))
    y.domain([15, ageToday])

    xAxisGroup.call(xAxis)
    yAxisGroup.call(yAxis)

    names = Array.from(new Set(data.map(d=>d.name))) // esto es una forma de asegurar una lista de nombres únicos (sin repetición)
    const colour = d3.scaleSequential().domain([0, names.length])
        .interpolator(d3.interpolateViridis);

    // mis barras tienen la punta redondeada, por puro estilismo, eso complica un poco las cosas, porque voy a añadir circulos
    // let dots = elementGroup.selectAll('circle').data(data)
    // dots.enter().append('circle')
    //     .attr('class', d => `bar ${d.name.replace(" ", "_")}`) // con esto también se pueden añadir colores
    //     .attr('cx', d => x(d.year) + x.bandwidth() / 2)
    //     .attr('cy', d => y(d.age) + x.bandwidth() / 2)
    //     .attr('r', x.bandwidth() / 2)
    //     .attr('fill', d => colour(names.findIndex(name => d.name == name)))
        
    let bars = elementGroup.selectAll('rect').data(data)
    bars.enter().append('rect')
        .attr('class', d => `bar ${d.name.replace(" ", "_")}`)
        .attr('x', d => x(d.year))
        // .attr('y', d => y(d.age) + x.bandwidth() / 2)
        .attr('y', d => y(d.age))
        .attr('width', x.bandwidth())
        // .attr('height', d => height - y(d.age) - margin.top - margin.bottom - x.bandwidth() / 2)
        .attr('height', d => height - y(d.age) - margin.top - margin.bottom)
        .attr('fill', d => colour(names.findIndex(name => d.name == name)))
        .on('mouseover', showTip)
        .on('mouseout', hideTip)

    // let myLineFn = d3.line().x(d => x(`${d.year}`) + (x.bandwidth()/2)).y(d => y(age(d.year)))

    // let line = elementGroup.datum(data)
    // line.append('path')
    // .attr('id', 'diCaprio')
    // .attr('d', myLineFn)
    
    let line = elementGroup.datum(data)
    line.append('path')
        .attr('id', 'diCaprio')
        .attr('d', d3.line()
            .x(d => x(`${d.year}`) + (x.bandwidth()/2))
            .y(d => y(age(d.year)))
            )
});

function showTip(d) {
    d3.selectAll('.bar').classed('soften', true)
    d3.selectAll(`.${d.name.replace(" ", "_")}`).classed('soften', false)
    tipGroup.classed('hidden', false)
    tipName.text(`Name: ${d.name}`)
    tipAge.text(`Age: ${d.age}`)
    tipDifference.text(`Age Difference: ${age(d.year) - d.age}`)
}

function hideTip() {
    tipGroup.classed('hidden', true)
    d3.selectAll('.bar').classed('soften', false)
}