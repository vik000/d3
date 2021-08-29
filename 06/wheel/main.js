const svg = d3.select('svg'),
    width = svg.attr('width'),
    height = svg.attr('height');

const radius = 200;
const g = svg.append('g').attr('transform', `translate(${width/2}, ${height/2}) rotate(${-360/24})`);

const pie = d3.pie().sort(null).value(d => d.value);

const path = d3.arc().outerRadius(radius).innerRadius(100);

// const label = d3.arc().outerRadius(radius).innerRadius(radius - 90);
const labelContainer = d3.select('svg').append('g').attr('class', 'labelContainer');
const label = labelContainer.append('text').attr('class', 'label active').attr('y', 0).attr('dy', 0); // add a label in the centre.
const monoscale = d3.scaleLinear().domain([0, 11]);

let selectedColour;
let index;
let selectedPie;
let selectedArray = [];

function restore(item){
    d3.selectAll('path').each((d, i, a) => {
        var thisItem = d3.select(a[i])
        thisItem.classed("inactive", false);
        thisItem.classed("active", true);
        thisItem.classed("selected", false);
        thisItem.attr('fill', '');
        selectedColour = null
        label.text('');
    })
}

function trigger(item, filterParam){
    d3.selectAll('path').filter((d, i)=>{
        if (filterParam) {
            return !filterParam.includes(i);
        }
        else {
            return !d.data[item.id];
        }
    }).each((d, i, a) => {
        var thisItem = d3.select(a[i])
        thisItem.classed("inactive", !thisItem.classed("inactive"));
        label.text(`${item.id} ${selectedArray.join(', ')}`);
    });
}

function complementaryTrigger(item) {
    if (!selectedColour) {
        label.text("please select a colour in the wheel first").call(wrap, 140);
    } else {
        label.attr('transform', 'translate(0, 0)');
        selectedPie = d3.select(`.${selectedColour}`);
        index = selectedPie.data()[0].index;
        
        // todo: find index in array with return
        function harmony(params) {
            restore();
            trigger(item, params);
        }

        function monochrome() {
            data = selectedPie.data()[0].data;
            restore();
            h = data.h;
            s = data.s;
            l = data.l;
            monoscale.range([l, 100]);
            d3.selectAll('path').each((d, i, a) => {
                var thisItem = d3.select(a[i])
                thisItem.classed("active", !thisItem.classed("active"));
                var lightness = (12 - index + i) % 12;
                thisItem.attr('fill', `hsl(${h}, ${s}%, ${monoscale(lightness)}%)`);
                label.text(item.id);
            });
        }

        switch(item.id){
            case 'complementary':
                var params = [index, (index + 6) % 12];
                harmony(params);
                break;
            case 'monochromatic':
                monochrome();
                break;
            case 'analogous':
                var params = [index, (index + 11) % 12, (index + 1) % 12];
                harmony(params);
                break;
            case 'triadic':
                var params = [index, (index + 4) % 12, (index + 8) % 12];
                harmony(params);
                break;
            case 'tetradic':
                var params = [index, (index + 3) % 12, (index + 6) % 12, (index + 9) % 12];
                harmony(params);
                break;
        }
    }
}

d3.json('data.json').then((data, i)=>{
    const pies = g.selectAll('.arc').data(pie(data)).enter().append('g').attr('class', 'arc');
    pies.append('path')
        .attr('class', (item, i)=>{
            return `${item.data.color} active`
        })
        .attr('d', path)
        .on('click', function(d, i, a){
            restore();
            if (selectedColour == d.data.color) {
                selectedColour = null;
                label.text('');
            } else {
                selectedColour = d.data.color;
                label.text(d.data.name);
                d3.select(this).classed('selected', true);
            }
            label.attr('transform', 'translate(0, 0)');
        })
        .on('mouseover', function(d, i, a){
            label.text(d.data.name);           
            label.attr('transform', 'translate(0, 0)');
        })
        .on('mouseout', function(d, i, a) {
            if (!selectedColour) {
                label.text('');
            } else {
                selectedPie = d3.select(`.${selectedColour}`);
                label.text(selectedPie.data()[0].data.name);
                label.attr('transform', 'translate(0, 0)');
            }
        })
})

function wrap(text, width) {

    text.each(function() {
      var  lineCount = 0;
      var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.1, // ems
          y = text.attr("y"),
          dy = parseFloat(text.attr("dy")),
          tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);

        }
      }
      text.attr('transform', `translate(0, ${-text.node().getBBox().height / 3})`);
    });
  }
  