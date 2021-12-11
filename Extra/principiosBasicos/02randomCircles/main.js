const width = 500
const height = 500

const svg = d3.select("#chart").append('svg').attr("width", width).attr("height", height)

const colourList = ["#1ecbe1", "#961EE1", "#E1341E", "#6AE11E"]
d3.select("#newCircle").on('click', function() {
    svg.append('circle').attr('r', Math.random() * 10)
        .attr("cx", Math.random() * width)
        .attr("cy", Math.random() * height)
        .attr("fill", colourList[Math.floor(Math.random() * colourList.length)])
})
