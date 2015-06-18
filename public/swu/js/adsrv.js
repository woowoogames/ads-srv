
'use strict';


var cnfg = {

    feeds : {

    	"us" : ["shopzilla", "pricegrabber", "shopping", "pricegong"],
        "de" : ["shopzilla", "kelkoo", "pricegong"]

    }

    
};


var adsrv = {
    
    mHndlr : null,
    mSearched: [],

    gt : function (st, hndlr) {
        
        adsrv.mHndlr = hndlr;

        var cntry = "us"; //////////////////////////////// $("#cntrs option:selected").val();
        var feeds = cnfg.feeds[cntry];

        adsrv.gtFeed(feeds.slice(0), st, cntry);

    },

    gtUrl : function (feed, st, cntry) {
    	var url = "http://offers.goverti.com/offers/" + feed + "/?" +
    	// var url = "http://localhost:3000/offers/" + feed + "/?" +
            "cntry=" + cntry +
            "&prdct=coms010" +
            "&st=" + encodeURIComponent(st) +
            "&ctgry=shopping" + /////////////////////////////////////////
            "&subid=1" +
            "&n=10" +
            "&callback=window.adsrv.jsonp.rslt";

    	adsrv.mSearched.push(st);
        return url;
    },

    gtFeed: function (feedsArr, st, cntry) {
    	console.log(feedsArr.length);
        var feed = feedsArr.pop();
        if (feed) {
        	var url = adsrv.gtUrl(feed, st, cntry);
        	console.log(url);
        	adsrv.jsonp.gt(url, function (data) {
        		console.log("rendering " + data.length + " offers");
                adsrv.mHndlr.renderOffers(data);    
                adsrv.gtFeed(feedsArr, st, cntry);
            });
        }
    },

    jsonp : {
        clbk: function () { },
        gt: function (url, clbk) {
            window.adsrv.jsonp.clbk = clbk;
            try {
                var s = document.createElement("script");
                s.async = true;
                s.src = url
                document.getElementsByTagName("head")[0].appendChild(s);
            }
			catch (e) { }
        },
        rslt: function (data) {
            window.adsrv.jsonp.clbk(data);
        }
    },

    searched: function () {

    }

};