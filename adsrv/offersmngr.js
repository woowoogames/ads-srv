/******************************************************************

	Offers provider (feed, raw, ddl) should implement:
	
	getOffers ( prms, feeds, clbk )
	
	assume you accept feeds in the following format

	@feeds = {

		feeds : [ the process will "pop" the most important one ],
		ddls : [],
		raw : [],
		trnds : []

	}

	You process the "feeds" asynchronously and the others one by one.

	@prms - {
			cntry : "",
			ctgry : "",
			n : "",  // number of offers to return (default is 10)

	}

	@clbk - callback to execute when done
	
	Return value: 
	@status code - 1 for success, 0 for error
	@JSON - hold the offers or the failure string 

*******************************************************************/

var baseApi = require('./baseapi'),
	ddlsMngr = require('./ddls/ddlmngr'),
	trndsMngr = require('./trnds/trndmngr'),
    utl = require("./utl"),
    fs = require('fs'),
	_ = require("underscore"); 

var offersMngr = function (requestParams, feeds, finalCallback) {

	this.mFeeds = feeds;
	this.mClbk = finalCallback;
	this.mPrms = requestParams;
	this.mPrcsCount = 4; // feeds, ddls, raw and trends
	this.mRsltsArr = [];
	this.mFeedTimerId = null;
	this.mFeedHandlers = {};

	var that = this;

	this.loadModule = function (feed) {
		try {
			return this.mFeedHandlers[feed.name] = require(feed.handler);
		}
		catch (e) { }
		return null;
	};

	this.getBestFeed = function (group) {
		return _.sample(group);
	};

	this.getOffers = function () {
		try {
			this.getAsyncOffers();
			this.getDdls();
			this.getAsyncRawOffers();
			this.getTrnds();
		}
		catch (e) { }
	};

	this.processOffers = function (typ, offers) {

		console.log("processing offers by [" + typ + "]");

		if (offers && offers.length) {
			if (!that.mRsltsArr[typ]) {
				that.mRsltsArr[typ] = [];
			}
			for (var i = 0 ; i < offers.length ; i++) {
				that.mRsltsArr[typ].push(offers[i]);
			}
		}

		console.log("processing offers left [" + (that.mPrcsCount - 1) + "]");

		if ((--that.mPrcsCount) == 0) {
			try{
				that.mClbk(0, that.mRsltsArr);
			}
			catch (e) { }
		}
	};

    this.getAsyncOffers = function () {

    	if (that.mFeeds.feeds.length == 0) {
    		that.processOffers("feeds", []);
    		return;
    	}

    	var feed = that.mFeeds.feeds.pop();

    	if (!feed) {
    		that.processOffers("feeds", []);
    		return;
    	}

    	var feedHandler = mdlsMngr.modules.feeds[feed.name];

    	if (!feedHandler) {
    		console.log("getAsyncOffers::err:: failed to load module");
    		that.getAsyncOffers();
    		return;
    	}
    	var worker = new feedHandler();

    	/*
    	that.mFeedTimerId = window.setTimeout(function () {
			// 2do - try another feed is the current one don't return after 2-3 seconds
    	}, 2000)
		*/

    	worker.getOffers(that.mPrms, function (error, offers) {
    		try{
    			if (error || !offers || !offers.length) {
                    utl.log("[offersmngr.js][worker.getOffers] - status [" + error +"]");
    				that.getAsyncOffers(); // try another feed
    			}
    			else {
                    utl.log("[offersmngr.js][worker.getOffers] - status [" + error +"]");
    				that.processOffers("feeds", offers);
    			}
    		}
    		catch (e) {
    			that.getAsyncOffers(); // try another feed
    		}
    	});
    };

    this.getDdls = function () {
    	try{
    		var offers = ddlsMngr.getOffers(that.mPrms);
    		if (offers && offers.constructor === Array) {
    			that.processOffers("ddls", offers);
    			return;
    		}
    	}
    	catch (e) { }
    	that.processOffers("ddls", []);
    };

    this.getAsyncRawOffers = function () {
    	if (that.mFeeds.raw.length == 0) {
    		that.processOffers("raw", []);
    		return;
    	}
    	var raw = that.mFeeds.raw.pop();
    	if (!raw) {
    		that.processOffers("raw", []);
    		return;
    	}
        var feedHandler = mdlsMngr.modules.raw[raw.name];

    	if (!feedHandler) {
    		console.log("getAsyncRawOffers::err:: failed to load module");
    		that.getAsyncRawOffers();
    		return;
    	}
    	var worker = new feedHandler();
    	worker.getOffers(that.mPrms, function (error, offers) {
    		try{
    			if (error || !offers || !offers.length) {
    				that.getAsyncRawOffers(); // try another feed
    			}
    			else {
    				that.processOffers("raw", offers);
    			}
    		}
    		catch (e) {
    			that.getAsyncRawOffers(); // try another feed
    		}
    	});
    };

    this.getTrnds = function () {
    	try {
    		var offers = trndsMngr.getOffers(that.mPrms);
    		if (offers && offers.constructor === Array) {
    			that.processOffers("trnds", offers);
    			return;
    		}
    	}
    	catch (e) { }
    	that.processOffers("trnds", []);
    }

};

var mdlsMngr ={
    modules : {
        "feeds":{},
        "raw":{},
        "ddls":{},
        "trnds":{}
    },
    require_modules : function(clbk){
        try{
            var all_modules = [];
            for(var type in mdlsMngr.modules){
                all_modules = all_modules.concat(this.createArray(type,fs.readdirSync("./adsrv/"+type+"/")));
            }
            //load each module in all_modules array --> all files in the four folders ddls/feeds/raw/trnds
            for(var i=0 ; i<all_modules.length ; i++){
                if(all_modules[i].file.indexOf(".js")!=-1 && all_modules[i].file!="data.js"){
                    var fileName = all_modules[i].file.replace(".js","");
                    var currModule = require("./"+ all_modules[i].type +"/"+ fileName);
                    //mdlsMngr.modules[all_modules[i].type].push(currModule);
                    mdlsMngr.modules[all_modules[i].type][fileName] = currModule;
                }
            }
        }
        catch(e){
            clbk("[offermngr.js][mdlsMngr::init] - error loding modules"); 
        }
        clbk("\n[offermngr.js][mdlsMngr::init] - modules loaded");
    },
    createArray : function(type,file_names){
        var answer =[];
        for(var i = 0; i<file_names.length ;i++){
            answer.push({file:file_names[i],type:type});
        }
        return answer;
    },
    init : function(clbk){
        mdlsMngr.require_modules(clbk);
    }
}

module.exports = {
    mdlsMngr : mdlsMngr,
    offersMngr : offersMngr
}