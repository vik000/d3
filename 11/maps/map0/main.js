const width = 800
const height = 400
const margin = {
    top: 50, 
    right: 50, 
    left: 50, 
    bottom: 50
}

const svg = d3.select('#map').append('svg').attr("width", width).attr("height", height)
const elementGroup = svg.append("g").attr("id", "elementGroup")
const projection = d3.geoMercator().translate([width / 2, height / 2]).scale(100)
let path = d3.geoPath().projection(projection)

d3.json("world.topojson").then(data => {
    let countries = topojson.feature(data, data.objects.countries)
    console.log(countries)

    let map = elementGroup.selectAll("path.country").data(countries.features)
    map.call(drawMap)
})

function drawMap(selection) {
     selection.enter()
        .append('path')
            .attr('class', 'country')
            .attr("d", path)
            .on("mouseover", function() {
                d3.selectAll("path.country").classed("hover", false)
                d3.select(this).classed("hover", true)
            })
}