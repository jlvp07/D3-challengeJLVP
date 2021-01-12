// @TODO: YOUR CODE HERE!
//Step 1) Using D3 to read data file
d3.csv("assets/data/data.csv").then(doTheThing);
let globalData = 0

// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 100, left: 150},
width = 690 - margin.left - margin.right,
height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#scatter")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

function doTheThing(csvData)
{
    globalData = csvData;
    console.log(globalData);
    createScatter("poverty","healthcare");
}

function createScatter(xAxis, yAxis)
{

    var maxX = Math.max.apply(Math, globalData.map(o => o[xAxis])),
    maxY = Math.max.apply(Math, globalData.map(o => o[yAxis]));
    minX = Math.min.apply(Math, globalData.map(o => o[xAxis]));
    minY = Math.min.apply(Math, globalData.map(o => o[yAxis]));
    
    maxX += 5 - (maxX % 5)
    maxY += 5 - (maxX % 5)
    minX -= minX % 5
    minY -= minY % 5

    // Add X axis
    var x = d3.scaleLinear()
    .domain([minX, maxX])
    .range([ 0, width ]);

    // Add Y axis
    var y = d3.scaleLinear()
    .domain([minY, maxY])
    .range([ height, 0]);

    var xAxisG = svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    var yAxisG = svg.append("g");
    
    xAxisG.append('text')
    // .attr('class', 'axis-label')
    .attr('x', width / 2)
    .attr('y', 90)
    .text("In Poverty (%)");
    
    yAxisG.append('text')
    // .attr('class', 'axis-label')
    .attr('x', -height / 2)
    .attr('y', -100)
    .attr('transform', `rotate(-90)`)
    .style('text-anchor', 'middle')
    .text("Lacks Healthcare (%)");
    
    xAxisG.call(d3.axisBottom(x));
    yAxisG.call(d3.axisLeft(y));

    //Create the datapoints as circles with radius and colour corresponding to population size
    const bubble = svg.append("g")
        .attr("stroke-width", 1)
        .selectAll("circle")
        .data(globalData)
        .join("circle")
            .attr("opacity", 0.75)
            .attr("cx", d => x(d[xAxis]))
            .attr("cy", d => y(d[yAxis]))
            .attr("r",  10)
            .attr("stroke", "#BEBEBE")//d => color(d["id"]))
            .attr("fill", "#EBEBEB")//d => color(d["id"]))
    bubble.append("title")
        .text(tooltip)

    //Create the ISO country codes as text elements
    const label = svg.append("g")
        // .attr("font-family", "Yanone Kaffeesatz")
        .attr("font-weight", 700)
        .attr("text-anchor", "middle")
        .selectAll("text")
        .data(globalData)
        .join("text")
            .attr("id", "isoCode")
            .attr("opacity", 1)
            .attr("dy", "0.35em")
            .attr("x", d => x(d[xAxis]))
            .attr("y", d => y(d[yAxis]))
            .attr("font-size", 10)
            .attr("fill", "#AABBCC")
            .text(d => d.abbr);
    //add a title to act as a mousover tooltip, function tooltip() defined in a cell bleow
    label.append("title")
        .text(tooltip);

}

tooltip =  function(d){
    return d.id + ": " + d.state;
    // "\nBirth Rate: " + d.birthRate +
    // "\nDeath Rate: " + d.deathRate +
    // "\nPopulation: " + d3.format(",.3f")(d.population / 1000000) + "m";
}