// d3.json("data.json").then(data=>{
//     console.log("Json")
//     console.log(data)
// })

const formatDate = d3.timeParse("%d/%m/%Y");

d3.csv("data.csv").then(data=>{
    console.log("csv")
    // descomentar código por partes:
    // parte 1:
	// console.log(data[0])

    // parte 2:
    // Object.entries(data[0]).forEach((d, i) => {
    //     console.log(`"${d[0]}": ${d[1]} (${typeof d[1]})`)
    // })

    // parte 3:
    // data.map(d => {
    //     d.open = +d.open
    //     d.close = +d.close
    //     d.high = +d.high
    //     d.low = +d.low
    //     d.volume = +d.volume
    //     d.date = formatDate(d.date) // parte 4 (solo esta linea)
    // })

    //parte 5:
    // console.log(data[0])

    // parte 6:
    // console.log("csv")
	// // console.log(data[0])
    // Object.entries(data[0]).forEach((d, i) => {
    //     console.log(`"${d[0]}": ${d[1]} (${typeof d[1]})`)
    // })
})

// d3.tsv("data.tsv").then(data=>{
//     console.log("tsv")
// 	console.log(data)
// })

// d3.xml("data.xml").then(_data=>{
//     console.log("xml")
//     let data = []
//     _data.firstElementChild.querySelectorAll('row').forEach(row => {
//         entry = {
//             date: row.querySelector('date').textContent,
//             open: row.querySelector('open').textContent,
//             close: row.querySelector('close').textContent,
//             high: row.querySelector('high').textContent,
//             low: row.querySelector('low').textContent,
//             volume: row.querySelector('volume').textContent,
//         }
//         data.push(entry)
//     })
//     console.log(data)
// })