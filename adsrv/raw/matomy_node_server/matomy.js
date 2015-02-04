var express = require('express');
var app = express();
var routes_load_data = require('./routes/repositoryUpdate.js');

app.get('/*', function(req, res, next) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	next();
});


// //refresh matomy_data/ad/banners files
// //http://localhost:3000/refresh_banners
// app.get('/refresh_banners',routes_load_data.refresh_banners);

// //refresh matomy_data/programs
// //http://localhost:3000/refresh_programs
// app.get('/refresh_programs',routes_load_data.refresh_programs);

var server = app.listen(4000, function() {
	console.log('Listening on port %d', server.address().port);
});


process.on("SIGINT", function() {
   console.log("[matomy.js - child][exit] - Matomy Child SIGINT exiting");
   process.exit();
});

process.on("SIGTERM", function() {
   console.log("[matomy.js - child][exit] - Matomy Child SIGTERM detected");
   process.exit();
});

// process.on("exit", function() {
//    console.log("[matomy.js - child][exit] -  Matomy child exit detected");
//    process.exit();
// });

function init(){
   console.log("I'm Alive!");
   var bannerDone = false;
   var programDone = false;
	routes_load_data.refresh.refresh_programs(function(type){
      if(type=="programDone")
         programDone = true;
      if(bannerDone && programDone){
         console.log("KILL ME");
         //process.exit();
      }
   });
	routes_load_data.refresh.refresh_banners(function(type){
      if(type=="bannerDone")
         bannerDone = true;
      if(bannerDone && programDone){
         console.log("KILL ME");
         //process.exit();
      }
   });
};

init();