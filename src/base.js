import {
  BeautifulData
} from './beautifulData.js'

import {
  ElectionView
} from './electionView.js'

let currentIndex = 0
$(document).ready(() => {
  var elems = document.querySelectorAll('.collapsible');
  var instances = M.Collapsible.init(elems, {
    'accordion': true
  });
});


async function readJson(filepath) {
  let json = await d3.json(filepath)
  return json
}

let params = {
  selector: '#us-map-div',
  width: 960,
  height: 500
}
let electionView = new ElectionView(params)
let possibleTimes = null;
let voting_data = null;
let currentMapData = null;
let currentState = "Georgia"


let linechart = new BeautifulData({
  selector: '#linechart',
  type: 'linechart',
  width: 400,
  height: 300,
  position_x: 100,
  position_y: 100,
  top: 100,
  bottom: 100,
  left: 100,
  right: 100,
  label_x: 'Data',
  label_y: 'Percentual',
  style: {
    'background-color': '#aaaaff',
  },
  extra: {
    stroke: '#ff0000'
  }
});
let currentDateLimit = null
async function main() {
  let geographic_limits = await readJson('us-states.json')
  electionView.updateGeography(geographic_limits);
  voting_data = await readJson('election-filtered.json')

  let timestampSet = new Set()
  for (let data of voting_data) {
    timestampSet.add(data['timestamp'].split(":")[0])
  }
  possibleTimes = Array.from(timestampSet)
  jQuery("#slider-range").attr("max", possibleTimes.length-1)

  jQuery("#slider-range").attr("value", possibleTimes.length-1)
  possibleTimes = possibleTimes.sort();
  currentDateLimit = possibleTimes[possibleTimes.length-1] + 'h'
  jQuery("#current_date_limit").text(currentDateLimit);
  electionView.updateData(voting_data);
  limitedData = voting_data
  currentMapData = electionView.getUsedData()
  let totals = electionView.getTotalEVs()
  updateTotals(totals.biden, totals.trump);
  updateLinechart(currentState);
}



function updateTotals(biden, trump){
  jQuery("#bidenScore").text(biden);
  jQuery("#trumpScore").text(trump);
}

main()
let limitedData = null
jQuery("#slider-range").on("input", function () {
  let currentLimit = possibleTimes[$(this).val()]
  limitedData = voting_data.filter(item =>
    item.timestamp <= currentLimit)

  
  jQuery("#current_date_limit").text(currentLimit + 'h');
  electionView.updateData(limitedData)
  currentMapData = electionView.getUsedData()
  let totals = electionView.getTotalEVs()
  updateTotals(totals.biden, totals.trump);
  updateLinechart(currentState);
});
function updateLinechart(state){
  let stateData = limitedData.filter(item =>
    item.state == state)
  linechart.updateData(stateData.reverse(), true);
}
jQuery('body').on('mapClick', function(event, data){
  currentState = event.detail
  updateLinechart(currentState);
  jQuery("#current_state").text(currentState);
  
});