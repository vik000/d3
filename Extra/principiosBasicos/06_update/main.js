let container = d3.select('#json')
let title = container.append('h2').text('World Cup Winners')
let list = container.append('ul')
let data = "fake data";
let elements;

d3.json("data.json").then(_data => {
    data = Object.values(_data.worldCupWinners)
    console.log(data);
    updateLi(data)
})

function updateLi(data){
    elements = list.selectAll('li').data(data)
    elements.enter().append('li').text(d => `${d.country}: ${d.titles} titles`)
    elements.text(d => `${d.country}: ${d.titles} titles`)
    elements.exit().remove()
}

d3.select('#uefa').on('click', function() {
    uefa = data.filter(d => {
        return d.confederation == "UEFA"
    })

    console.log(uefa);
    updateLi(uefa)
})

d3.select('#conmebol').on('click', function() {
    conmebol = data.filter(d => {
        return d.confederation == "Conmebol"
    })
    console.log(conmebol)
    updateLi(conmebol)
})

d3.select('#all').on('click', function() {
    updateLi(data)
})