const width = 400
const height = 400
const margins = {
    vert: 10,
    hori: 10
}

let svg = d3.select('#chart').append('svg').attr("width", width).attr("height", height)
let elementGroup = svg.append('g').attr('id', "elementGroup").attr('transform', `translate(${width/2}, ${height/2})`)
let gridGroup = svg.append('g').attr('id', 'gridGroup').attr('transform', `translate(${width/2}, ${height/2})`)
let scale = d3.scaleLinear().range([0, width/2 - margins.hori]).domain([0, 100])
let grid100 = gridGroup.append('circle').attr('class', "grid primary").attr('r', scale(100))
let grid50= gridGroup.append('circle').attr('class', "grid primary").attr('r', scale(50))
let centre = elementGroup.append("circle").attr('r', 5).attr('fill', 'red')

let path = elementGroup.append('path')

d3.csv('data.csv').then(_data=>{
    let data = _data;
    data.forEach(d=> {
        d.pace = +d.pace
        d.shot = +d.shot
        d.pass = +d.pass
        d.dribbling = +d.dribbling
        d.defending = +d.defending
        d.endurance = +d.endurance
    })

    let categories = data.columns.slice(1, data.columns.length - 1) // this defines the branches of the chart
    let angles = []
    let pathPoints = []

    categories.forEach((e, i) => {
        angles.push({cat: e, alpha: -90 + (i * (360 / categories.length))})
    });
    
    angles.forEach((d, i) => {
        lineEnd = polar(scale(110), d.alpha)
        gridGroup.append('line').attr('class', `grid line alpha${d.alpha}`)
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', lineEnd.x)
            .attr('y2', lineEnd.y)

        var coords = getCoords(d, 0)
        pathPoints.push([coords.x, coords.y])
        elementGroup.append('circle')
            .attr('r', 3)
            .attr('cx', coords.x)
            .attr('cy', coords.y)
    })

    pathPoints.push(pathPoints[0])

    path.attr("d", d3.line()(pathPoints))

    function getCoords(d, i) {
        return polar(scale(data[i][d.cat]), d.alpha)
    }
})

function polar(r, alpha) {
    pi = Math.PI
    alpha = alpha * (pi/180)
    return { 
      x: r * Math.cos(alpha),
      y: r * Math.sin(alpha)
    };
  }