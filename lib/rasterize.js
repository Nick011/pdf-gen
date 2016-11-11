var webshot = require('webshot');

exports.rasterize = function(doc, pdfName, cb) {
  var file = {
    name: pdfName,
    path: 'public/pdfs/' + pdfName
  };

  var paperSize = {
    margin: '.25cm',
    format: 'A4',
    orientation: 'portrait'
  };

  var windowSize = {
      width: 1024,
      height: 768
  };

  var options = {
    paperSize: paperSize,
    siteType: 'html',
    windowSize: windowSize
  };

  webshot(doc, file.path, options, function(err) {
    if (err) {
      cb(err, null);
      return false;
    }
    else {
      cb(null, file);
    }
  });
};
