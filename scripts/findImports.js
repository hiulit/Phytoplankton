var find_imports = function(str, basepath, styleExt) {
  var finalCss = finalCss || [];
  var regex = /(?:(?![\/*]])[^\/* ]|^ *)@import ['"](.*?)['"](?![^*]*?\*\/)/g;
  var match, matches = [];
  var matchFileImport = "";
  var matchesFileImport = [];

  str = that.remove_comments(str);

  while ((match = regex.exec(str)) !== null) {
    matchFileImport = match["input"];
    matchesFileImport.push(match[0]);
    matches.push(match[1]);
  }

  _.each(matchesFileImport, function(match) {
    // Code other than "@import" goes here.
    if (styleExt == "scss" || styleExt == "sass" || styleExt == "less") {
      matchFileImport = matchFileImport.replace(match + ";", "");
    } else if (styleExt == "styl" || styleExt == "stylus") {
      matchFileImport = matchFileImport.replace(match, "");
    }
  });

  _.each(matches, function(match) {
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
      filename = "";
      var files;
      files = that.get_files(_basepath + '/' + filename);
      if (files.length) {
        _.each(files, function(file) {
          $.ajax({
            url: file,
            async: false,
            cache: true,
            success: function(data){
              var separate = that.separate(data);
              _.each(separate, function(css){
                css.code = that.remove_comments(css.code);
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
    if (filename != "") {
      fullpath = _basepath + '/' + filename;
      var importContent = fullpath;
      var files;
      $.ajax({
        url: importContent,
        async: false,
        cache: true,
        success: function(data){
          files = that.find_imports(data, _basepath, styleExt);
          if (files.length) {
            _.each(files, function(file) {
              var separate = that.separate(file);
              _.each(separate, function(css){
                css.code = that.remove_comments(css.code);
                finalCss.push(css.code + "\n\n");
              });
            });
          }

          var matchFileImportChild = "";
          var matchesFileImportChild = [];

          while ((match = regex.exec(data)) !== null) {
            matchFileImportChild = match["input"];
            matchesFileImportChild.push(match[0]);
          }
          _.each(matchesFileImportChild, function(match) {
            // Code other than "@import" goes here.
            if (styleExt == "scss" || styleExt == "sass" || styleExt == "less") {
              data = data.replace(match + ";", "");
            } else if (styleExt == "styl" || styleExt == "stylus") {
              data = data.replace(match, "");
            }
          });

          var separate = that.separate(data);
          _.each(separate, function(css){
            css.code = that.remove_comments(css.code);
            finalCss.push(css.code + "\n\n");
          });
        }
      });
    }
  });

  // Adds code other than "@import"
  matchFileImport = that.remove_comments(matchFileImport);
  finalCss.unshift(matchFileImport);

  return finalCss;
}
