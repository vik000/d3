d3.json("data.json").then(data=>{
    console.log("Json")
	console.log(data)
})

d3.csv("data.csv").then(data=>{
    console.log("csv")
	console.log(data)
})

d3.tsv("data.tsv").then(data=>{
    console.log("tsv")
	console.log(data)
})

d3.xml("data.xml").then(_data=>{
    console.log("xml")
    let data = []
    _data.firstElementChild.querySelectorAll('row').forEach(row => {
        entry = {
            date: row.querySelector('date').textContent,
            open: row.querySelector('open').textContent,
            close: row.querySelector('close').textContent,
            high: row.querySelector('high').textContent,
            low: row.querySelector('low').textContent,
            volume: row.querySelector('volume').textContent,
        }
        data.push(entry)
    })
    console.log(data)
})