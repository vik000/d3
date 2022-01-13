let queryObject = {}

let button = d3.select("button#send").on("click", function() {
    d3.selectAll("label.menu").nodes().forEach(label => {
        let field = label.innerText
        let fieldId = d3.select(label).attr("for")
        let read = d3.select(`input#${fieldId}`).node().value
        if(isNaN(read)) {
            alert(`please ${field.toLowerCase()} as number`)
        } else {
            queryObject[fieldId] = +read
        }
    })
    getData(queryObject)
})

function getData(queryObject) {
    d3.json("http://localhost:8000/random-rolls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            rolls: queryObject.rollInput,
            dice: queryObject.diceInput
        })
    }).then(data => {
        update(data)
    })
}

function update(data) {
    data = data.rolls
    x.domain(d3.extent(data))
    xAxisGroup.transition().duration(1000).call(xAxis)

    // histogram:
    let histogram = d3.histogram() // this has been replaced for d3.bin in version 7+
        .value(d => d)   // I need to give the vector of value
        .domain(x.domain())  // then the domain of the graphic
        .thresholds(x.ticks(queryObject.binsInput)); // then the numbers of bins

    let bins = histogram(data)
    // ----------

    y.domain([0, d3.max(bins, d => d.length)])
    yAxisGroup.transition().duration(1000).call(yAxis)
    
    brushGroup.call(brush)

    let bars = elementGroup.selectAll('rect').data(bins)
    bars.enter().append("rect")
        .attr('class', "bar")
        .attr('fill', "steelblue")
        .attr("x", d => x(d.x0))
        .attr("width", d => x(d.x1) - x(d.x0))
        .attr("y", d => height - margin.bottom)
        .transition()
        .duration(1000)
        .attr("y", d => y(d.length))
        .attr("height", d => height - y(d.length) - margin.top - margin.bottom)

    bars
        // .attr('fill', "red")
        .transition()
        .duration(1000)
        .attr("x", d => x(d.x0))
        .attr("width", d => x(d.x1) - x(d.x0))
        .attr("y", d => y(d.length))
        .attr("height", d => height - y(d.length) - margin.top - margin.bottom)
    
    bars.exit().remove()
}

// chart:
const width = 800
const height = 600
const margin = {
    top: 10, 
    bottom: 40,
    left: 40, 
    right:10
}
const svg = d3.select("#chart").append("svg").attr("width", width).attr("height", height)
let elementGroup = svg.append("g").attr("id", "elementGroup").attr("transform", `translate(${margin.left}, ${margin.top})`)
let brushGroup = svg.append("g").attr("id", "brushGroup")
// let overlayControl = svg.append("rect")
//     .attr("id", "overlayControl")
//     .attr("width", width - margin.left - margin.right)
//     .attr("height", height - margin.top - margin.bottom)
//     .attr("transform", `translate(${margin.left}, ${margin.top})`)
//     .attr("fill", "transparent")
//     .on("mousemove", trackMouse)
//     .on("mousedown", showBrush)
//     .on("mouseup", hideBrush)

let axisGroup = svg.append("g").attr("id", "axisGroup")
let xAxisGroup = axisGroup.append("g").attr("id", "xAxisGroup").attr("transform", `translate(${margin.left}, ${height - margin.bottom})`)
let yAxisGroup = axisGroup.append("g").attr("id", "yAxisGroup").attr("transform", `translate(${margin.left}, ${margin.top})`)

let x = d3.scaleLinear().range([0, width - margin.left - margin.right])
let y = d3.scaleLinear().range([height - margin.top - margin.bottom, 0])

let xAxis = d3.axisBottom().scale(x)
let yAxis = d3.axisLeft().scale(y)

let brush = d3.brushX()
    .extent([[margin.left, margin.top], [width - margin.right, height - margin.bottom]])
    .on("brush end", selectBins)

function selectBins() {
    extent = d3.event.selection
    inf = x.invert(extent[0] - margin.left)
    sup = x.invert(extent[1] - margin.left)
    totalSelected = []
    binRange = []
    elementGroup.selectAll('rect').each((d, i, a)=>{
        let item = d3.select(a[i])
        item.classed('selected', function(d) {
            if(d.x0 >= inf && d.x1 <= sup) {
                totalSelected.push(d.length)
                binRange.push(d.x0)
                binRange.push(d.x1)
                return true
            }
        })
    })
    rangeTip(totalSelected.reduce((a, b) => a + b, 0), d3.extent(binRange))
};


function rangeTip(frequency, binRange) {
    d3.select("#frequency").text(frequency)
    d3.select("#binRange").text(`${binRange[0]} -> ${binRange[1]}`)

};

// function trackMouse() {
//     mouse = d3.mouse(this)
//     console.log(mouse)
// }

// // function showBrush(){
// //     overlayControl.attr("display", "none")
// //     // evt = 
// //     // .dispatchEvent()
// // }

// // function hideBrush() {

// // }

// function showTip() {
//     d3.selectAll("rect.bar").classed("selected", false)
//     d3.select(this).classed("selected", true)
// };

// function hideTip() {
//     d3.selectAll("rect.bar").classed("selected", false)
// }