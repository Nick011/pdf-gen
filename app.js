var express = require('express')
  , restrict = require('./lib/restrict')
  , routes = require('./routes')
  , pdf = require('./routes/pdf')
  , http = require('http')
  , path = require('path')
  , UAParser = require('ua-parser-js')
  , uaParser = new UAParser();

var app = express();

// cors middleware
var allowCrossDomain = function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');

	next();
};

// all environments
//app.enable("jsonp callback");
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(function(req, res, next) {
var browser = uaParser.setUA(req.headers['user-agent']).getBrowser();
if (browser.name === 'IE' && browser.major < 10) {
    var data = '';
    req.setEncoding('utf8');
    req.on('data', function(chunk) {
        data += chunk;
    });
    req.on('end', function() {
        req.rawBody = data;
        next();
    });
  }
  else {
    next();
  }
});
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(allowCrossDomain);
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if (app.get('env') === 'development') {
   app.use(express.errorHandler());
}

app.get('/', routes.index);
app.post('/pdf', restrict.checkToken, pdf.create);
app.get('/pdf/:path/:token', restrict.checkToken, pdf.get);

http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
