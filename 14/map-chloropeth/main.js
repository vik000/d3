
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
let back = elementGroup.append("rect").attr("id", "back").attr("width", width).attr("height", height).attr("fill", "transparent")
let tooltipGroup = svg.append("g").attr("id", "tooltipGroup")
tooltipGroup.append("rect").attr("width", 200).attr("height", 15).attr("fill", "white")
let tooltip = tooltipGroup.append('text').attr("id", "tooltip")

back.on("mouseover", function() {
    tooltipGroup.classed("hidden", true)
})

let colour = d3.scaleSequential().interpolator(d3.interpolateBlues); 

const projection = d3.geoMercator().translate([width / 2, height / 2]).scale(100)
let path = d3.geoPath().projection(projection)

let promises = [d3.json("world.topojson"), d3.csv('data.csv')]

Promise.all(promises).then(dataSources => {
    data = dataSources[0]
    data2 = dataSources[1]

    colour.domain(d3.extent(data2.map(d => +d["Gross public debt"])))
    countriesAlone = data2.map(d => d.Country)
    let countries = topojson.feature(data, data.objects.countries).features

    // combine both arrays: 
    countries.map(d => {
        index = countriesAlone.findIndex(name => name == d.properties.name)
        if(index != -1) {
            val = +data2[index]["Gross public debt"]
            d.properties["debt"] = val
        }
    })
    let map = elementGroup.selectAll("path.country").data(countries)
    map.call(drawMap)
})

function drawMap(selection) {
     selection.enter()
        .append('path')
            .attr('class', 'country')
            .attr("d", path)
            .attr("fill", d => d.properties.debt ? colour(d.properties.debt) : "lightgray")
            .on("mousemove", function(d) {
                mouse = d3.mouse(this)
                name = d.properties.name
                debt = d.properties.debt != undefined ? d.properties.debt : "unknown"
   
                tooltipGroup.classed("hidden", false)            
                tooltipGroup
                    .attr("transform", `translate(${mouse[0] + 20}, ${mouse[1] + 20})`)
                tooltip
                    .attr("fill", "black")
                    .attr("y", 13)
                    .text(`${name}: ${debt}%`)
                tooltipGroup.select('rect').attr("width", tooltip.node().getBoundingClientRect().width)
                if(tooltip.node().getBoundingClientRect().x + tooltip.node().getBoundingClientRect().width > width - 10){
                    tooltipGroup
                        .attr("transform", `translate(${mouse[0] - tooltip.node().getBoundingClientRect().width - 20}, ${mouse[1] + 20})`)
                }
            })
            .on("mouseover", function() {
                d3.selectAll("path.country").classed("hover", false)
                d3.select(this).classed('hover', true)
            })
            .on("mouseout", function() {
                d3.selectAll("path.country").classed("hover", false)
            })
}