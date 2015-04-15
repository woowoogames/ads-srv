

var feedsMngr = require('./feedsmngr'),
baseApi = require("./baseapi"),
path = require("path"),
ddlsMngr = require('./ddls/ddlmngr'),
utl = require("./utl"),
lgcMngr = require('./lgcmngr'),
Promise = require('bluebird');


var feedFilePath = path.join(path.dirname(__filename), "/data/feeds.js");
var rankFilePath = path.join(path.dirname(__filename), "/data/ranks.js");

// load the system resources
var rsrcMngr = {
	postUpdateFeed : function(req,res){
		debugger;debugger;
		rsrcMngr.updateFeed(req.body).then(function(){
			res.jsonp({"status": "ok"});
		}).catch(function(){
			res.jsonp({"status": "error"});
		});
	},
	updateFeed : function(feedToUpdate){
		return new Promise(function(resolve,reject){
			baseApi.readFile(feedFilePath,function(err,data){
				if(!err){
					var allFeeds = JSON.parse(data);
					var removeAt;
					for(feed in allFeeds){
						if(feedToUpdate.name == allFeeds[feed].name){
							removeAt = feed;
						}
					}
					allFeeds.splice(removeAt,1);
					allFeeds.splice(removeAt,0,feedToUpdate);
					rsrcMngr.updateRank(feedToUpdate.coverage.cntry.values,feedToUpdate.name).then(function(ranks){
						baseApi.renameFileSync(path.join(path.dirname(__filename), "/data/ranks.js"),path.join(path.dirname(__filename), "/data/ranks_backup.js"));
					    baseApi.writeFileSync(path.join(path.dirname(__filename), "/data/ranks.js"),JSON.stringify(ranks,null,"\t"));
					    baseApi.renameFileSync(path.join(path.dirname(__filename), "/data/feeds.js"),path.join(path.dirname(__filename), "/data/feeds_backup.js"));
					    baseApi.writeFileSync(path.join(path.dirname(__filename), "/data/feeds.js"),JSON.stringify(allFeeds,null,"\t"));
					 	console.log("done!");
					 	//to do
					 	//check if ranks.js reload to memory after update
					 	//when adding country to feed update ranks.js file!
					}).catch(function(){
						console.log("bad");
					});
					resolve();
				}
				reject();
			});
		});
	},
	updateRank : function(geos,feedName){
		return new Promise(function(resolve,reject){
			baseApi.readFile(rankFilePath,function(err,data){
				if(!err){
					var ranks = JSON.parse(data);
					var ranksGeos = Object.keys(ranks);
					for(var i=0 ; i<geos.length ;i++){
						if(ranksGeos.indexOf(geos[i])==-1){
							ranks[geos[i]] = {};
						}
					}
					for(var rank in ranks){
						if(geos.indexOf(rank)!=-1 && Object.keys(ranks[rank]).indexOf(feedName)==-1){
							ranks[rank][feedName] = 1;
						}
						else if(geos.indexOf(rank)==-1 && Object.keys(ranks[rank]).indexOf(feedName)!=-1){
							delete ranks[rank][feedName];
						}
					}
					resolve(rsrcMngr.sortRanks(ranks));
				}
				reject();
			});
		});
	},
	sortRanks:function(ranks){
		var sortedKeys = Object.keys(ranks).sort();
		var sortedRanks = {};
		for(var ind in sortedKeys){
			sortedRanks[sortedKeys[ind]] = ranks[sortedKeys[ind]];
		}
		return sortedRanks;
	},
	init: function (clbk) {
		/*
		setInterval(function () {
			rsrcMngr.loadFeeds("http://cdn.montiera.com/coms/adsrv/feeds.js", "/ddls/data.js", function () {
				feedsMngr.loadFeeds(function (status) {
					utl.log("[rsrcmngr.js][init][feedsMngr.loadFeeds] - status = [" + status + "]");
				});
			});
		// }, 1000 * 20); // debug
		}, 1000 * 60 * 60 * 24); // 24 hours

		setInterval(function () {
			rsrcMngr.loadFeeds("http://cdn.montiera.com/coms/adsrv/ranks.js", "/data/ranks.js", function () {
				lgcMngr.loadRanks(function (status) {
					utl.log("[rsrcmngr.js][init][lgcMngr.loadRanks] - status = [" + status + "]");
				});
			});
		}, 1000 * 60 * 60); // 1 hour
*/
		// setInterval(function () {
		// 	baseApi.fork('./adsrv/raw/matomy_node_server/matomy.js');
		// }, 1000 * 10 * 10); // temp - 10 min 
setInterval(function () {
	rsrcMngr.loadFeeds("http://cdn-int.montiera.com/data/coms/lgc.js", "/ddls/data.js", function () {
		ddlsMngr.loadDdls(function (status) {
			utl.log("[rsrcmngr.js][init][ddlsMngr.loadDdls] - status = [" + status + "]");
		});
	});
		// }, 1000 * 5); // debug
		}, 1000 * 60 * 15); // temp - 15 min 

clbk(1);
},

loadFeeds: function (url, file, loader) {

	baseApi.httpGet(url + "?rnd=" + rsrcMngr.rnd(), function (error, response, data) {

		if (error || !data) {
			utl.log("[rsrcmngr.js][loadFeeds::err] - error downloading file [" + url + "]");
			return;
		}

		var newFeed = data;
		baseApi.readFile(path.join(path.dirname(__filename), file), function (err, cntnt) {

			var crntFeed = cntnt;
			if (newFeed != crntFeed) {
				baseApi.writeFileSync(path.join(path.dirname(__filename), file), newFeed);
				loader();
			}

		});

	});
},

rnd: function () {
	return Math.floor(Math.random() * 1000) + 1;
}

};


module.exports = rsrcMngr;

