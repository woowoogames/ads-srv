
var utils = require('util'),
	baseApi = require("../baseapi"),
	utl = require("../utl")
	frmtr = require("../formatter");


var priceGong = function () {

	////////////////////////////////////////////////////////////////////////////////////////////////

	this.mClbk = null;
	this.mPrms = null;

	this.getOffers = function (prms, clbk) {

		utl.log("[pricegong.js][getOffers]");

		this.mPrms = prms;
		this.mClbk = clbk;
		try {
			var url = this.getURL(), that = this;
			var n = prms.n || 10;
			baseApi.httpGetTimeout(url, function (error, response, body) {
				try {
					var data, selectOffers = [];
					if (!error && body) {
						var cBody = that.clean(body);
						data = JSON.parse(cBody);

						var offers = data.offers.offer;
						if (offers) {
							if (offers.constructor === Array) {
								selectOffers = offers.slice(0, n);
							}
							else {
								selectOffers.push(offers);
							}
						}

						var rslt = that.format(selectOffers);
						if (rslt && rslt.length) {
							utl.log("[pricegong.js][getOffers] - return [" + rslt.length + "] results");
							that.mClbk(0, rslt);
							return;
						}
					}
				}
				catch (e) {
					error = e;
				}
				that.mClbk(1, "[pricegong.js][getOffers::err] - error getting feed [" + error + "]");
			});
		}
		catch (e) {
			that.mClbk(1, "[pricegong.js][getOffers::err] -- fatal error [" + e + "]");
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
					obj.uid = "prcgng";
					obj.stndaln = offer.standalone;

					obj.desc.short = offer.offer_name.val || offer.product_name.val || "";
					obj.desc.long = offer.description.val || "";

					obj.img.small = offer.offer_image.val || "",
					obj.lnk = offer.offer_url || "";
					obj.prc = offer.base_price.priceLong || "";

					obj.store.name = offer.store_name.val || "";
					obj.store.logo = offer.store_logo.val || "";

					obj.meta.feed = "prcgng";

					rsltArr.push(obj);
				}
				catch (e) {
					utl.log("[pricegong.js][format::err] -- [" + e + "]");
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


    this.clean = function (str){
    	var str_ = str;
    	try{
    		str_ = str_.replace(/\"@/g, "\"");
    		str_ = str_.replace(/\"#/g, "\"");
    		str_ = str_.replace(/cdata-section/g, "val");
    	}
    	catch(e){}
    	return str_;
    };


    this.getURL = function () {
    	return "http://service.pricegong.com/offers.ashx?" + 
				"app=API" + 
				"&disid=mntr2" + 
				"&q=" + this.mPrms.st +
				"&ct=" + this.mPrms.cntry +
				"&subdisid=" + this.mPrms.prdct;
    }
};


module.exports = priceGong;



