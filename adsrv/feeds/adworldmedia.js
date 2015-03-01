var utils = require('util'),
baseApi = require("../baseapi"),
utl = require("../utl"),
frmtr = require("../formatter");
var whiteList = require("../data/adworldlist");

var adworldmedia = function () {
	this.mClbk = null;
	this.mPrms = null;

	var that = this;
	this.getOffers = function (prms, clbk) {
		utl.log("[adworldmedia.js][getOffers]");
		this.mPrms = prms;
		this.mClbk = clbk;
		try {
			if(prms.ctgry=="adult" && (typeof whiteList[prms.host] !== 'undefined')){
				var url = this.getURL();
				var n = prms.n || 10;
				baseApi.httpGetTimeout(url, function (error, response, body) {
					if(typeof body !== 'undefined'){
						var data = JSON.parse(body);
						if(typeof data.result !== 'undefined'){
							if(typeof data.result.listing !== 'undefined'){
								if(data.result.listing.length>0){
									var results = that.format(data.result.listing); 
									if(results.length>0){
										utl.log("[adworldmedia.js][getOffers(1)] - return [" + results.length + "] results");
										that.mClbk(0, results);
									}
									else {
										that.mClbk(1, "[adworldmedia.js][getOffers] - no results");
									}	
								}
								else{
									utl.log("[adworldmedia.js][getOffers] - return [0] results");
									that.mClbk(0, []);
								}
							}
							else{
								utl.log("[adworldmedia.js][getOffers] - return [0] results");
								that.mClbk(0, []);
							}
						}
						else{
							utl.log("[adworldmedia.js][getOffers] - return [0] results");
							that.mClbk(0, []);
						}
					}
					else{
						utl.log("[adworldmedia.js][getOffers] - return [0] results");
						that.mClbk(0, []);
					}
				});
			}
			else{
				utl.log("[adworldmedia.js][getOffers] - return [0] results");
				that.mClbk(0, []);
			}
		}
		catch (e) {
			utl.log("[adworldmedia.js][getOffers::err] -- fatal error [" + e + "]");
			that.mClbk(1, e);
		}
	};

	this.format = function (offers) {
		try{
			var rsltArr = [];
			for(var i=0 ; i<offers.length; i++){
				var obj = frmtr.getOfferObject();
				try{
					obj.typ = "img";
					obj.ofrtype = "feed";
					obj.desc.short = offers[i].site + " " + offers[i].title;
					obj.desc.long = offers[i].descr;
					obj.meta.feed = "adwrld";
					obj.meta.cntry = that.mPrms.cntry;
					obj.meta.ctgry = that.mPrms.ctgry;
					obj.meta.prdct = that.mPrms.prdct;
					obj.lnk = offers[i].url;
					obj.uid = "adwrld";
					rsltArr.push(obj);
				}
				catch(e){
					utl.log("[adworldmedia.js][format::err] -- [" + e + "]");
				}
			}
			return rsltArr;			
		}
		catch(err){
			utl.log("[adworldmedia.js][format::err] -- [" + e + "]");
		}
	};

    this.getURL = function (typ) {
    	var count = that.mPrms.n;
    	var ua = "Mozilla%2F5.0%20(Windows%20NT%206.1%3B%20WOW64%3B%20rv%3A13.0)%20Gecko%2F20100101%20Firefox%2F13.0.1";
    	var prdct = that.mPrms.prdct;
    	var st = that.mPrms.st;
    	var ip = that.mPrms.ip;
    	var referurl = that.mPrms.host;
    	var url = "http://xml.trafficfeeder.com/search?feed=41672&auth=J5bVSB&subid=" + prdct + "&ua=" + ua + "&url=" + referurl + "&user_ip=" + ip + "&query=" + st + "&count=" + count + "&format=json";
    	return url;
    }
};
module.exports = adworldmedia;

