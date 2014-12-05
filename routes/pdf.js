var fs = require('fs')
	, path = require('path')
	, uuid = require('node-uuid')
	, rasterize = require('../lib/rasterize').rasterize
	, token = require('../lib/restrict').token;

exports.create = function(req, res) {
	var pdfName = uuid.v1() + '.pdf'
		, doc = req.param('doc') || JSON.parse(req.rawBody).doc;
	
	doc = '<!doctype html><html>'+ doc +'</html>';

  rasterize(doc, pdfName, function(err, file) {
		var c = {};
		if (err) {
			c.error = true;
			c.message = err;
			res.json(c, 500);
			return false;
		}

		c = ({
			url: file.name + '/' + token,
			error: false,
			message: ''
		});

		res.set('Content-Type', 'text/plain');
		res.send(c);

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
