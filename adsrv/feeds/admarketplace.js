var utils = require('util'),
baseApi = require("../baseapi"),
frmtr = require("../formatter");

var admarketplace = function () {
	this.mClbk = null;
	this.mPrms = null;
	var that = this;

	this.getOffers = function (prms, clbk) {
		this.mPrms = prms;
		this.mClbk = clbk;
		try {
			var url = this.getURL();
			var n = prms.n || 10;
			console.log(url);
			baseApi.httpGetTimeout(url, function (error, response, body) {
				var json = baseApi.xmlToJSON(body);
				console.log("check");
			});
		}
		catch(err){
			that.mClbk(1, e);
		}
	}

	this.getURL = function(){
		var ua = "Mozilla%2F5.0%20(Windows%20NT%206.1%3B%20WOW64)%20AppleWebKit%2F537.36%20(KHTML%2C%20like%20Gecko)%20Chrome%2F38.0.2125.111%20Safari%2F537.36";
		var ip = that.mPrms.ip;
		var st = that.mPrms.st;
		var subid = that.mPrms.subid;
		var n = that.mPrms.n;
		var url = "http://montiera.ampfeed.com/xmlamp/feed?partner=pub_montiera&v=2&kw=" + st + "&img=1&ptype=pc&puburl=ebay.com&sub1=" + subid + "&results=" + n + "&ip=" + ip + "&proxy-ip=" + ip + "&ua="+ua+"&rfr=montiera.com";
		return url;
	}
};

module.exports = admarketplace;