    
d3.csv("data.csv").then(d => plot(d))


function plot(data) {

	var cols = data.columns.slice(1);

	var svg = d3.select("#svg");
    var margin = {top: 35, left: 35, bottom: 0, right: 0};
    var width = +svg.attr("width") - margin.left - margin.right
    var height = +svg.attr("height") - margin.top - margin.bottom;

	var x = d3.scaleBand()
		.range([margin.left, width - margin.right])
		.padding(0.08)

	var y = d3.scaleLinear()
		.rangeRound([height - margin.bottom, margin.top])

	var xAxis = svg.append("g")
		.attr("transform", `translate(0,${height - margin.bottom})`)
		.attr("class", "x-axis")

	var yAxis = svg.append("g")
		.attr("transform", `translate(${margin.left},0)`)
		.attr("class", "y-axis")

	var c = d3.scaleOrdinal()
		.range(["data1", "data2", "data3"])
		.domain(cols);

	update(data, 0);

	function update(data, speed) {

		data.forEach(function(d) {
			d.total = d3.sum(cols, k => +d[k])
			return d
		})

		y.domain([0, d3.max(data, d => d3.sum(cols, k => +d[k]))]).nice()

		svg.selectAll(".y-axis").transition().duration(speed)
			.call(d3.axisLeft(y).ticks(null, "s"))

		x.domain(data.map(d => d.Cat));

		svg.selectAll(".x-axis").transition().duration(speed)
			.call(d3.axisBottom(x).tickSizeOuter(0))

		var group = svg.selectAll("g.layer")
			.data(d3.stack().keys(cols)(data), d => d.key)

		group.exit().remove()

		group.enter().append("g")
			.classed("layer", true)
			.attr("class", d => c(d.key) + ' layer')

		var bars = svg.selectAll("g.layer").selectAll("rect")
			.data(d => d, i => i.data.Cat);

		bars.exit().remove()

		bars.enter()
            .append("rect")
			.attr("width", x.bandwidth())
			.merge(bars)
		.transition().duration(speed)
			.attr("x", d => x(d.data.Cat))
			.attr("y", d => y(d[1]))
			.attr("height", d => y(d[0]) - y(d[1]))
	}

}

var select = d3.select("#style")
.on("change", function() {
    d3.select('#pagestyle').attr('href', `${this.value}.css`);
}) 
