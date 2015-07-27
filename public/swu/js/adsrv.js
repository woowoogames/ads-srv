
'use strict';


var dragDrop = {

	drpbl: null,
	drgbls: null,
	crntDrgblId: null,

	init: function () {

		dragDrop.drpbl = null;
		dragDrop.drgbls = null;
		dragDrop.crntDrgblId = null;

		dragDrop.drgbls = document.querySelectorAll('.myDrgbl');

		for (var i = 0 ; i < dragDrop.drgbls.length ; i++) {
			dragDrop.drgbls[i].addEventListener('dragstart', function (event) { dragDrop.dragstart(event) });
			dragDrop.drgbls[i].addEventListener('drag', function (event) { dragDrop.drag(event) });
			dragDrop.drgbls[i].addEventListener('dragend', function (event) { dragDrop.dragend(event) });
		}

		dragDrop.drpbl = document.getElementById("myDrpbl");
		dragDrop.drpbl.addEventListener('dragover', function (event) { dragDrop.dragover(event) });
		dragDrop.drpbl.addEventListener('dragenter', function (event) { dragDrop.dragenter(event) });
		dragDrop.drpbl.addEventListener('dragleave', function (event) { dragDrop.dragleave(event) });
		dragDrop.drpbl.addEventListener('drop', function (event) { dragDrop.drop(event) });
	},

	dragstart: function (event) {
		event.dataTransfer.effectAllowed = 'move';
		dragDrop.crntDrgblId = event.target.id;
	},

	drag: function (event) {

	},

	dragend: function (event) {
		//dragDrop.crntDrgbl = null;
	},

	dragover: function (event) {
		if (event.preventDefault) {
			event.preventDefault();
		}

		event.dataTransfer.dropEffect = 'move';
		return false;
	},

	dragenter: function (event) {
		event.target.className = "over";
	},

	dragleave: function (event) {
		event.target.className = "";
	},

	drop: function (event) {

		if (event.preventDefault) event.preventDefault();
		if (event.stopPropagation) event.stopPropagation();

		event.target.className = "";
		// event.target.innerHTML += event.dataTransfer.getData('text');

		console.log(dragDrop.crntDrgblId);
		// $("#" + dragDrop.crntDrgblId).hide();

		$("#" + event.target.id).append(($("#" + dragDrop.crntDrgblId)[0]));

		dragDrop.crntDrgblId = null;
		// Remove the element from the list.
		// document.querySelector('.myDrgbl').removeChild(dragDrop.crntDrgbl);

		return false;
	}
};


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