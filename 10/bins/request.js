d3.json("http://localhost:8000/random-rolls", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        rolls: 3,
        dice: 3
    })
}).then(data => {
    console.log(data)
})

function getData() {
    console.log("try")
    d3.json("http://localhost:8000/random-rolls", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        rolls: 3,
        dice: 3
    })
    }).then(data => {
        console.log(data)
    })
}