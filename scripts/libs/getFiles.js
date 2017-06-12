var getFiles = function(dirPath) {
  var filesArray = filesArray || [];
  $.ajax({
    url: dirPath,
    async: false,
    cache: true,
    success: function(data){
      $(data).find("a").slice(1).each(function(index){
        dataUrl = $(this).attr("href");

        newDirPath = dirPath + dataUrl;

        if (dataUrl.slice(-1) === '/') {
          filesArray = filesArray.concat(getFiles(newDirPath));
        } else {
          filesArray.push(newDirPath);
        }
      });
    }
  });
  
  return filesArray;
}