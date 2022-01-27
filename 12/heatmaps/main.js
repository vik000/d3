const width = 870
const height = 180
const margin = {
    sides: 40,
    left: 60,
    top: 20,
    bottom: 50,
    padding: 2
}
const eWidth = width - 2 * margin.sides;
const squareWidth = (eWidth - (52 * margin.padding)) / 53;

const svg = d3.select("#chart").append("svg").attr("id", "svg")
    .attr("width", width).attr("height", height)
const calendar = svg.append("g").attr("id", "calendar")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
const controlGroup = svg.append("g").attr("id", "controlGroup")
const legendGroup = controlGroup.append('g').attr("id", "legendGroup")
    .attr("transform", `translate(${0}, ${height - squareWidth})`)

const formatTime = d3.timeParse("%Y-%m-%d")

const today = new Date();
let yearControl = d3.select("#yearControl").select("i#present")
yearControl.text(today.getFullYear())
let pastTrigger = d3.select("#yearControl").select("i#past").on("click", function() {
    year = +yearControl.text()
    yearControl.text(year - 1)
    metric = metricSelector.property("value")
    plotYear(year - 1, data, metric)
})
let futureTrigger = d3.select("#yearControl").select("i#future").on("click", function() {
    year = +yearControl.text()
    yearControl.text(year + 1)
    metric = metricSelector.property("value")
    plotYear(year + 1, data, metric)
})

const colourCode = {
    Volume: d3.interpolateBlues,
    Range: d3.interpolateOranges,
    Close: d3.interpolateGreens,
    Open: d3.interpolatePurples,
    High: d3.interpolateMagma,
    Low: d3.interpolateReds
}
let metric = "Volume"
let colour = d3.scaleSequential().domain([0, 10])
    .interpolator(colourCode[metric])

let metricSelector = d3.select("#metricSelector")

let legendGroupItem = legendGroup.append("g")
    .attr("class", "legendItem")
let legendText = legendGroupItem
    .append("text")
    .attr("class", "legendText")

const tipGroup = svg.append("g").attr("id", "tipGroup")
    .attr("transform", `translate(${width - margin.sides}, ${height - 10})`)
const tip1 = tipGroup.append("text").attr("id", "tip1").attr("class", "tip").attr("y", -10)
const tip2 = tipGroup.append("text").attr("id", "tip2").attr("class", "tip").attr("y", 5)

