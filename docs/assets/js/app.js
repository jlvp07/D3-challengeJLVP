// @TODO: YOUR CODE HERE!
// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 75, left: 75},
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

//Step 1) Using D3 to read data file
d3.csv("assets/data/data.csv").then(doTheThing);
var globalData = 0

function doTheThing(csvData)
{
    globalData = csvData;
    console.log(globalData);
    createScatter("poverty","healthcare");
}

function createScatter(xAxis, yAxis)
{
    //Get min and max values for axis
    minX = Math.min.apply(Math, globalData.map(o => o[xAxis]));
    maxX = Math.max.apply(Math, globalData.map(o => o[xAxis]));
    minY = Math.min.apply(Math, globalData.map(o => o[yAxis]));
    maxY = Math.max.apply(Math, globalData.map(o => o[yAxis]));
    
    //Round axis end values to nearest multiple of r
    var r = 2
    minX -= minX % r
    maxX += r - (maxX % r)
    minY -= minY % r
    maxY += r - (maxY % r)

    // Add X axis scale
    var x = d3.scaleLinear()
    .domain([minX, maxX])
    .range([0, width]);

    // Add Y axis scale
    var y = d3.scaleLinear()
    .domain([minY, maxY])
    .range([height, 0]);

    // Add G tags
    var xAxisG = svg.append("g")
        .attr("transform", "translate(0," + height + ")");
    var yAxisG = svg.append("g");
    
    //Append XAxis Text
    xAxisG.append('text')
        .attr('class', 'aText')
        .attr('x', width / 2)
        .attr('y', margin.bottom/2)
        .text("In Poverty (%)");
    
    //Append YAxis Text
    yAxisG.append('text')
        .attr('class', 'aText')
        .attr('x', -height/2)
        .attr('y', -margin.left/2)
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
            .attr("font-size", 8)
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