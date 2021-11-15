let sizeScale = d3.scaleLinear().range([10, 60])
// let colorScale = d3.scaleSequential(d3.interpolateViridis())

d3.csv('data.csv').then(data => {
    data.map(d => {
        d.Goals = +d.Goals
        d.Rank = +d.Rank
        d.Ratio = +d.Ratio
        d.Apps = +d.Apps
    })
    
    // console.log(data)
    let colorScale = function(d) {
        nationalities = data.map(d => d["Nat."]);
        lineScale = d3.scalePoint().range([0,1]).domain(nationalities)
        return d3.interpolateViridis(lineScale(d))
    }
    sizeScale.domain(d3.extent(data.map(d => d.Goals)))

    // players = data.map(d => d.Player)
    run(data)
})


function run(data) {
    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 450 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
    // Wordcloud features that are different from one word to the other must be here
    var layout = d3.layout.cloud()
        .size([width, height])
        .words(data.map(function(d) { 
            return {
                text: d.Player,
                goals: d.Goals,
                nat: d["Nat."],
            }
        }))
        .rotate(function() { return ~~(Math.random() * 2) * 90})
        .padding(5)        //space between words
        .fontSize(d => sizeScale(d.goals))      // font size of words
        .on("end", draw);
    layout.start();

    // This function takes the output of 'layout' above and draw the words
    // Wordcloud features that are THE SAME from one word to the other can be here
    function draw(players) {
        svg.append("g")
            .attr("transform", `translate(${layout.size()[0] / 2}, ${layout.size()[1] / 2})`)
            .selectAll("text")
                .data(players)
            .enter().append("text")
                .style("font-size", d => sizeScale(d.goals))
                .attr('class', d => d.nat)
                .attr("text-anchor", "middle")
                .style("font-family", "Impact")
                .attr("transform", function(d) {
                    return `translate(${[d.x, d.y]}), rotate(${d.rotate})`;
                })
                .text(function(d) { return d.text; });
    }
}