const width = 400
const height = 400
const margins = 35

let svg = d3.select('#chart').append('svg').attr("width", width).attr("height", height)
let elementGroup = svg.append('g').attr('id', "elementGroup").attr('transform', `translate(${width/2}, ${height/2})`)
let gridGroup = svg.append('g').attr('id', 'gridGroup').attr('transform', `translate(${width/2}, ${height/2})`)
let tipCentreGroup = svg.append('g').attr('id', "tipTextGroup").attr('transform', `translate(${width/2}, ${height/2})`)
let tipCentre = tipCentreGroup.append('text').attr('id', "tipCentre")

let tipGroup = d3.select('#chart').append('svg').attr("width", width).attr("height", 100).append('g').attr('id', 'tipGroup')

let scale = d3.scaleLinear().range([0, width/2 - margins]).domain([0, 100])
for (let i = 0; i <= 10; i++){
    gridGroup.append('circle').attr('class', `grid ${i == 5 || i == 10 ? "primary" : "secondary"}`).attr('r', scale(10 * i))
}

let angles = []

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

    let categories = data.columns.slice(1, data.columns.length) // this defines the branches of the chart
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
        dotGroup = gridGroup.append('g').attr('class', 'categoryGroup')
            .attr('transform', `translate(${lineEnd.x}, ${lineEnd.y})`)
        dotGroup
            .append('circle').attr('class', 'category-dot')
            .attr('r', 15)
        dotGroup.append('text')
            .attr('class', 'cat-text')
            .attr('y', 5)
            .text(categoryPicker(d))

        tipCentreGroup.append('text')
            .attr('class', `skillScore ${d.cat}`)
    })

    let playerPath = elementGroup.selectAll('g.player').data(data)
    playerPath.enter().call(drawPath)

    let tip = tipGroup.selectAll("g.tip-player").data(data)
    tip.enter().call(addTips)
})

function categoryPicker(d) {
    picker = {
        pace: "PC",
        shot: "SH",
        pass: "PA",
        dribbling: "DR",
        defending: "DF",
        endurance: "EN",
    }
    return picker[d.cat]
}

function getCoords(d, a) {
    return polar(scale(d[a.cat]), a.alpha)
}

function drawPath(group) {

    let pathGroup = group.append('g').attr('class', d => `player ${d.player}`)

    angles.forEach((a, i) => {
        // data must correspond to each player!
        pathGroup.append('circle')
            .attr('class', d => `skill ${d.player} ${a.cat}`)
            .attr('r', 3)
            .attr('cx', (d, i) => getCoords(d, a).x)
            .attr('cy', (d, i) => getCoords(d, a).y)
    })

    pathGroup.append("path")
        .attr('class', function(d) {
            return `skill ${d.player}`
        })
        .attr("d", function(d, i) {
            pathPoints = []
            angles.forEach(a => {
                var coords = getCoords(d, a)
                pathPoints.push([coords.x, coords.y])
            })
            pathPoints.push(pathPoints[0]) // closes the shape perimeter
            return d3.line()(pathPoints)
        })
}

function addTips(group) {
    var playerGroup = group.append('g').attr('class', d=>`tip-player ${d.player}`)
        .attr('transform', (d, i) => `translate(${20 + (i * 100)}, ${20})`)
        .on('mouseover', d => showTip(d))
        .on('mouseout', d => hideTip(d))
    playerGroup.append('text')
        .attr('class', d =>`tip-text ${d.player}`)
        .attr('x', 35)
        .text(d=>d.player)
    playerGroup.append("svg:image")
        .attr('href', d => findImage(d.player))
        .attr('width', 70)
        .attr('x', 0)
        .attr('y', 5)
}

function findImage(player) {
    picker = {
        Pele: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Pele_by_John_Mathew_Smith.jpg/924px-Pele_by_John_Mathew_Smith.jpg",
        Zidane: "https://upload.wikimedia.org/wikipedia/commons/f/f3/Zinedine_Zidane_by_Tasnim_03.jpg",
        Cruyff: "https://upload.wikimedia.org/wikipedia/commons/6/69/Johan_Cruyff_1974c.jpg",
        Maradona: "https://upload.wikimedia.org/wikipedia/commons/2/2c/Maradona-Mundial_86_con_la_copa.JPG"
    }

    return picker[player]
}

function showTip(d) {
    fullData = d
    tipCentre.text(d.player)
    d3.selectAll('g.player').classed('soften', true)
    d3.select(`g.player.${d.player}`).classed('soften', false)
    d3.selectAll('text.skillScore').classed('hidden', false)
    d3.selectAll('text.skillScore').each(function(d, i) {
        score = d3.select(this)
        score.text(fullData[angles[i].cat])
        score.attr('transform', `translate(${getCoords(fullData, angles[i]).x}, ${getCoords(fullData, angles[i]).y})`)
    })
}

function hideTip() {
    tipCentre.text('')
    d3.selectAll('g.player').classed('soften', false)
    d3.selectAll('text.skillScore').classed('hidden', true)
}

function polar(r, alpha) {
    pi = Math.PI
    alpha = alpha * (pi/180)
    return { 
      x: r * Math.cos(alpha),
      y: r * Math.sin(alpha)
    };
  }