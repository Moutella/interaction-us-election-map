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
  selector: '#main',
  width: 960,
  height: 500
}
let electionView = new ElectionView(params)
let possibleTimes = null;
let voting_data = null
async function main() {
  let geographic_limits = await readJson('us-states.json')
  electionView.updateGeography(geographic_limits);
  voting_data = await readJson('election-filtered.json')

  let timestampSet = new Set()
  for (let data of voting_data) {
    timestampSet.add(data['timestamp'].split(":")[0])
  }
  possibleTimes = Array.from(timestampSet)
  possibleTimes = possibleTimes.sort();
  console.log(possibleTimes);
  electionView.updateData(voting_data);
}

main()
jQuery("#slider-range").on("input", function () {
  let currentLimit = possibleTimes[$(this).val()]
  console.log(currentLimit)
  let currentData = voting_data.filter(item =>
    item.timestamp <= currentLimit)
  console.log(currentData.length);
  electionView.updateData(currentData)
})