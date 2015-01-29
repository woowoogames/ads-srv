
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

console.log("start");

var express = require('express');
var cluster = require('cluster');
var http = require('http');
var path = require('path');
var numCPUs = 1; // require('os').cpus().length;

var routes = require('./routes');
var adsrv = require('./adsrv/main');


var app = express();

// all environments


var port = process.argv[2] || 3000;

console.log("port = " + port);
app.set('port', port); // 49421

// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
/////////////////////////////// app.use(express.session({ secret : "123" }));
app.use(express.urlencoded());
app.use(express.methodOverride());



app.use(app.router); // first find the valid rout and then call connect middleware functions

var notFoundErrorHandler = function (req, res, next) {
	// handle 404 
	res.status = 404;
	res.description = "Not Found";
	res.send();
	console.log("404 error !!!");
};

var globalErrorHandler = function (err, req, res, next) {
	// next();
	// handle 500 (internal server error)
	console.log("global error !!! [" + err + "] -- [" + err.stack + "]");
};

app.use(notFoundErrorHandler);
app.use(globalErrorHandler);


// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'vash');

console.log("express loaded");

//app.use(require('stylus').middleware(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

// app.get('/', routes.index);
// app.get('/log', log.index); // logger on the server
//app.get('/rpt', rpt.index); // client reports 
// http://localhost:3000/offers/300/?cntry=us&prdct=coms001&st=xbox&ctgry=mobile&subid=&n=10&ip=&typ

app.get('/offers/:size', adsrv.processRequest);
app.get('/offers', adsrv.processRequest);

//app.get('/300', adsrv.process..);
//app.get('/ddls', adsrv.process..);
//app.get('/trnds', adsrv.process..);
//app.get('/offers:sz', adsrv.process..);  

console.log("handlers set");

app.use(express.static(__dirname + '/public'));


adsrv.init();
// Workers shares TCP connection -- In this case its a HTTP server
// console.log('worker #' + cluster.worker.id + " process #" + cluster.worker.process.pid + " listening on port #" + app.get('port'));
http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});


console.log("server is ready");

/*
if (cluster.isMaster) {
    
    console.log("numCPUs = " + numCPUs);
    for (var i = 0; i < numCPUs; i++) {
        var w = cluster.fork();
        console.log('created worker #' + w.id + " process #" + w.process.pid);
    }
    
    cluster.on('exit', function (worker, code, signal) {
        console.log('worker ' + worker.process.pid + ' died');
    });
    
    adsrv.init();
} 
else if (cluster.isWorker) {
    
    // Workers shares TCP connection -- In this case its a HTTP server
    console.log('worker #' + cluster.worker.id + " process #" + cluster.worker.process.pid + " listening on port #" + app.get('port'));
    http.createServer(app).listen(app.get('port'), function () {
        console.log('Express server listening on port ' + app.get('port'));
    });
}
*/

// module.exports.app = app;
