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
    path = require("path"),
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
            if(this.mPrms.type === 'ddls'){ // only ddls
                this.mPrcsCount = 1;
                this.getDdls();    
            }
            else if(this.mPrms.type === 'trnds'){// only/trnds
                this.mPrcsCount = 1;
                this.getTrnds();
            }
            else{
                this.getAsyncOffers();
                this.getDdls();
                this.getAsyncRawOffers();
                this.getTrnds();
            }
		}
		catch (e) { }
	};

	this.processOffers = function (typ, offers) {

		if (!offers) {
			utl.log("[offrsmngr.js][processOffers] - processing offers by [" + typ + "] offers is null");
		}
		else {
			// utl.log("[offrsmngr.js][processOffers] - processing offers by [" + typ + "] len [" + offers.length + "]");
			if (offers && offers.length > 0) {

				try {
					if (!that.mRsltsArr[typ]) {
						that.mRsltsArr[typ] = [];
					}
					for (var i = 0 ; i < offers.length ; i++) {
						that.mRsltsArr[typ].push(offers[i]);
					}
				}
				catch (e) { }
			}
		}

		utl.log("[offrsmngr.js][processOffers] - processing offers left [" + (that.mPrcsCount - 1) + "]");

		if ((--that.mPrcsCount) == 0) {
			utl.log("[offrsmngr.js][processOffers] - processing offers done.");
			that.mClbk(0, that.mRsltsArr);
		}

	};

    this.getAsyncOffers = function () {

    	utl.log("[offrsmngr.js][getAsyncOffers] - feeds left [" + that.mFeeds.feeds.length + "]");

    	if (that.mFeeds.feeds.length == 0) {
    		that.processOffers("feeds", []);
    		return;
    	}

    	var feed = that.mFeeds.feeds.pop();

    	if (!feed) {
    		that.processOffers("feeds", []);
    		return;
    	}

    	var feedHandler = mdlsMngr.modules.feed[feed.name];
    	utl.log("[offrsmngr.js][getAsyncOffers] - trying feed [" + feed.name + "]");

    	if (!feedHandler) {
    		utl.log("[offrsmngr.js][getAsyncOffers::err] - failed to load module [" + feed.name + "]");
    		that.getAsyncOffers();
    		return;
    	}

    	var worker = new feedHandler();
    	worker.getOffers(that.mPrms, function (error, offers) {
    		try{
    			utl.log("[offersmngr.js][getAsyncOffers][worker.getOffers] - status [" + error + "]");
    			if (error || !offers || !offers.length) {
    				that.getAsyncOffers(); // try another feed
    			}
    			else {
    				that.processOffers("feeds", offers);
    			}
    		}
    		catch (e) {
    			that.getAsyncOffers(); // try another feed
    		}
    	});
    };

    this.getDdls = function () {
    	try {
    		if (that.mFeeds.ddls.length > 0) {
    			var offers = ddlsMngr.getOffers(that.mPrms);
    			if (offers && offers.constructor === Array) {
    				that.processOffers("ddls", offers);
    				return;
    			}
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
    		utl.log("[offersmngr.js][getAsyncRawOffers::err] - failed to load module [" + raw.name + "]");
    		that.getAsyncRawOffers();
    		return;
    	}
    	var worker = new feedHandler();
    	worker.getOffers(that.mPrms, function (error, offers) {
    		try {
    			utl.log("[offersmngr.js][getAsyncRawOffers][worker.getOffers] - status [" + error + "]");
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
    		if (that.mFeeds.trnds.length > 0) {
    			var offers = trndsMngr.getOffers(that.mPrms);
    			if (offers && offers.constructor === Array) {
    				that.processOffers("trnds", offers);
    				return;
    			}
    		}
    	}
    	catch (e) { }
    	that.processOffers("trnds", []);
    }

};

var mdlsMngr ={
    mapData : {},
    modules : {
        "feed":{},
        "raw":{},
        "ddls":{},
        "trnds":{}
    },
    require_modules : function(clbk){
        try{
            mdlsMngr.loadFeeds(function(){
                for(var i=0 ; i< mdlsMngr.mapData.length ; i++){
                    if(mdlsMngr.mapData[i].active){
                        var currentModule = require(mdlsMngr.mapData[i].handler);
                        var fileName = mdlsMngr.mapData[i].handler.replace(/^.*[\\\/]/, '');
                        mdlsMngr.modules[mdlsMngr.mapData[i].type][fileName] = currentModule;
                    }
                }
            });
        }
        catch(e){
            utl.log("[offersmngr.js][mdlsMngr::err] error loding modules [" + e + "]");
	    clbk(0); 
        }
        clbk(1);
    },
    loadFeeds : function (clbk){
        try {
            // load the feedsmap into memory
            baseApi.readFile(path.join(path.dirname(__filename), "/data/feeds.js"),'utf8',function (err, data) {
                if (!err) {
                    mdlsMngr.mapData = JSON.parse(data);
                }
                else {
                    console.log("feedsMngr::loadFeeds:: error getting feedsmap");
                }
                clbk(err || 1);
            });
        }
        catch (e) {
            clbk(e);
        }
    },
    init : function(clbk){
        mdlsMngr.require_modules(clbk);
    }
}

module.exports = {
    mdlsMngr : mdlsMngr,
    offersMngr : offersMngr
}