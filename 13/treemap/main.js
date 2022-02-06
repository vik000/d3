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
})

