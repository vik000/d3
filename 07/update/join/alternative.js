// data random function:
function fillArray(data) {
    // Add items:
    let numberOfItems = Math.ceil(Math.random() * 4)
    let i = 0
    while (i < numberOfItems) {
        data.push(Math.ceil(Math.random() * 100))
        i++
    }

    // Remove items:
    let itemsToRemove = Math.floor(Math.random() * data.length)
    i = 0
    while (i < itemsToRemove) {
        data.shift()
        i++
    }

    console.log(data)
    return data;
}

let data = [];
const svg = d3.select('#chart')
svg.attr('width', 800).attr('height', 600)
let elementGroup = svg.append('g').attr('class', 'elementGroup')
let colors = {
    'enter': 'lightblue',
    'update': 'darkgrey',
    'exit': 'red'
}

function drawBar(element) {
    element.selectAll("*").remove();
    element
        .append('rect')
            .attr('height', 40)
            .attr('class', 'bar')
            .attr('x', 60)
            .attr('y', (d, i) => 60 * i)
            .transition().duration(1000)
            .attr('width', d => d)
            .attr('fill', colors['enter'])

    element
        .append('text')
            .attr('x', 20)
            .attr('y', (d, i) => (i * 60) + 25)
            .text(d=>d)
}

function draw() {
    fillArray(data)
    
    let elements = elementGroup.selectAll('g').data(data);

    elements.join("g").call(drawBar)
}

d3.interval(draw, 2000) // data changes every 2 seconds, but may keep some elements from previous iteration.