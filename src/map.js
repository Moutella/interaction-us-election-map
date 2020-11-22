$(document).ready(() => {
  var width = 960;
  var height = 500;
  
  let projection = d3.geoAlbersUsa().scale(800);

  
  var path = d3.geoPath() 
    .projection(projection); 


  var svg = d3.select("#main")
    .append("svg")
    .attr("width", width)
    .attr("height", height);


  var div = d3.select("#main")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


    d3.json("us-states.json").then( function (json) {
      console.log("teste");


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
          return color(value);
        } else {
          return "rgb(213,222,217)";
        }
      });

    
  });
});