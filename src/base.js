import {
  ElectionView
} from './electionView.js'

$(document).ready(() => {
  var elems = document.querySelectorAll('.collapsible');
  var instances = M.Collapsible.init(elems, {
    'accordion': true
  });
});


async function readJson(filepath){
  let json = await d3.json(filepath)
  return json
}
async function main(){
  let params = {
    selector: '#main',
    width: 960,
    height: 500
  }
  let electionView = new ElectionView(params)
  let geographic_limits = await readJson('us-states.json')
  electionView.updateGeography(geographic_limits);
  let voting_data = await readJson('election-filtered.json')
  electionView.updateData(voting_data);
  electionView.render();
}

main()