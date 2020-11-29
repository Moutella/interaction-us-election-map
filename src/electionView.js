const d3 = window.d3

export class ElectionView {
  constructor(params) {
    this.params = params;
    this.svg = null;
    this.tooltips = null;
    this.initialized = false;


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
    this.final_geo = this.geography
    let totalTrump = 0
    let totalBiden = 0
    this.final_geo.features.forEach(function (state, i) {
      let state_data = voting_data.find(data =>
        data.state == state.properties.name)
      if (state_data) {
        let trumpWins = state_data.trump_percentage > 0.5;
        state.properties.winner = trumpWins ? "Trump" : "Biden";
        if (trumpWins) {
          state.properties.percentual = (state_data.trump_percentage * 100).toFixed(2);
          state.properties.color = d3.scaleLinear().domain([50, 55]).range(['#ff8880', '#ff0000'])(state.properties.percentual)
          totalTrump += parseInt(state_data.electoral_votes)
        } else {
          state.properties.percentual = ((1 - state_data.trump_percentage) * 100).toFixed(2);
          state.properties.color = d3.scaleLinear().domain([50, 55]).range(['#0088ff', '#0000ff'])(state.properties.percentual)
          totalBiden += parseInt(state_data.electoral_votes)
        }

        //state.properties.color = d3.scaleSequential(d3.interpolateRdBu).domain([0.65, 0.35])(state_data.trump_percentage)
        state.properties.evs = state_data.electoral_votes
        state.properties.updateTimestamp = state_data.timestamp
      }

    });
    this.totalBiden = totalBiden;
    this.totalTrump = totalTrump;
    this.render()
  }
  getUsedData() {
    return this.final_geo
  }
  getTotalEVs() {
    return {
      biden: this.totalBiden,
      trump: this.totalTrump
    }
  }
  render() {
    var div = this.tooltips;
    var left = this.left
    var top = this.top

    let duration = this.params.duration || 500
    if (!this.initialized) {
      duration = 0;
      this.initialized = true;
    }
    this.svg.selectAll("path")
      .data(this.final_geo.features)
      .join("path")
      .transition()
      .duration(duration)
      .attr("d", this.path)
      .style("stroke", "#fff")
      .style("stroke-width", "1")
      .style("fill", function (d) {
        return d.properties.color
      })
    this.svg.selectAll("path")
      .data(this.final_geo.features)
      .join("path").on("mouseover", function (event, data) {
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
      .on('click', function (event, data) {
        console.log(data.properties.name);
        var event = new CustomEvent('mapClick', {
          'detail': data.properties.name
        });
        jQuery("body")[0].dispatchEvent(event);
      })


  }

}