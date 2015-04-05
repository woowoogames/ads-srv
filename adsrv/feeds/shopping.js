
var utils = require('util'),
	baseApi = require("../baseapi"),
	utl = require("../utl")		
	frmtr = require("../formatter");


var shopping = function () {

	////////////////////////////////////////////////////////////////////////////////////////////////

	this.mClbk = null;
	this.mPrms = null;

	var that = this;

	this.getOffers = function (prms, clbk) {
		utl.log("[shopping.js][getOffers]");

		this.mPrms = prms;
		this.mClbk = clbk;
		try {
			var url = this.getURL("prdct");
			var n = prms.n || 10;
			baseApi.httpGetTimeout(url, function (error, response, body) {
				try {
					var data, selectOffers = [];
					if (!error && body) {
						//data = JSON.parse(body);
						data = baseApi.xmlToJSON(body);

						var itms = data.GeneralSearchResponse.categories.category.items;
						if (itms.offer) {
							var offer = itms.offer;
							if (offer.constructor === Array) {
								selectOffers = offer;
							}
							else {
								selectOffers.push(offer);
							}

							var rslt = that.format(selectOffers);
							if (rslt && rslt.length) {
								utl.log("[shopping.js][getOffers(1)] - return [" + rslt.length + "] results");
								that.mClbk(0, rslt);
								return;
							}
							else {
								that.mClbk(1, "[shopping.js][getOffers] - no results");
							}
						}
						else if (itms.product && itms.product.length > 0) {
							var id = itms.product[0].id;
							if (id) {
								url = that.getURL(id);
								baseApi.httpGet(url, function (error, response, body) {
									try {
										if (!error && body) {
											data = JSON.parse(body);
											var itms = data.GeneralSearchResponse.categories.category.items;
											selectOffers = itms.product.offers.offer || [];

											var rslt = that.format(selectOffers);
											if (rslt && rslt.length) {
												utl.log("[shopping.js][getOffers(2)] - return [" + rslt.length + "] results");
												that.mClbk(0, rslt);
												return;
											}
										}
									}
									catch (e) {
										error = e;
									}
									that.mClbk(1, "[shopping.js][getOffers::err(2)] -- getting feed [" + error + "]");
								});
							}
							else {
								utl.log("[shopping.js][getOffers] - return [0] results");
								that.mClbk(0, []);
							}
						}
						else {
							utl.log("[shopping.js][getOffers] - return [0] results");
							that.mClbk(0, []);
						}
					}
					else {
						utl.log("[shopping.js][getOffers] - return [0] results");
						that.mClbk(0, []);
					}
				}
				catch (e) {
					that.mClbk(1, "[shopping.js][getOffers::err] -- fatal error [" + e + "]");
				}
			});
		}
		catch (e) {
			utl.log("[shopping.js][getOffers::err] -- fatal error [" + e + "]");
			that.mClbk(1, e);
		}
	};

	this.format = function (rslt) {
		try{
			var rsltArr = [];
			for (var i = 0 ; i < rslt.length ; i++) {
				try{
					var obj = frmtr.getOfferObject();
					var offer = rslt[i];

					obj.typ = "any";
					obj.ofrtype = "feed";
					obj.uid = "ebay";
					obj.stndaln = offer.standalone;

					obj.desc.short = offer.name || "";
					////////////// obj.desc.long =  ""; ???

					obj.img.small = this.gtImg("small",offer) || "",
					obj.img.big = this.gtImg("big",offer) || "",

					obj.lnk = offer.offerURL || "";
					obj.prc = frmtr.getPrice(offer.originalPrice.$t, offer.originalPrice.currency);

					obj.store.name = offer.store.name || "";

					try {
						var logo = offer.store.logo;
						obj.store.logo = (logo ? logo.sourceURL : "");
					}
					catch (e) { }

					try {
						var rtng = offer.store.ratingInfo.ratingImage;
						obj.store.rtng = (rtng ? rtng.sourceURL : "");
					}
					catch (e) { }

					obj.meta.feed = "ebay";

					rsltArr.push(obj);
				}
				catch (e) {
					utl.log("[shopping.js][format::err] -- [" + e + "]");
				}
			}

			if (rsltArr.length > 0) {
				return rsltArr;
			}
		}
		catch (e) { }
		return null;
	};


	////////////////////////////////////////////////////////////////////////////////////////////////

	this.gtImg = function (sz, offer) {
		try {
			var imgs = offer.imageList.image;

			if (sz == "big") {
				for (var i = imgs.length - 1; i >= 0; i--) {
					if (imgs[i] && imgs[i].available == true) {
						return imgs[i].sourceURL;
					}
				}
			}
			else {
				for (var i = 0; i < imgs.length; i++) {
					if (imgs[i] && imgs[i].available == true) {
						return imgs[i].sourceURL;
					}
				}
			}
		}
		catch (e) { }
		return "";
	};

    this.geoMap = {
    	us: {
    		key: "30478f92-ebea-47aa-97cd-35c81ed2c6b3", // api key
    		trk: "8083573" // tracking id
    	},
    	de: {
    		key: "82054fb2-171a-461a-947c-d6f1d2bdda63", // api key
    		trk: "8084317" // tracking id
    	},
    	uk: {
    		key: "90747bd0-98fc-4114-b818-ae5db5354cda", // api key
    		trk: "8e69618b-1df4-4e56-addc-b05d14de466b" // tracking id
    	}
    };

    this.getURL = function (typ) {

    	var map = that.geoMap[that.mPrms.cntry] || that.geoMap["us"];
    	var url = "http://api.ebaycommercenetwork.com/publisher/3.0/rest/GeneralSearch" +
				"?apiKey=" + map.key +
				"&numItems=" + that.mPrms.n +
				"&trackingId=" + map.trk +
				"&subTrackingId=" + that.mPrms.prdct;

    	if(typ == "prdct"){
    		url += "&keyword=" + that.mPrms.st;
    	}
    	else{
    		url += "&productId=" + prdct;
    	}

    	return url;
    }
};


module.exports = shopping;



