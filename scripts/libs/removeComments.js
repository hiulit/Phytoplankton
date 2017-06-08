var removeComments = function(stylesheet) {
  // Remove comments.
  // stylesheet = stylesheet.replace(/(\/\*([^*]|[\r\n]|(\*+([^*\/]|[\r\n])))*?\*\/)/g, '');
  stylesheet = stylesheet.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '');
  // Trim leading and trailing.
  stylesheet = stylesheet.replace(/((^\s+|\s+$))/g,'');
  // Remove extra line breaks.
  stylesheet = stylesheet.replace(/(\n\s*\n)/g, '\n\n');

  return stylesheet;
}
