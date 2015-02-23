

var baseApi = require('./baseapi'),
	utl = require("./utl"),
	path = require("path");

var lgcMngr = {

	mRankMap : null,

	init : function (clbk){
		lgcMngr.loadRanks(clbk);
	},

	// called by the rsrcMngr
	loadRanks : function (clbk){
		try {
			// load the feedsmap into memory
			baseApi.readFile(path.join(path.dirname(__filename), "/data/ranks.js"), function (err, data) {
				if (!err) {
					lgcMngr.mRankMap = JSON.parse(data);
				}
				else {
					utl.log("[lgcmngr.js][loadRanks::err] - error getting mRankMap [" + err +"]");
				}

				clbk(err || 1);
			});
		}
		catch (e) {
			utl.log("[lgcmngr.js][loadRanks::err] -- [" + e + "]");
			clbk(e);
		}
	},

	sortFeeds: function (requestParams, pFeeds) {
		var cntry = requestParams.cntry;

		if (!pFeeds || pFeeds.constructor !== Array || pFeeds.length == 0) {
			return [];
		}

		var rslts = {
			feeds: [],
			ddls: [],
			raw: [],
			trnds : []
		};

		for (var i = 0 ; i < pFeeds.length ; i++) {
			var crnt = pFeeds[i];
			switch (crnt.type) {
				case "feed":
					rslts.feeds.push(crnt);
					break;
				case "raw":
					rslts.raw.push(crnt);
					break;
				case "ddls":
					rslts.ddls.push(crnt);
					break;
				case "trnds":
					rslts.trnds.push(crnt);
					break;
			}
		}

		rslts.feeds = lgcMngr.sortByRank(cntry, rslts.feeds);
		rslts.raw = lgcMngr.sortByRank(cntry, rslts.raw);

		if(requestParams.type == "serp"){
			rslts.feeds = lgcMngr.sortBySerp(cntry, rslts.feeds);
		}

		return rslts;
	},

	sortBySerp : function(cntry, feeds){
		var serp =[];
		var nonSerp = [];
		for(var i = 0 ; i < feeds.length ; i++){
			if(feeds[i].isSerp)
				serp.push(feeds[i]);
			else
				nonSerp.push(feeds[i]);
		}
		return nonSerp.concat(serp);
	},

	sortByRank: function (cntry, feeds) {
		try{
			if (feeds.length < 2) {
				return feeds;
			}

			feeds.sort(function (a, b) {
				return lgcMngr.gtRank(cntry, a.name) < lgcMngr.gtRank(cntry, b.name);
			});
		}
		catch (e) { }
		return feeds;
	},

	gtRank: function (cntry, feedName) {
		try{
			var ct = lgcMngr.mRankMap[cntry];
			if (ct) {
				var rnk = ct[feedName];
				if (rnk) {
					return rnk;
				}
			}
		}
		catch (e) { }
		return 10;
	},

	chooseOffers: function (requestParams, pOffers) {

		/*
			For now: choose 4 feeds, 3 raw, 2 ddls, 1 trnd
			Future: choose requestParams.n offers
		*/

		var rslts = [];
		if (pOffers.feeds) {
			for (var i = 0 ; i < pOffers.feeds.length && i < 4 ; i++) {
				rslts.push(pOffers.feeds[i]);
			}
		}

		if (pOffers.raw) {
			for (var i = 0 ; i < pOffers.raw.length && i < 3 ; i++) {
				rslts.push(pOffers.raw[i]);
			}
		}

		if (pOffers.ddls) {
			var count = 2;
			if (rslts.length < 4) {
				count = 6;
			}
			for (var i = 0 ; i < pOffers.ddls.length && i < count ; i++) {
				rslts.push(pOffers.ddls[i]);
			}
		}

		if (pOffers.trnds) {
			for (var i = 0 ; i < pOffers.trnds.length && i < 1 ; i++) {
				rslts.push(pOffers.trnds[i]);
			}
		}

		return rslts;
	}
	
};


module.exports = lgcMngr;

