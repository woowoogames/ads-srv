var utils = require('util'),
baseApi = require("../baseapi"),
utl = require("../utl"),
frmtr = require("../formatter");


var becomeurope = function () {
	var geoUrls = {
		us: "us.channel.become.com/livexml/3.1/montiera-us.portal/",
		uk: "uk.channel.become.com/livexml/3.1/montiera-uk.portal/",
		de: "de.channel.become.com/livexml/3.1/montiera-de.portal/",
		fr: "fr.channel.become.com/livexml/3.1/montiera-fr.portal/",
		it: "it.channel.become.com/livexml/3.1/montiera-it.portal/"
	};

	var that = this;

	this.getOffers = function (prms, clbk) {

		this.mPrms = prms;
		var url = 'http://montiera:rze64jtkf@' + this.getUrl();
		console.log(url);
		baseApi.httpGet({ url: url }, function (error, response, body) {
			try {
				var data = JSON.parse(body);
				if (that.saftyCheck(data)) {
					if (data.productResultsModule.productResults.product.length > 0) {
						var results = that.format(data.productResultsModule.productResults.product);
						clbk(0, results);
					}
					else {
						utl.log("[becomeurope.js][getOffers] - return 0 results");
						that.mClbk(1, []);
					}
				}
				else {
					clbk(1, []);
				}
			}
			catch (err) {
				utl.log("[becomeurope.js][getOffers::err] -- fatal error [" + err + "]");
				clbk(1, []);
			}
		});
	};

	this.saftyCheck = function (data) {
		try{
			return (typeof data.productResultsModule.productResults.product !== 'undefined');
		}
		catch (e) { }
		return false;
	};

	this.format = function (offers) {
		try {
			var rsltArr = [];
			for (var i = 0 ; i < offers.length; i++) {
				var obj = frmtr.getOfferObject();
				try {
					obj.typ = "img";
					obj.ofrtype = "feed";
					obj.desc.short = offers[i].offer.label;
					obj.desc.long = offers[i].description;
					obj.img.small = offers[i].image[0].source;
					obj.img.big = offers[i].image[1].source;
					obj.meta.feed = "becm";
					obj.meta.cntry = that.mPrms.cntry;
					obj.meta.ctgry = that.mPrms.ctgry;
					obj.meta.prdct = that.mPrms.prdct;
					obj.meta.sz = offers[i].image[1].width;
					obj.lnk = offers[i].offer.url;
					obj.prc = offers[i].offer.price.value
					obj.store.name = offers[i].offer.merchant.label;
					obj.store.logo = offers[i].offer.merchant.image.source;
					obj.store.rtng = "";
					obj.uid = "";
					rsltArr.push(obj);
				}
				catch (e) {
					utl.log("[buscape.js][format::err] -- [" + e + "]");
				}
			}
			return rsltArr;
		}
		catch (err) {
			utl.log("[buscape.js][format::err] -- [" + err + "]");
		}
	}

	this.getUrl = function () {
		var url = geoUrls[that.mPrms.cntry];
		url += "query?qry=" + that.mPrms.st + "&img=I&cf=oi&pge=5&campID=" + that.mPrms.prdct + "&rtype=JSON";
		return url;
	};

};

module.exports = becomeurope;