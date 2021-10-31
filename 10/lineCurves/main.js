// constants:
const data = [
    {x: 10, y: 10},
    {x: 100, y: 90},
    {x: 200, y: 20},
    {x: 300, y: 150},
]

const curves = {
    curveBasis: function() {
        return d3.curveBasis
    },
    curveBasisClosed: function() {
        return d3.curveBasisClosed
    },
    curveBundle: function(beta) {
        return d3.curveBundle.beta(beta)
    },
    curveCardinal: function(tension) {
        return d3.curveCardinal.tension(tension)
    },
    curveCatmullRom: function(alpha) {
        return d3.curveCatmullRom.alpha(alpha)
    },
    curveMonotoneX: function() {
        return d3.curveMonotoneX
    },
    curveMonotoneY: function() {
        return d3.curveMonotoneY
    },
    curveNatural: function() {
        return d3.curveNatural
    },
    curveStep: function() {
        return d3.curveStep
    },
    curveStepAfter: function() {
        return d3.curveStepAfter
    },
    curveStepBefore: function() {
        return d3.curveStepBefore
    },

}

let sampleCurve = d3.curveLinear

//control:
let svg = d3.select(".chart").append('svg').attr('id', "curve").attr('height', 160).attr('width', 310)

// ref points:
let pointGroup = svg.append('g').attr('id', 'points')
let points = pointGroup.selectAll('circle').data(data)
points.enter().append('circle').attr('r', 4).attr('cx', d=>d.x).attr('cy', d=>d.y)
let samplePath = svg.append("path").datum(data).attr('class', 'refPath').attr('d', d3.line().curve(sampleCurve).x(d=>d.x).y(d=>d.y))



//curveLinear:
let path = svg.append('path')
path.datum(data)
    .attr('d', d3.line().curve(curves.curveBasis()).x(d=>d.x).y(d=>d.y))
    // .attr('d', d3.line().curve(curves.curveBasisClosed()).x(d=>d.x).y(d=>d.y))
    // .attr('d', d3.line().curve(curves.curveBundle(0)).x(d=>d.x).y(d=>d.y))
    // .attr('d', d3.line().curve(curves.curveCardinal(0)).x(d=>d.x).y(d=>d.y))
    // .attr('d', d3.line().curve(curves.curveCatmullRom(0)).x(d=>d.x).y(d=>d.y))
    // .attr('d', d3.line().curve(curves.curveMonotoneX()).x(d=>d.x).y(d=>d.y))
    // .attr('d', d3.line().curve(curves.curveMonotoneY()).x(d=>d.x).y(d=>d.y))
    // .attr('d', d3.line().curve(curves.curveNatural()).x(d=>d.x).y(d=>d.y))
    // .attr('d', d3.line().curve(curves.curveStep()).x(d=>d.x).y(d=>d.y))
    // .attr('d', d3.line().curve(curves.curveStepAfter()).x(d=>d.x).y(d=>d.y))
    // .attr('d', d3.line().curve(curves.curveStepBefore()).x(d=>d.x).y(d=>d.y))