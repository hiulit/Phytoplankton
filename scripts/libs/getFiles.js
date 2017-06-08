function getFiles(dirPath, callback) { // dirPath must end with "/".
  var filesArray = filesArray || [];
  var request = new XMLHttpRequest();
  request.open('GET', dirPath, true);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      // Success!
      var parser = new DOMParser();
      var doc = parser.parseFromString(this.responseText, 'text/html');
      var query = Array.prototype.slice.call(doc.querySelectorAll('a'));
      query = query.slice(1);
      for (var i = 0, lengthQuery = query.length; i < lengthQuery; i++) {
        dataUrl = query[i].textContent;
        dataUrl = dataUrl.trim();

        newDirPath = dirPath + dataUrl;

        if (dataUrl.slice(-1) === '/') {
          // getFiles(newDirPath, filesArray);
          getFiles(newDirPath, function(filesArray) {
            console.log(filesArray);
          });
        } else {
          filesArray.push(newDirPath);
        }
      };

      if (typeof callback === 'function') callback(filesArray);
      // return filesArray;
    } else {
      // We reached our target server, but it returned an error
    }
  };

  request.onerror = function() {
    // There was a connection error of some sort
  };

  request.send();
};
