var separate = function(css) {
  var lines = css.split('\n');
  var docs, code, line, blocks = [];

  // Regular expressions to match comments. We only match comments in
  // the beginning of lines.
  var commentRegexs = {
    single: /^\/\//, // Single line comments for Sass, Less and Stylus
    multiStart: /^\/\*/,
    multiEnd: /\*\//
  };

  // Check if a string is code or a comment (and which type of comment).
  var checkType = function(str) {
    // Treat multi start and end on same row as a single line comment.
    if (str.match(commentRegexs.multiStart) && str.match(commentRegexs.multiEnd)) {
      return 'single';
    // Checking for multi line comments first to avoid matching single line
    // comment symbols inside multi line blocks.
    } else if (str.match(commentRegexs.multiStart)) {
      return 'multistart';
    } else if (str.match(commentRegexs.multiEnd)) {
      return 'multiend';
    } else if ((commentRegexs.single != null) && str.match(commentRegexs.single)) {
      return 'single';
    } else {
      return 'code';
    }
  };

  var formatDocs = function(str) {
    // Filter out comment symbols
    for (var key in commentRegexs) {
      str = str.replace(commentRegexs[key], '');
    }
    return str + '\n';
  };

  var formatCode = function(str) {
    // Truncate base64 encoded strings
    return str.replace(/(;base64,)[^\)]*/, '$1...') + '\n';
  };

  while (lines.length) {
    docs = code = '';

    // First check for any single line comments.
    while (lines.length && checkType(lines[0]) === 'single') {
      docs += formatDocs(lines.shift());
    }

    // A multi line comment starts here, add lines until comment ends.
    if (lines.length && checkType(lines[0]) === 'multistart') {
      while (lines.length) {
        line = lines.shift();
        docs += formatDocs(line);
        if (checkType(line) === 'multiend') break;
      }
    }

    while (lines.length && (checkType(lines[0]) === 'code' || checkType(lines[0]) === 'multiend')) {
      code += formatCode(lines.shift());
    }

    blocks.push({
      docs: docs,
      code: code
    });
  }

  return blocks;
};