var express = require('express');
var app = express();
var routes_generate = require('./routes/generator.js');
var routes_load_data = require('./routes/ajax_req.js');

app.get('/*', function(req, res, next) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	next();
});

//http://localhost:3000/get_banner?size=728x90&country=us&category=Dating&n=10
app.get('/get_banner',routes_generate.generat);

//refresh matomy_data/ad/banners files
//http://localhost:3000/refresh_banners
app.get('/refresh_banners',routes_load_data.refresh_banners);

//refresh matomy_data/programs
//http://localhost:3000/refresh_programs
app.get('/refresh_programs',routes_load_data.refresh_programs);

var server = app.listen(4000, function() {
	console.log('Listening on port %d', server.address().port);
});


process.on("SIGINT", function() {
   console.log("Matomy Child SIGINT exiting");
   process.exit();
});

process.on("SIGTERM", function() {
   console.log("Matomy Child SIGTERM detected");
   process.exit();
});

process.on("exit", function() {
   console.log("Matomy Child exit detected");
   process.exit();
});
