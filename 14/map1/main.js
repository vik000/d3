// constants:
const width = 500
const height = 500


// The svg
let svg = d3.select('#chart').append('svg').attr("width", width).attr("height", height)

// Map and projection
// var projection = d3.geoNaturalEarth1()
var projection = d3.geoMercator()
    // .scale(width / 1.3 / Math.PI)
    .scale(70)
    // .translate([width / 2, height / 2])
    .translate([width / 2.5, height / 2.5])

// Load external data and boot
d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then(data => {
    // console.log(data.features);
    // Draw the map
    svg.append("g")
        .selectAll("path")
        .data(data.features)
        .enter().append("path")
            .attr("fill", "#69b3a2")
            .attr("d", d3.geoPath()
                .projection(projection)
            )
            .style("stroke", "#fff")
})