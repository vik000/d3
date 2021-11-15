// const:
const totalHeight = 300
const totalWidth = 700
const margins = {
    top: 30, 
    right: 10, 
    bottom: 35, 
    left: 40
}

const width = totalWidth - margins.left - margins.right
const height = totalHeight - margins.top - margins.bottom

let parseTime = d3.timeParse('%Y%m%d')
let bisectDate = d3.bisector(function(d) {
    return d.date
}).left
let formatTime = d3.timeFormat('%A %d %B %Y')
let getWeek = d3.timeFormat('%W')

let x = d3.scaleTime().range([0, width]);
let y = d3.scaleLinear().range([height, 0]);

let xAxis = d3.axisBottom().scale(x); //.ticks(d3.timeDay.every(7))
let yAxis = d3.axisLeft().scale(y);

let svg = d3.select("div#chart").append('svg')
    .attr('id', "chart")
    .attr('width', totalWidth)
    .attr('height', totalHeight);


let xAxisGroup = svg.append('g')
    .attr('class', 'x axis')
    .attr('id', `xAxisGroup`)
    .attr('transform', `translate(${margins.left}, ${height + margins.top})`);

let yAxisGroup = svg.append('g')
    .attr('transform', `translate(${margins.left}, ${margins.top})`)
    .attr('class', 'y axis');

let customYAxis = function customYAxis(g) {
    g.transition().call(yAxis.tickSizeOuter(0));
};

let customXAxis = function customXAxis(g) {
    g.transition().call(xAxis);
    g.select('.domain').remove();
    g.selectAll('.tick').each(function(d, i) {
        // console.log(d.getDay());
        if (getWeek(d) == '51') {
            d3.select(this).select('text').style('font-size', 16).style('font-weight', 'bold');
        }
    });
};

// lines and areas:
let groupLine = svg.append('g')
    .attr('id', `lineGroup`)
    .attr('transform', `translate(${margins.left}, ${margins.top})`);

let clipBelow = groupLine.append('clipPath').attr('id', `clip-below`).append('path');
let clipAbove = groupLine.append('clipPath').attr('id', `clip-above`).append('path');
let areaAbove = groupLine.append('path')
    .attr('class', `area above`)
    .style('fill', 'red')
    .style('opacity', 0.2)
    .attr('clip-path', `url(#clip-above)`);

let areaBelow = groupLine
    .append('path')
    .attr('class', `area below`)
    .style('fill', 'red')
    .style('opacity', 0.2)
    .attr('clip-path', `url(#clip-below)`);

let chartLine2 = groupLine
    .append('path')
    .attr('id', `line2`)
    .attr('class', `line2`)
    .style('stroke', 'red')
    .style('opacity', 0.1);

let chartLine = groupLine
    .append('path')
    .attr('id', `line`)
    .attr('class', `line`)
    .style('stroke', 'red')
    .style('opacity', 0.8);

// Tooltip:
let focusContainer = svg.append('g')
    .attr('transform', `translate(${margins.left},${margins.top})`);

let focus = focusContainer.append('g').attr('class', `focus`);

let tipLine = focus.append('line')
    .attr('class', `x-hover-line hover-line tip-yLine`)
    .style('stroke', 'red')
    .style('stroke-width', '2px')
    .style('stroke-dasharray', '3,3')
    .attr('y1', 0)
    .attr('y2', height);

focus.append('circle')
    .attr('id', `AI-tip-circle`)
    .attr('class', `AI circulo`)
    .attr('stroke', 'red')
    .style('fill', '#fff')
    .attr('r', 7.5);

focus.append('circle')
    .attr('id', `NONE-tip-circle`)
    .attr('class', `AI circulo`)
    .attr('stroke', 'red')
    .style('fill', '#fff')
    .attr('r', 7.5);

focus.append('text')
    .attr('id', `AI-tip-text`)
    .attr('class', `tip-text`)
    .attr('x', 15)
    .attr('dy', '.31em')
    .style('font-family', 'Arial, Helvetica, sans-serif');

focus.append('text')
    .attr('id', `NONE-tip-text`)
    .attr('class', `tip-text`)
    .attr('x', 15)
    .attr('dy', '.31em')
    .style('font-family', 'Arial, Helvetica, sans-serif');

focus.append('text')
    .attr('id', `performance`)
    .attr('x', 0)
    .attr('dy', '20px')
    .style('font-family', "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif")
    .style('font-size', '3.6em');

focus.append('text')
    .attr('id', `exactDate`)
    .attr('x', 0)
    .attr('dy', '.31em')
    .style('opacity', '0')
    .style('font-family', 'Arial, Helvetica, sans-serif');

let overlay = svg.append('rect')
    .attr('id', `overlay`)
    .attr('class', `overlay`)
    .attr('transform', `translate(${margins.left}, ${margins.top})`)
    .attr('width', width)
    .attr('height', height)
    .style('fill', 'transparent')
    .on('mouseover', function() {
        self.focus.style('display', null);
        d3.select(`.area.above`).attr('class', `area above areaSelection`);
        d3.select(`.area.below`).attr('class', `area below areaSelection`);
        d3.select(`#line`).attr('class', `line-lineSelect`);
        d3.select(`#line2`).attr('class', `line2-lineSelect`);
    });

d3.json('data.json').then(data=>{
    console.log(data)
})