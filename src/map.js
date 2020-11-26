$(document).ready(() => {
  var width = 960;
  var height = 500;
  
  let projection = d3.geoAlbersUsa().scale(800);

  
  var path = d3.geoPath() 
    .projection(projection);

  var color = d3.scaleLinear()
  .domain([0.4,0.6])
  .range(["rgb(0,0,0)","rgb(102,102,255)","rgb(255,102,102)","rgb(255,0,0)"]);

  var svg = d3.select("#main")
    .append("svg")
    .attr("width", width)
    .attr("height", height);


  var div = d3.select("#main")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);




  d3.json("election-filtered.json").then( function(data) {

    color.domain([0,1,2,3])

    d3.json("us-states.json").then( function (json) {
      console.log("teste");


    // Loop through each state data value in the .csv file
    for (var i = 0; i < data.length; i++) {

      // Grab State Name
      var dataState = data[i].state;

      // Grab data value 
      var dataValue = data[i].trump_percentage;

      // Find the corresponding state inside the GeoJSON
      for (var j = 0; j < json.features.length; j++)  {
        var jsonState = json.features[j].properties.name;

        if (dataState == jsonState) {

          // Copy the data value into the JSON
          json.features[j].properties.visited = dataValue; 

          // Stop looking through the JSON
        break;
        }
      }
    }

    svg.selectAll("path")
      .data(json.features)
      .enter()
      .append("path")
      .attr("d", path)
      .style("stroke", "#fff")
      .style("stroke-width", "1")
      .style("fill", function (d) {

        var value = d.properties.visited;

        if (value) {
          console.log(value)
          return color(value);
        } else {
          return "rgb(213,222,217)";
        }
      });


    });


  });
});