let scale = d3.scaleQuantize().range([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

let getWeekDay = {
    0: "Monday",
    1: "Tuesday",
    2: "Wednesday",
    3: "Thursday",
    4: "Friday",
    5: "Saturday",
    6: "Sunday"
}

// this function adds a way to calculate the week number to the javascript date object
Date.prototype.getWeek = function() {
    let onejan = new Date(this.getFullYear(), 0, 1)
    // let numberOfDays = Math.floor((this - onejan) / (24 * 60 * 60 * 1000)); // if your week starts on Sunday
    let numberOfDays = Math.floor((this - onejan) / (24 * 60 * 60 * 1000)) - 1
    return Math.abs(Math.ceil((numberOfDays) / 7));
};

let data
d3.csv("data.csv").then(_data => {
    _data.map(d => {
        d.Date = formatTime(d.Date)
        d.day = d.Date.getDate()
        d.dow = d.Date.getDay()
        d.week = d.Date.getWeek()
        d.month = d.Date.getMonth() + 1 // for natural reading, careful because js reads months in zero based form
        d.year = d.Date.getFullYear()
        d.weekDay = getWeekDay[d.dow]
        d.Open = +d.Open
        d.Close = +d.Close
        d.High = +d.High
        d.Low = +d.Low
        d.Volume = +d.Volume
        d.Range = d.Close - d.Open
    }) 
    data = _data

    for (let _metric of ["Volume", "Open", "Close", "High", "Low", "Range"]) {        
        metricSelector.append("option").attr("value", _metric).text(_metric)
        metricSelector.on("change", function() {
            metric = d3.select(this).property('value')
            year = +d3.select("#present").text()
            plotYear(year, data, metric)
        })
    }

    // scale:
    scale.domain(d3.extent(data.map(d => d[metric])))

    for (let w = 0; w < 53; w++) {
        drawEmptyWeek(w)
    }


    for (let i = 0; i <= 10; i++) {
        legendGroupItem.append("rect")
            .attr("class", `legendSquare`)
            .attr("i", `i${i}`)
            .attr("width", squareWidth)
            .attr("height", squareWidth)
            .attr("x", i * (squareWidth + margin.padding))
            .attr("y", 0)
            .attr("fill", colour(i))
            .on("mouseover", highlightLegend)
            .on("mouseout", hideLegend)
    }

    let daysOfTheWeek = calendar.append("g").attr("id", "daysOfTheWeek")
    for(let dayOfTheWeek = 0; dayOfTheWeek < 7; dayOfTheWeek++) {
        daysOfTheWeek.append("text").text(getWeekDay[dayOfTheWeek])
            .attr("class", "dayOfTheWeek")
            .attr("transform", `translate(${-4}, ${dayOfTheWeek * (squareWidth + margin.padding) + (squareWidth/2)})`)
    }
    plotYear(today.getFullYear(), data, "Volume")
})


function drawEmptyWeek(w) {
    let weekGroup = calendar.append("g").attr("id", `week${w}`)
    for(let day = 0; day < 7; day++) {
        weekGroup.append("rect")
            .attr("class", `day empty ${getWeekDay[day]}`)
            .attr("width", squareWidth)
            .attr("height", squareWidth)
            .attr("x", w * (squareWidth + margin.padding))
            .attr("y", day * (squareWidth + margin.padding))
        
        weekGroup.append("text").text(w)
            .attr("class", "weekNumber")
            .attr("x", (w * ((squareWidth) + margin.padding)) + squareWidth / 2)
            .attr("y", -4)
    }
}


function plotYear(year, data, metric) {   
    scale.domain(d3.extent(data.map(d => d[metric])))
    colour = d3.scaleSequential().domain([0, 10])
        .interpolator(colourCode[metric])  
    for (let i = 0; i <= 10; i++) {
        d3.selectAll("rect.legendSquare").each((d, i, a) => {
            d3.select(a[i]).attr("fill", colour(i))
        })
    }

    var weekData
    let weekGroup
    for (w = 0; w <= 52; w++) {
        weekData = []
        if (w == 0) {
            data.filter(d => d.week == 52 && d.year == year -1).forEach(d => weekData.push(d))
            data.filter(d => d.week == 0 && d.year == year).forEach(d => weekData.push(d))
        } else if (w == 52) {
            data.filter(d => d.week == 52 && d.year == year).forEach(d => weekData.push(d))
            data.filter(d => d.week == 0 && d.year == year + 1).forEach(d => weekData.push(d))
        } else {
            weekData = data.filter(d => d.week == w && d.year == year)
        }
        
        if (weekData.length != 0) {
            weekGroup = d3.select(`g#week${w}`).selectAll("rect.day").data(weekData)
            weekGroup.each((d, i, a) => {
                    d3.select(a[i])
                        .attr("fill", colour(scale(d[metric])))
                        .attr("stroke", colour(scale(d[metric])))
                        .attr("i", `i${scale(d[metric])}`)
                        .on("mouseover", showTip)
                        .on("mouseout", hideTip)
                        .classed("empty", false)
                })
        } else {
            d3.selectAll(`g#week${w}`).selectAll("rect.day")
                .classed("empty", true)
                .each((d, i, a) => {
                    d3.select(a[i]).attr("i", "")
                })
        }
    }
}

function showTip(d) {
    item = d3.select(this)
    if (!item.classed("empty")) {
        item.classed("highlighted", true)
        tip1.text(`Date: ${d.day} / ${d.month}`)
        tip2.text(`${metric}: ${d[metric]} €`)
    }
}

function hideTip() {
    d3.select(this).classed("highlighted", false)
    tip1.text("")
    tip2.text("")
}

function highlightLegend() {
    thisSquare = d3.select(this)
    i = +thisSquare.attr("i").replace("i", "")
    legendText
        .classed("hidden", false)
        .attr("y", -5)
        .attr("x", legendGroup.node().getBBox().width / 2)
        .text(`${metric}: ${scale.invertExtent(i)[0]} - ${scale.invertExtent(i)[1]}`)
    thisSquare.classed("highlighted", true)

    // hide all squares out of the range
    calendar.selectAll("rect.day").classed("lightened", true)
    calendar.selectAll(`[i='i${i}']`).classed("lightened", false)
    calendar.selectAll(`[i='i${i}']`).classed("highlighted", true)
}

function hideLegend() {
    legendText.classed("hidden", true)
    d3.selectAll("rect.legendSquare").classed("highlighted", false)
    calendar.selectAll("rect.day").classed("lightened", false)
    calendar.selectAll("rect.day").classed("highlighted", false)
}