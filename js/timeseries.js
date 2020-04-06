// We need to initialize the time series

MAX = 200;
var data1 = []
for (j = 0; j <= datesSearch.length - 1; j++) {
    data1.push({
        date: datesSearch[j],
        value: 0
    });
}

var svg;
var x;
var y
var height;
var width;

function initTimeSeries() {

    console.log("ini", svg);

    // set the dimensions and margins of the graph

    var ww = spsjq("#timeseries").width();

    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 30, bottom: 15, left: 60};
    width = ww - margin.left - margin.right;
    height = 150 - margin.top - margin.bottom;

// append the svg object to the body of the page
    svg = d3.select("#timeseries")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

// X axis
    x = d3.scaleBand()
        .range([0, width])
        .domain(data1.map(function (d) {
            return d.date;
        }))
        .padding(0.2);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("font-size", "8px")
    // .attr("dx", "-.8em")
    // .attr("dy", ".15em")
    // .attr("transform", "rotate(-65)");

// Add Y axis
    y = d3.scaleLinear()
        .domain([0, MAX])
        .range([height, 0]);

    svg.append("g")
        .attr("class", "myYaxis")
        .call(d3.axisLeft(y));

    timeSeries(data1)

}

// A function that create / update the plot for a given variable:
function timeSeries(data) {

    var u = svg.selectAll("rect")
        .data(data)

    u
        .enter()
        .append("rect")
        .merge(u)
        .transition()
        .duration(1000)
        .attr("x", function (d) {
            return x(d.date);
        })
        .attr("y", function (d) {
            return y(d.value);
        })
        .attr("width", x.bandwidth())
        .attr("height", function (d) {
            return height - y(d.value);
        })
        // .attr("fill", "#69b3a2")
        .style("fill", function (d) {
            // console.log(d.value, ' -> ', getColorValueFromSmittetCount(d.value));
            return getColorValueFromSmittetCount(d.value)
        })

    // //add a value label to the top of each bar
    // u.append("text")
    //     .attr("class", "label")
    //     .attr("x", function (d) {
    //         console.log('d', x(d.date));
    //         return x(d.date)
    //     })
    //     //x position is 3 pixels to the right of the bar
    //     .attr("y", function (d) {
    //         // console.log('y', y(d.value))
    //         return y(d.value) - 8;
    //     })
    //     .text(function (d) {
    //         return d.value;
    //     });
}

// console.log(svg);

// Initialize the plot with the first dataset

