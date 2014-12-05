// middlewares
var util = require('util');

var token = 'DAL2J02NR2843N3BP3S8049NZQ4U292NN22393RH2380R23';

var checkToken = function(req, res, next) {
	var sentToken = req.param('token') || JSON.parse(req.rawBody).token;
	if (sentToken !== token) {
		var c = {
			url: '',
			error: true,
			message: 'Your token does not match.'
		};
		res.set('Content-Type', 'text/plain');
		res.send(c);
	}
	else {
		next();
	}
};

module.exports = {
	token: token,
	checkToken: checkToken
};
