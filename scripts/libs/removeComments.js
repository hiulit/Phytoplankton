var removeComments = function(str) {
  // Remove comments.
  // str = str.replace(/(\/\*([^*]|[\r\n]|(\*+([^*\/]|[\r\n])))*?\*\/)/g, '');
  str = str.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '');
  // Trim leading and trailing.
  str = str.replace(/((^\s+|\s+$))/g,'');
  // Remove extra line breaks.
  str = str.replace(/(\n\s*\n)/g, '\n\n');

  return str;
}
