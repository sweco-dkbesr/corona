var VERTICAL_BAR_WIDTH = 20;
var LOW_COLOR = '#ffffff';
var HIGH_COLOR = '#ffaa00';
var N_STEPS = '5';
var DATE_FORMAT = "%d/%m-%Y";

var margin = {top: 20, right: 0, bottom: 70, left: 0};
var width = (VERTICAL_BAR_WIDTH * dates.length); //  - margin.left - margin.right,
var height = 300 - margin.top - margin.bottom;

console.log('width ', width);
console.log('height ', height);

// Parse the date / time
var parseDate = d3.time.format(DATE_FORMAT).parse;

var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

var y = d3.scale.linear().range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickFormat(d3.time.format(DATE_FORMAT));

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10);

var svg = d3.select("#time_series").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

console.log(svg);

// d3.csv("bar_data.csv", function (error, data) {

function timeSeries(dta) {

    var data = [];

    dta.forEach(function (d) {
        dd = {};
        dd.date = parseDate(d.date);
        dd.value = d.value;
        data.push(dd);
    });

    console.log(data);

    x.domain(data.map(function (d) {
        return d.date;
    }));

    y.domain([0, d3.max(data, function (d) {
        return d.value;
    })]);

    // svg.append("g")
    //     .attr("class", "x axis")
    //     .attr("transform", "translate(0," + height + ")")
    //     .call(xAxis)
    //     .selectAll("text")
    //     .style("text-anchor", "end")
    //     .attr("dx", "-.8em")
    //     .attr("dy", "-.55em")
    //     .attr("transform", "rotate(-90)");

    var bars = svg.selectAll(".bar")
        .data(data)
        .enter()

    // update bars
    bars.append("rect")
        .attr("class", "bar")
        .style("fill", function (d) {
            // console.log(d.value, ' -> ', getColorValueFromSmittetCount(d.value));
            return getColorValueFromSmittetCount(d.value)
        })
        .attr("x", function (d) {
            return x(d.date);
        })
        .attr("width", x.rangeBand())
        .attr("y", function (d) {
            return y(d.value);
        })
        .attr("height", function (d) {
            return height - y(d.value);
        })

    //add a value label to the top of each bar
    bars.append("text")
        .attr("class", "label")
        .attr("x", function (d) {
            console.log('d', x(d.date));
            return x(d.date)
        })
        //x position is 3 pixels to the right of the bar
        .attr("y", function (d) {
            console.log('y', y(d.value))
            return y(d.value) - 8;
        })
        .text(function (d) {
            return d.value;
        });

}
