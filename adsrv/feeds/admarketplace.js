var utils = require('util'),
baseApi = require("../baseapi"),
utl = require("../utl");
frmtr = require("../formatter");

var admarketplace = function () {
	this.mClbk = null;
	this.mPrms = null;
	var that = this;

	this.getOffers = function (prms, clbk) {
		this.mPrms = prms;
		this.mClbk = clbk;
		try {
			if(typeof prms.type === "undefined"){
				var n = prms.n || 10;
				var url = this.getURL(prms.type);
				baseApi.httpGetTimeout(url, function (error, response, body) {
					if(error){
						that.mClbk(1, "[admarketplace.js][getOffers::err] -- fatal error [" + err + "]");
						return;
					}
					var data = baseApi.xmlToJSON(body);
					if(typeof data.result.adlistings !== 'undefined'){
						var results = that.format(data.result.adlistings.listing,prms.type);
						utl.log("[admarketplace.js][getOffers] - return [" + results.length + "] results");
						that.mClbk(0, results);
					}
					else{
						utl.log("[admarketplace.js][getOffers] - return 0 results");
						that.mClbk(0, []);
					}
				});
			}
			else{//serp
				if(prms.type === 'serp'){
					var n = prms.n || 10;
					var url = this.getURL(prms.type);
					baseApi.httpGetTimeout(url, function (error, response, body) {
						if(error){
							that.mClbk(1, "[admarketplace.js][getOffers::err] -- fatal error [" + err + "]");
							return;
						}
						var data = baseApi.xmlToJSON(body);
						if(typeof data.result.adlistings !== 'undefined'){
							var results = that.format(data.result.adlistings.listing,prms.type);
							//utl.log("[admarketplace.js][getOffers] - return 0 results");
							that.mClbk(0, results);
						}
						else{

						}
					});
				}
			}
		}
		catch(err){
			that.mClbk(1, "[admarketplace.js][getOffers::err] -- fatal error [" + err + "]");
		}
	}

	this.format = function(offers,type){
		try{
			var rsltArr = [];
			try{
				if(Array.isArray(offers)){
					for(var i=0 ; i<offers.length; i++){
						var obj = frmtr.getOfferObject();
						obj.typ = "img";
						if(type=='serp')
							obj.ofrtype = "serp";
						else
							obj.ofrtype = "feed";
						obj.desc.short = offers[i].description;
						obj.img.small = offers[i].thumbnail;
						obj.meta.feed = "admrktplce";
						obj.meta.cntry = that.mPrms.cntry;
						obj.meta.ctgry = that.mPrms.ctgry;
						obj.meta.prdct = that.mPrms.prdct;
						obj.meta.sz = null;
						obj.lnk = offers[i].clickurl;
						obj.uid = "admrktplce";
						rsltArr.push(obj);
					}
				}
				else{
					var obj = frmtr.getOfferObject();
					obj.typ = "img";
					if(type=='serp')
						obj.ofrtype = "serp";
					else
						obj.ofrtype = "feed";
					obj.desc.short = offers.description;
					obj.img.small = offers.thumbnail;
					obj.meta.feed = "admrktplce";
					obj.meta.cntry = that.mPrms.cntry;
					obj.meta.ctgry = that.mPrms.ctgry;
					obj.meta.prdct = that.mPrms.prdct;
					obj.meta.sz = null;
					obj.lnk = offers.clickurl;
					obj.uid = "admrktplce";
					rsltArr.push(obj);
				}

			}
			catch(e){
				utl.log("[admarketplace.js][format::err] -- [" + e + "]");
			}
			return rsltArr;			
		}
		catch(err){
			utl.log("[admarketplace.js][format::err] -- [" + e + "]");
		}
	}

	this.getURL = function(type){
		var url;
		var ua = "Mozilla%2F5.0%20(Windows%20NT%206.1%3B%20WOW64)%20AppleWebKit%2F537.36%20(KHTML%2C%20like%20Gecko)%20Chrome%2F38.0.2125.111%20Safari%2F537.36";
		var ip = that.mPrms.ip;
		var st = that.mPrms.st;
		var prdct = that.mPrms.prdct;
		var n = that.mPrms.n;
		if(type == 'serp'){
			url = "http://montiera_search_us.ampfeed.com/xmlamp/feed?partner=pub_montiera_search_us&v=2&kw=" + st + "&results=" + n + "&ip=" + ip + "&proxy-ip=" + ip + "&ua=" + ua;
		}
		else{
			url = "http://montiera.ampfeed.com/xmlamp/feed?partner=pub_montiera&v=2&kw=" + st + "&img=1&ptype=pc&puburl=ebay.com&sub1=" + prdct + "&results=" + n + "&ip=" + ip + "&proxy-ip=" + ip + "&ua="+ua+"&rfr=montiera.com";
		}
		return url;
	}
};

module.exports = admarketplace;