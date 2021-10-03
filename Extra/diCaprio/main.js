const width = 800;
const height = 600;
const margin = {
    'top': 10,
    'bottom': 60,
    'left': 60,
    'right': 10
}


d3.csv('data.csv').then(data=>{
    data.forEach(d => {
        console.log(d.year, d.age, d.name);
    });
});
