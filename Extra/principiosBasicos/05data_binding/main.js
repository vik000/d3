let container = d3.select('#json')
let title = container.append('h2').text('World Cup Winners')
let list = container.append('ul')

d3.json("data.json").then(data => {
    data = Object.values(data.worldCupWinners)
    console.log(data);
    list.selectAll('li').data(data).call(addLi)
})


function addLi(ul){
    ul.enter().append('li').text(d => `${d.country}: ${d.titles} titles`)
}