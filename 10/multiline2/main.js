//const:
const width = 800
const height = 600
const margins = {
    top: 10,
    bottom: 40, 
    left: 40,
    right: 40
}
const duration = 1000

let svg = d3.select('div#chart').append('svg').attr("width", width).attr("height", height)
let elementGroup = svg.append('g').attr('id', "elementGroup").attr('transform', `translate(${margins.left}, ${margins.top})`)

let y = d3.scaleLinear().range([height - margins.top - margins.bottom, 0])
let x = d3.scaleTime().range([0, width - margins.left - margins.right])
const formatTime = d3.timeParse("%Y")

let axisGroup = svg.append('g').attr('id', 'axisGroup')
let xAxisGroup = axisGroup.append('g').attr('id', 'xAxisGroup').attr('transform', `translate(${margins.left}, ${height - margins.bottom})`).transition().duration(duration)
let yAxisGroup = axisGroup.append('g').attr('id', 'yAxisGroup').attr('transform', `translate(${margins.left}, ${margins.top})`).transition().duration(duration)

let xAxis = d3.axisBottom().scale(x)
let yAxis = d3.axisLeft().scale(y)

// legend
let legendGroup = d3.select('div#chart').append('div').attr('id', 'legendGroup')
const colour = d3.scaleOrdinal()

// zero:
let noDataScreen = svg.append("g").attr("id", "noDataScreen")
    .attr("class", "hidden")
noDataScreen.append("rect").attr("width", width).attr("height", height).attr("fill", "rgba(255, 255, 255, 1)")
noDataScreen.append("text")
    .attr('text-anchor', 'middle')
    .attr("transform", `translate(${width/2}, ${height/2})`)
    .text("no data to display")

let data;
d3.csv('data.csv').then(_data => {
    _data.forEach(d => {
        d.year = formatTime(d.year)
        d.amount = +d.amount
        d.perc = +d.perc
    });

    data = d3.nest()
        .key(function (d) { return d.name; })
        .entries(_data);

    data.map((k, i) => {
        let divPretty = legendGroup.append('div')
            .attr('id', k.key)
            .attr('class', `pretty p-default p-round p-smooth ${k.key}`)
            .attr('selected', `false`)
            .on('click', toggleLine)
        
        divPretty
            .append('input').attr('type', 'checkbox')

        divPretty
            .append('div').attr('class', `state`)
            .append('label').text(k.key)
    })

    colour.domain(data.map(d=>d.key))
    // rangeFn = d3.scaleSequential().domain([0, data.length]).interpolator(d3.interpolateViridis)
    // rangeFn = d3.scaleSequential().domain([0, data.length]).interpolator(d3.interpolateSpectral)
    rangeFn = d3.scaleSequential().domain([0, data.length]).interpolator(d3.interpolatePlasma)
    range = Array.from(data, (d, i) => rangeFn(i))
    colour.range(range)

    Object.values(document.styleSheets).forEach(link => {
        if(link.href.includes("style.css")){
            colour.domain().forEach(name => {
                link.insertRule(`.pretty.${name} input:checked~.state label:after {background-color: ${colour(name)}!important;}`, 0);
            })
        }
    })
    
    update(data)
})

function update(data) {
    let allvals = data.map(d=>d.values).reduce((a, b) => a.concat(b))
    x.domain(d3.extent(allvals.map(d => d.year)))
    y.domain(d3.extent(allvals.map(d => d.amount)))

    xAxisGroup.call(xAxis)
    yAxisGroup.call(yAxis)

    lines = elementGroup.selectAll('path.line').data(data)
    lines.enter().call(drawLines)
    lines.call(updateLines)    
    lines.exit().call(removeLines)
}

function drawLines(selection) {
    line = selection.append("path")
        .attr("id", d=>`${d.key}`)
        .attr("class", d=>`line ${d.key}`)
        .attr("stroke", (d, i)=>colour(d.key))
    line.datum(d => d.values)
        .transition().duration(duration)
        .attr("d", d3.line()
            .x(d=>x(d.year))
            .y(d=>y(d.amount))
            )
}

function removeLines(selection) {
    selection.each((data, i, a) => {
        line = d3.select(a[i])
        line
            .transition()
            .duration(duration)
            .attr("d", d3.line().x(d=>x(0)).y(d=>y(0)))
            .transition()
            .duration(duration)
            .attr("stroke", "rgba(250,250,250,0)")
    })
}

function updateLines(selection) {
    selection.each((data, i, a) => {
        line = d3.select(a[i])
        line
            .datum(data.values)
            .transition()
            .duration(duration)
            .attr("stroke", (d, i)=>colour(data.key))
            .attr("d", d3.line()
                .x(d=>x(d.year))
                .y(d=>y(d.amount))
            )
    })
}

function toggleLine() {
    element = d3.select(this)
    if (element.attr("selected") == "false") {
        element.attr("selected", "true")
    } else {
        element.attr("selected", "false")
    }
    selected = legendGroup.selectAll("div.pretty").nodes()
        .filter(d => d.getAttribute('selected') == "true")
        .map(d => d.id)
    filteredData = data.filter(d => selected.includes(d.key))
    if(filteredData.length != 0){
        noDataScreen.classed("hidden", true)
        update(filteredData)
    } else {
        noDataScreen.classed("hidden", false)
    }
}