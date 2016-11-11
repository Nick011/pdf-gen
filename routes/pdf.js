var fs = require('fs')
	, path = require('path')
	, uuid = require('node-uuid')
	, rasterize = require('../lib/rasterize').rasterize
	, token = require('../lib/restrict').token;

exports.create = function(req, res) {
  var pdfName = uuid.v1() + '.pdf'
    , doc = req.body.doc;

  doc = '<!doctype html><html>'+ doc +'</html>';

  rasterize(doc, pdfName, function(err, file) {
		var context = {};
		if (err) {
			context.error = true;
			context.message = err;
			res.json(context, 500);
			return false;
		}

		context = ({
			url: [req.headers.host, 'pdf', file.name, token].join('/'),
			error: false,
			message: ''
		});

		res.set('Content-Type', 'text/plain');
		res.send(context);

		//delete file after 2 minutes
		(function(file) {
			setTimeout(function() {
				fs.unlink(file, function(err) {
					if (err) console.log('could not find file to delete');
				});
			}, 20000);
		})(file.path);

  });
};

exports.get = function(req, res) {
	var filePath = path.resolve(__dirname, '..', 'public/pdfs/', req.params.path);
	res.sendfile(filePath);
};
