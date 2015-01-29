
var utils = require('util'),
	baseApi = require("../baseapi"),
	frmtr = require("../formatter");


var firstOffer = function () {

	////////////////////////////////////////////////////////////////////////////////////////////////

	this.mClbk = null;
	this.mPrms = null;

	this.getOffers = function (prms, clbk) {

		console.log("firstOffer::getOffers");

		this.mPrms = prms;
		this.mClbk = clbk;

		try {
			var url = this.getURL(), that = this;
			var n = prms.n || 10;
			baseApi.httpGetTimeout(url, function (error, response, body) {
				try {
					var data, selectOffers = [];
					if (!error && body) {

						data = JSON.parse(body);
						var rslt = that.format(data);
						if (rslt && rslt.length) {
							that.mClbk(0, rslt);
							return;
						}
					}
				}
				catch (e) { error = e; }
				that.mClbk(1, error);
			});
		}
		catch (e) {
			that.mClbk(1, e);
		}
	};

	this.format = function (rslt) {
		try {
			var rsltArr = [];
			for (var i = 0 ; i < rslt.length ; i++) {
				try {
					var obj = frmtr.getOfferObject();
					var offer = rslt[i];

					obj.typ = "any";
					obj.ofrtype = "feed";
					obj.uid = "fofr";
					obj.stndaln = offer.standalone;

					obj.desc.short = obj.desc.long = offer.desc;

					obj.img.small = "",
					obj.img.big = offer.largeImage || offer.images;

					obj.lnk = offer.url;
					obj.prc = offer.price || "";

					obj.store.name = offer.merchant || "";
					obj.store.logo = offer.merchantImage || "";

					obj.meta.feed = "fofr";

					rsltArr.push(obj);
				}
				catch (e) { }
			}

			if (rsltArr.length > 0) {
				return rsltArr;
			}
		}
		catch (e) { }
		return null;
	};


	////////////////////////////////////////////////////////////////////////////////////////////////


	this.getURL = function () {

		return "http://api.firstofferz.com/v1/catalog/search/mont?" +
				"q=" + this.mPrms.st +
				"&subid=" + this.mPrms.prdct +
				"&c=" + this.mPrms.cntry +
				"&offers=" + this.mPrms.n;
	}
};


module.exports = firstOffer;



