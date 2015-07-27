
var utils = require('util'),
	baseApi = require("../baseapi"),
	utl = require("../utl")
	frmtr = require("../formatter");

var shopzilla = function () {
    
	this.mClbk = null;
	this.mPrms = null;

	var that = this;


	// var clientCallback,
	this.geosMap = {

		us: {
			url: "http://catalog.bizrate.com/services/catalog/v1/us/product",
			api: "4b89a12b2978e7897d589d8bf3d1a67f",
			pub: "605490"
		},

		br: {
			url: "http://catalog.shopzilla.com.br/services/catalog/v1/api/product/19",
			api: "11f39476f605228b0f18f496b889162f",
			pub: "606533"
		},

		de: {
			url: "http://catalog.shopzilla.de/services/catalog/v1/api/product/5",
			api: "9d99d03f538e1a44b208e8bef9397d9b",
			pub: "606534"
		},

		fr: {
			url: "http://catalog.shopzilla.fr/services/catalog/v1/api/product/4",
			api: "f6373502234ced378a17e698bd01a4a7",
			pub: "606535"
		},

		uk: {
			url: "http://catalog.bizrate.co.uk/services/catalog/v1/api/product/3",
			api: "b26cb363bbac236af9d172298a5f5049",
			pub: "606536"
		}
	};

	this.getOffers = function (prms, clbk) {
		utl.log("[shopzilla.js][getOffers]");

		this.mPrms = prms;
		this.mClbk = clbk;
		try {

			var url = this.getURL();

			if (!url) {
				return that.mClbk(1, "[shopzilla.js][getOffers::err] -- country is not supported [" + this.mPrms.cntry + "]");
			}

			var n = prms.n || 10;
			baseApi.httpGetTimeout(url, function (error, response, body) {
				try {
					var data, selectOffers = [];
					if (!error && body) {
						data = JSON.parse(body);
						if (data.offers.offer.length) {
							selectOffers = data.offers.offer;
						}

						var rslt = that.format(selectOffers);
						if (rslt && rslt.length) {
							utl.log("[shopzilla.js][getOffers] - return [" + rslt.length + "] results");
							that.mClbk(0, rslt);
							return;
						}
						else{

							utl.log("[shopzilla.js][getOffers] - return 0 results");
							that.mClbk(0, []);
						}
					}
				}
				catch (e) { 
					error = e;
				}
				that.mClbk(1, "[shopzilla.js][getOffers::err] - error getting feed [" + error + "]");
			});
		}
		catch (e) {
			that.mClbk(1, "[shopzilla.js][getOffers::err] -- fatal error [" + e + "]");
		}
	};

	/*
	this.getBestOffer = function(offers){
		try{
			var bestOffer = _.max(offers,function(offer){
				return offer.estimatedCPC.integral;
			});
		}
		catch(e){
			bestOffer =  _.sample(offers);
		}

		return this.getModel(bestOffer);
	};
	*/

	this.getURL = function (geoObject, n) {
		try {

			var geoMap = that.geosMap[that.mPrms.cntry];

			var query = {

				"apiKey": geoMap.api,
				"publisherId": geoMap.pub,
				"keyword": that.mPrms.st,
				"offersOnly": true,
				"start": 0,
				"results": that.mPrms.n,
				"backfillResults": 0,
				"startOffers": 0,
				"resultsOffers": 0,
				"sort": "relevancy_desc",
				"resultsAttribute": 10,
				"resultsAttributeValues": 10,
				"minRelevancyScore": 100,
				"imageOnly": true,
				"reviews": "none",
				"retailOnly": "",
				"showEcpc": true,
				"placementId": that.gtPlcmntId(),
				"format": "json"
			};

			return utils.format("%s?%s", geoMap.url, baseApi.param(query));
		}
		catch (e) { }
	};

	this.gtImg = function (imgs) {
		try{
			if (imgs.image && imgs.image[0] && imgs.image[0].value) {
				return imgs.image[0].value;
			}
			else if(imgs.image) {
				for (var i = imgs.image.length - 1 ; i >= 0 ; i--) {
					if (imgs.image[i] && imgs.image[i].value) {
						if (imgs.image[i].xsize > 0 && imgs.image[i].ysize > 0) {
							return imgs.image[i].value;
						}
					}
				}

			}
		}
		catch (e) { }
		return "";
	};

	this.format = function(rslt){

		try{
			var rsltArr = [];
			for (var i = 0 ; i < rslt.length ; i++) {
				try{
					var obj = frmtr.getOfferObject();
					var offer = rslt[i];

					obj.typ = "any";
					obj.ofrtype = "feed";
					obj.uid = "";
					obj.stndaln = offer.standalone;

					obj.desc.short = offer.title || "";
				    obj.desc.long = offer.description;

					obj.img.small =  this.httpsPrefixCheck(frmtr.urlDecode(that.gtImg(offer.images)));
					try{
						obj.img.big =  this.httpsPrefixCheck(frmtr.urlDecode(offer.images.image[2].value));
					}
					catch(e){
						obj.img.big = "";
					}

					obj.lnk = frmtr.urlDecode(offer.url.value);
					obj.prc = offer.price.value.replace(/\s+/g,"");

					obj.store.name = offer.merchantName || "";
					obj.store.logo = offer.merchantLogoUrl || "";

					if(typeof offer.merchantRating !== 'undefined'){
						if(typeof offer.merchantRating.value !== 'undefined'){
							obj.store.rtng = offer.merchantRating.value;
						}
					}
					obj.meta.feed = "shpzl";
					rsltArr.push(obj);
				}
				catch (e) {
					utl.log("[shopzilla.js][format::err] -- [" + e + "]");
				}
			}

			if (rsltArr.length > 0) {
				return rsltArr;
			}
		}
		catch (e) { }
		return null;

    };

    this.httpsPrefixCheck = function(url){
		if(typeof that.mPrms.type !== 'undefined' && that.mPrms.type == 'https'){
			var newUrl = url.substring(url.indexOf("?sq"));
			var httpsPrefix = "https://d.bizrate.com/resize";
			return httpsPrefix + newUrl;
		}
		else{
			return url;
		}
	};

	this.gtPlcmntId = function () {
		try{
			if (that.mPrms.prdct == "mntr") {
				return 50;
			}

			var prdct = that.mPrms.prdct.replace("coms", "");
			prdct = Number(prdct);
			prdct += 10;

			return prdct;
		}
		catch (e) { }
		return 50; // mntr default
	};

};

module.exports = shopzilla;
