$(document).ready(() => {
  var elems = document.querySelectorAll('.collapsible');
  var instances = M.Collapsible.init(elems, {
    'accordion': true
  });
});
