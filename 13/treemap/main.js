const width = 500
const height = 500

const svg = d3.select("#chart").append("svg").attr("id", "svg").attr("width", width).attr("height", height)
const elementGroup = svg.append("g").attr("id", "elementGroup")

let data
d3.json("data.json").then(_data => {
    let root = d3.hierarchy(_data).sum(d => d.sales)
    let treemap = d3.treemap()
        .size([width, height])
        .padding(2)
        // .tile(d3.treemapSquarify.ratio(4))
    data = treemap(root)
    // console.log(data)

    elementGroup.selectAll("rect").data(root.leaves())
        .enter()
        .append("rect")
            .attr("class", d => d.parent.data.division.replaceAll(" ", ""))
            .attr("x", d => d.x0)
            .attr("y", d => d.y0)
            .attr("width", d => d.x1 - d.x0)
            .attr("height", d => d.y1 - d.y0)
            .on("mouseover", showTip)
            .on("mouseout", hideTip)

    elementGroup.selectAll("text").data(root.leaves())
        .enter()
        .append("text") 
            .attr("x", d => d.x0 + 2)
            .attr("y", d => d.y0 + 10)
            .text(d => `${d.data.division}: ${d.value}`)

})

function showTip() {
    d3.selectAll("rect").classed("soft", true)
    d3.select(this).classed("soft", false)
}

function hideTip() {
    d3.selectAll("rect").classed("soft", false)
}

