var computeCss = function(styles) {
  var cssArray = [];
  var parsedStylesheet = gonzales.parse(styles);
  parsedStylesheet = parsedStylesheet.content;

  for (var i = 0, len = parsedStylesheet.length; i < len; i++) {
    if (parsedStylesheet[i].type === 'ruleset') {
      var ruleset = parsedStylesheet[i].toString();
      cssArray.push('.code-render ' + ruleset);
    }
  }

  styles = cssArray.join('');

  var headStyles = document.createElement('style');
  headStyles.appendChild(document.createTextNode(styles));
  document.head.appendChild(headStyles);

  return styles;
}