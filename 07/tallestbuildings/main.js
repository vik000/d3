var margin = {top: 20, right: 20, bottom: 120, left: 40},
    width = 1300 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);
var y = d3.scale.linear().range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(15).tickSize(-width);

var svg = d3.select("#svg").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.json("data.json", function(error, data) {
    data = data.buildings;
    data.forEach(function(d) {
        d.height = +d.height;
    });
    console.log(data);
  
    x.domain(data.map(function(d) { return d.name; }));
    y.domain([0, d3.max(data, function(d) { return d.height; })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis)
    .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-90)" );

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
    .append("text")
        .attr("transform", "translate(20, -10)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Height (m)");

    svg.selectAll("image")
        .data(data)
    .enter().append("svg:image")
        .attr('href', function(d){ return `buildings/${d.image}`; })
        .attr("x", function(d) { return x(d.name) + ((-this.getBBox().width + x.rangeBand())/2); })
        .attr("width", function(d, i, a) {return this.getBBox().width + 4;})
        .attr("y", function(d) { return y(d.height); })
        .attr("height", function(d) { return height - y(d.height); });

});