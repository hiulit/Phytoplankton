var findImports = function(str, basepath, styleExt) {
  var finalCss = finalCss || [];
  var regex = /(?:(?![\/*]])[^\/* ]|^ *)@import ['"](.*?)['"](?![^*]*?\*\/)/g;
  var match, matches = [];
  var matchFileImport = '';
  var matchesFileImport = [];

  str = removeComments(str);

  while ((match = regex.exec(str)) !== null) {
    matchFileImport = match["input"];
    matchesFileImport.push(match[0]);
    matches.push(match[1]);
  }

  matchesFileImport.forEach(function(match) {
    // Code other than "@import" goes here.
    if (styleExt == "scss" || styleExt == "sass" || styleExt == "less") {
      matchFileImport = matchFileImport.replace(match + ";", '');
    } else if (styleExt == "styl" || styleExt == "stylus") {
      matchFileImport = matchFileImport.replace(match, '');
    }
  });

  matches.forEach(function(match) {
    // Check if it's a filename
    var path = match.split('/');
    var filename, fullpath, _basepath = basepath;

    if (path.length > 1) {
      filename = path.pop();
      var something, basepathParts;
      if (_basepath) {
        basepathParts = _basepath.split('/');
      }
      while ((something = path.shift()) === '..') {
        basepathParts.pop();
      }
      if (something) {
        path.unshift(something);
      }
      _basepath = (basepathParts ? basepathParts.join('/') + '/' : '') + path.join('/');
    } else {
      filename = path.join('');
    }
    if (filename === "*") {
      // Removes "*" from filename.
      filename = '';
      var files;
      files = getFiles(_basepath + '/' + filename);
      if (files.length) {
        files.forEach(function(file) {
          $.ajax({
            url: file,
            async: false,
            cache: true,
            success: function(data){
              var separateFile = separate(data);
              separateFile.forEach(function(css){
                css.code = removeComments(css.code);
                finalCss.push(css.code + "\n\n");
              });
            }
          });
        });
      }
    } else {
      // Adds filename.
      if (styleExt == "scss" || styleExt == "sass") {
        filename = "_" + filename + '.' + styleExt;
      } else {
        filename = filename + '.' + styleExt;
      }
    }
    if (filename != '') {
      fullpath = _basepath + '/' + filename;
      var importContent = fullpath;
      var files;
      $.ajax({
        url: importContent,
        async: false,
        cache: true,
        success: function(data){
          files = findImports(data, _basepath, styleExt);
          if (files.length) {
            files.forEach(function(file) {
              var separateFile = separate(file);
              separateFile.forEach(function(css) {
                css.code = removeComments(css.code);
                finalCss.push(css.code + "\n\n");
              });
            });
          }

          var matchFileImportChild = '';
          var matchesFileImportChild = [];

          while ((match = regex.exec(data)) !== null) {
            matchFileImportChild = match["input"];
            matchesFileImportChild.push(match[0]);
          }
          matchesFileImportChild.forEach(function(match) {
            // Code other than "@import" goes here.
            if (styleExt == "scss" || styleExt == "sass" || styleExt == "less") {
              data = data.replace(match + ";", '');
            } else if (styleExt == "styl" || styleExt == "stylus") {
              data = data.replace(match, '');
            }
          });

          var separateFile = separate(data);
          separateFile.forEach(function(css){
            css.code = removeComments(css.code);
            finalCss.push(css.code + "\n\n");
          });
        }
      });
    }
  });

  // Adds code other than "@import"
  matchFileImport = removeComments(matchFileImport);
  finalCss.unshift(matchFileImport);

  return finalCss;
}
