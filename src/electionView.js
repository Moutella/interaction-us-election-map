const d3 = window.d3

export class ElectionView {
  constructor(params) {
    this.params = params;
    this.svg = null;
    this.tooltips = null;

    
    let projection = d3.geoAlbersUsa().scale(800);

    this.color = d3.scaleSequential(d3.interpolateRdBu).domain([0.6, 0.4]);
    this.path = d3.geoPath()
      .projection(projection);
    this.createSvg();
  }

  createSvg() {
    this.svg = d3.select(this.params.selector)
      .append("svg")
      .attr("width", this.params.width)
      .attr("height", this.params.height);

    this.tooltips = d3.select(this.params.selector)
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

      var offsets = $(this.params.selector).offset();
      this.top = offsets.top;
      this.left = offsets.left;
  }

  createMargins() {
    this.margins = this.svg
      .append('g')
      .attr("transform", `translate(${this.params.left || 0},${this.params.top || 0})`)
  }

  updateGeography(geography) {
    this.geography = geography
  }
  updateData(voting_data) {
    console.log(self.geography)
    this.geography.features.forEach(function (state, i) {
      let state_data = voting_data.find(data =>
        data.state == state.properties.name)
      if (state_data) {
        let trumpWins = state_data.trump_percentage > 0.5;
        state.properties.color = d3.scaleSequential(d3.interpolateRdBu).domain([0.6, 0.4])(state_data.trump_percentage)
        state.properties.winner = trumpWins ? "Trump" : "Biden";
        if (trumpWins){
          state.properties.percentual = (state_data.trump_percentage * 100).toFixed(2);
        }
        else{
          state.properties.percentual = ((1-state_data.trump_percentage) * 100).toFixed(2);
        }
        state.properties.evs = state_data.electoral_votes
        state.properties.updateTimestamp = state_data.timestamp
      }

    });

  }

  render() {
    console.log("hmm")
    var div = this.tooltips;
    var left = this.left
    var top = this.top
    this.svg.selectAll("path")
      .data(this.geography.features)
      .enter()
      .append("path")
      .attr("d", this.path)
      .style("stroke", "#fff")
      .style("stroke-width", "1")
      .style("fill", function (d) {
        return d.properties.color
      }).on("mouseover", function (event, data) {
        div.transition()
          .duration(200)
          .style("opacity", .9);
        div.text(`${data.properties.name}: ${data.properties.percentual}%\n` +
         `Na frente: ${data.properties.winner}\n` +
         `Votos Eleitorais: ${data.properties.evs}\n` +
         `Data: ${data.properties.updateTimestamp.split('.')[0]}`)
          .style("left", (d3.pointer(event)[0] + left) + "px")
          .style("top", (d3.pointer(event)[1] + top - 75) + "px");
      })

      // fade out tooltip on mouse out               
      .on("mouseout", function (d) {
        div.transition()
          .duration(500)
          .style("opacity", 0);
      })
      .transition()
      .duration(this.params.duration || 2000);

  }

}