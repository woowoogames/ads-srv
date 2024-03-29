﻿
/*

add typ to the parameters from the client (for Montiera only)
typ=0 - all
typ=1 - ecmmrce
typ=2 - serp
typ=3 - trnd
typ=4 - rtrgt

add IP to the parameters from the client ? 



debug in Chrome:
> npm install -g node-inspector
> node-debug app.js

> npm install nodemon
-- this will monitor a folder for changes.. if change occures it will restart the server.
and then you can use:
>nodemon app.js


should we put the hardid->UCD in radis? we can then collect info about the user..

 */

var APPLICATION_NAME = process.env.STRONGLOOP_APP_NAME || 'vertical-add-server';
var API_KEY = 'a962830f5d6aad44063364defe5a05ed';
require('strong-agent').profile(API_KEY, APPLICATION_NAME);


var express = require('express');
var cluster = require('cluster');
var http = require('http');
var path = require('path');
var utl = require("./adsrv/utl");
var numCPUs = 1; // require('os').cpus().length;
var baseApi = require('./adsrv/baseapi');
var rsrcMngr = require('./adsrv/rsrcmngr');
var tools = require('./tools/tools');
var adsrv = require('./adsrv/main');
var priceGrabberTest = require('./adsrv/feeds/priceGrabberTestPage');


var app = express();

// all environments

var port = process.argv[2] || 80;

utl.log("[app.js] port = " + port);
app.set('port', port); // 49421

// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
app.use(express.favicon());
// app.use(express.logger('dev'));
app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/adsrv'));
/////////////////////////////// app.use(express.session({ secret : "123" }));
app.use(express.urlencoded());
app.use(express.methodOverride());



app.use(app.router); // first find the valid rout and then call connect middleware functions

var notFoundErrorHandler = function (req, res, next) {
	// handle 404 
	res.status = 404;
	res.description = "Not Found";
	// res.send();
	// utl.log("404 error !!!");
    utl.log("[main.js][processRequest] - invalid request");
    res.jsonp({status : "invalid request"});
};

var globalErrorHandler = function (err, req, res, next) {
	// next();
	// handle 500 (internal server error)
	utl.log("global error !!! [" + err + "] -- [" + err.stack + "]");
};

app.use(notFoundErrorHandler);
app.use(globalErrorHandler);


// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'vash');

utl.log("[app.js] express loaded");
utl.log("\n");

//app.use(require('stylus').middleware(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

// app.get('/log', log.index); // logger on the server
//app.get('/rpt', rpt.index); // client reports 
// http://localhost:3000/offers/300/?cntry=us&prdct=coms001&st=xbox&ctgry=mobile&subid=&n=10&ip=&typ


app.get('/offers/:qa/:type', adsrv.processRequest);
app.get('/offers/:type', adsrv.processRequest);
app.get('/offers', adsrv.processRequest);
app.post('/updateFeed',rsrcMngr.postUpdateFeed);
app.get('/tools/:fn',tools.getData);
app.post('/tools/:fn',tools.getData);

app.get('/priceGrabberTestPage',priceGrabberTest);



adsrv.init();
// Workers shares TCP connection -- In this case its a HTTP server
// utl.log('worker #' + cluster.worker.id + " process #" + cluster.worker.process.pid + " listening on port #" + app.get('port'));
http.createServer(app).listen(app.get('port'), function () {
	setTimeout(function () {
		utl.log("[app.js] Express server listening on port " + app.get('port') + "\n");
	}, 200);
});

process.on("SIGINT", function() {
      utl.log("\n\n\n******************************** - app.js process - SIGINT - Killed - ********************************]");
      baseApi.killAll();
      process.exit();
});

process.on('uncaughtException', function (err) {
    console.log( "UNCAUGHT EXCEPTION ", arguments );
    console.log( "[Inside 'uncaughtException' event] " + err.stack || err.message );
});



 

// var matomyUpdate = new CronJob({
//   cronTime: '00 00 * * * *',
//   onTick: function() {
//     	//console.log("Matomy update");
//     	exec(['node', path.join(path.dirname(__filename),"/adsrv/raw/matomy_node_server/matomy.js")],
//     		{timeout:1000 * 60 * 60 * 2,killSignal:'SIGINT'},//kill process after 2 hours
//     		function(err, out, code) {
// 	    		if (err instanceof Error)
// 	    			throw err;
// 	    		process.stderr.write(err);
// 	    		process.stdout.write(out);
//         	});
//   },
//   start: true
// });



