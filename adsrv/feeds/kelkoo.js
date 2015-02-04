var utils = require('util'),
	_ = require('underscore'),
	queystring = require('querystring'),
	crypto = require('crypto'),
	baseApi = require("../baseapi"),
	utl = require("../utl"),
	frmtr = require("../formatter");


var kelkoo = function () {
    

	this.mClbk = null;
	this.mPrms = null;

	var that = this;

	this.config = {
        
		"host" : "http://%s.shoppingapis.kelkoo.com",
		"path" : "/V3/productSearch?query=%s&sort=default_ranking&start=1&results=%s&show_products=1&show_subcategories=1&show_refinements=1&custom1=%s",
		"geosMap" : {
            
			"it" : {
				prtnrId : "96945263",
				affltKey : "eZR0HgUn"
			},
            
			"es" : {
				prtnrId : "96945264",
				affltKey : "PxX1Vts9"
			},
            
			"fr" : {
				prtnrId : "96945143",
				affltKey : "PavJ91E8"
			},

			"de" : {
				prtnrId : "96945270",
				affltKey : "5QY8r79I"
			},
            
			"nl" : {
				prtnrId : "96946073",
				affltKey : "05jsZhxT"
			},
            
			"be" : {
				prtnrId : "96946074",
				affltKey : "YN43XIa2"
			},
            
			"ru" : {
				prtnrId : "96945956",
				affltKey : "d5iucH3A"
			},
            
			"br" : {
				prtnrId : "96945930",
				affltKey : "w2czrBM1"
			},
            
			"dk" : {
				prtnrId : "96945972",
				affltKey : "4cVd62uD"
			},
            
			"no" : {
				prtnrId : "96945973",
				affltKey : "1IbJZ5m3"
			},
            
			"se" : {
				prtnrId : "96945974",
				affltKey : "zjuy0heG"
			},
            
			"uk": {
				prtnrId : "96945276",
				affltKey : "BSrvN93r"
			}
		}
	};
    
	this.getOffers = function (prms, clbk) {
		utl.log("[kelkoo.js][getOffers]");

		this.mPrms = prms;
		this.mClbk = clbk;
		this.mPrms.st = this.mPrms.st.replace(/ /g, "-");

		this.config.host = utils.format(this.config.host, this.mPrms.cntry);
		this.config.path = utils.format(this.config.path, this.mPrms.st, this.mPrms.n, this.mPrms.prdct);

		try {
			var geoObject = this.config.geosMap[this.mPrms.cntry];
			var signedURL = this.signURL(geoObject);

			baseApi.httpGetTimeout(signedURL, function (error, response, body) {
				try {
					var data, selectProducts, selectedOffers;
					if (!error && body) {
						data = baseApi.xmlToJSON(body);
						if (data.ProductSearch.Products.Product.length) {

							selectProducts = data.ProductSearch.Products.Product.slice(0, that.mPrms.n);
							selectedOffers = _.map(selectProducts, function (product) {
								return product.Offer;
							});

							var rslt = that.format(selectedOffers);
							if (rslt && rslt.length) {
								utl.log("[kelkoo.js][getOffers] - return [" + rslt.length + "] results");
								that.mClbk(0, rslt);
								return;
							}
						}
					}
				}
				catch (e) {
					error = e;
				}
				that.mClbk(1, "[kelkoo.js][getOffers::err] - error getting feed [" + error + "]");
			});
		}
		catch (e) {
			that.mClbk(1, "[kelkoo.js][getOffers::err] -- fatal error [" + e + "]");
		}
	};

	this.signURL = function (geoObject) {
		try {
			var URL_sig = "hash",
				URL_ts = "timestamp",
				URL_partner = "aid";
                
                
			var time = Math.floor(Date.now() / 1000);
                
			// format URL
			var URLtmp = this.config.path + "&" + URL_partner + "=" + geoObject.prtnrId + "&" + URL_ts + "=" + time;
                
			// to md5
			var token = crypto.createHash('md5').update(URLtmp + geoObject.affltKey).digest("base64").replace(/\+/g, '.').replace(/\//g, '_').replace(/=/g, '-');
                
			// format the concatained final URL
			return this.config.host + URLtmp + "&" + URL_sig + "=" + token;
		}
		catch (e) { }
	};

	this.gtImg = function (offer) {
		var img = "";
		try {
			if (offer.Images && offer.Images.Image && offer.Images.Image.Url) {
				if (offer.Images.ZoomImage && offer.Images.ZoomImage.Url) {
					img = offer.Images.ZoomImage.Url;
				}
				else {
					img = offer.Images.Image.Url;
				}
			}
			else {
				img = offer.OtherImages[0].Image.Url;
			}
		}
		catch (e) { }

		return img;
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
					obj.uid = "klko";
					obj.stndaln = offer.standalone;

					obj.desc.short = offer.Title || "";
					obj.desc.long = offer.Description || "";

					obj.img.small = that.gtImg(offer);
					////////////////////////////////////obj.img.big = ?? 

					obj.lnk = offer.Url;
					obj.prc = frmtr.getPrice(offer.Price.Price, offer.Price.currency);

					obj.store.name = offer.Merchant.Name || "";
					obj.store.logo = offer.Merchant.Logo.Url || "";

					obj.meta.feed = "klko";

					rsltArr.push(obj);
				}
				catch (e) {
					utl.log("[kelkoo.js][format::err] -- [" + e + "]");
				}
			}

			if (rsltArr.length > 0) {
				return rsltArr;
			}
		}
		catch (e) { }
		return null;

	};
	
};



module.exports = kelkoo;
