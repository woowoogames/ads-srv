
var baseApi = require('./baseapi'),
	utl = require('./utl'),
	_ = require("underscore"),
	utl = require("./utl"),
	fs = require("fs"),
	path = require("path"),
	lgcmngr = require("./lgcmngr");


var feedFilePath = path.join(path.dirname(__filename), "/data/feeds.js");
var rankFilePath = path.join(path.dirname(__filename), "/data/ranks.js");

var fsWatchHandl = 0;
var fsWatchRanks = 0;

var feedsMngr = {

	feedsMap: null,

	// public 
	init : function (clbk){
		feedsMngr.loadFeeds(clbk);
		fs.watch(feedFilePath, function(e){
			clearTimeout(fsWatchHandl);
			fsWatchHandl = setTimeout(function() {
				console.log(feedFilePath + " changed");
				feedsMngr.loadFeeds(function() {
					//console.dir(feedsMngr.feedsMap);
				});	
			},500);
		});
		fs.watch(rankFilePath,function(e){
			clearTimeout(fsWatchRanks);
			fsWatchRanks = setTimeout(function(){
				console.log(rankFilePath + " changed");
				lgcmngr.loadRanks(function(){
					console.log(rankFilePath + " loaded to memory");
				});
			},500);
		});
	},

	loadFeeds : function (clbk){
		try {
			// load the feedsmap into memory
			baseApi.readFile(feedFilePath, function (err, data) {
				if (!err) {
					feedsMngr.feedsMap = JSON.parse(data);
				}
				else {
					utl.log("[feedsmngr.js][loadFeeds::err] error getting feedsmap [" + err + "]");
				}

				clbk(err || 1);
			});
		}
		catch (e) {
			utl.log("[feedsmngr.js][loadFeeds::err] -- [" + e + "]");
			clbk(e);
		}
	},

	getFeeds : function (requestParams){
		var feeds = feedsMngr.filterFeeds(requestParams);

		var str = "[";
		for(var i=0 ; i<feeds.length ; i++){
			str += feeds[i].name + ",";
		}
		str = str.substring(0,str.length-1);
		utl.log("[feedsmngr.js][getFeeds] feeds found " + str + "]");
		return feeds;
	},

	filterFeeds: function (requestParams) {

        // console.log("feedsMngr::feedsMap=[" + feedsMngr.feedsMap + "]");

		// 1. get all active feeds.
		var activeFeeds = _.filter(feedsMngr.feedsMap, function (feed) {
			return feed.active;
		});

		// 2. filter by coverage filters
		activeFeeds = _.filter(activeFeeds, function (feed) {

			return _.every(feed.coverage, function (filterObject, filterName) {

				var queryVal, passTest = true, filterType = filterObject.type.toLowerCase(), foundMatch = false;
				filterName = filterName.toLowerCase();
				if (filterName in requestParams) {

					queryVal = requestParams[filterName];
					foundMatch = filterObject.values.indexOf(queryVal) > -1 || filterObject.values.indexOf("all") > -1;
					if (foundMatch && filterType === "black") {
						passTest = false;
					}
					else if (!foundMatch && filterType === "white") {
						passTest = false;
					}
				}

				return passTest;
			});
		});

		// 3. if we don't have search term exclude feeds that require search term.
		if (!requestParams.st) {
			activeFeeds = _.filter(activeFeeds, function (feed) {
				return !feed.requireSearchTerm;
			});
		}

        // console.log("feedsMngr::activeFeeds=[" + activeFeeds + "]");
		return activeFeeds;
	}

};


module.exports = feedsMngr;

