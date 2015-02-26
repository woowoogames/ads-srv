var utils = require('util'),
baseApi = require("../baseapi"),
utl = require("../utl")
frmtr = require("../formatter");

var buzzcity = function () {
	this.mClbk = null;
	this.mPrms = null;
	var that = this;

	var ctgry ={ "dating":"126792",
				 "spiritual":"126790",
				 "gambling":"126791",
				 "Brand":"126788",
				 "GeneralContent":"126789"
			   };

	this.getOffers = function (prms, clbk) {
		utl.log("[buzzcity.js][getOffers]");
		this.mPrms = prms;
		this.mClbk = clbk;
		try{
			var url = this.getURL("prdct");
			if(!url)
				that.mClbk(1, "[buzzcity.js][getOffers] - no results");
			else{
				baseApi.httpGetTimeout(url, function (error, response, body) {
					var data;
					if (!error && body) {
						data = JSON.parse(body);
					}
					if(data.error == null){
						var offers = data.data[0].campaign;
						var results = that.format(offers);
						that.mClbk(0, results);
					}
					else{
						that.mClbk(1, "[buzzcity.js][getOffers] - no results");
					}
				});
			}
		}
		catch(err){
			that.mClbk(1, "[buscape.js][getOffers] - fatal error - status - " + err);
		}
	}

	this.format = function (offers) {
		try{
			var rsltArr = [];
			for(var i=0 ; i<offers.length; i++){
				var obj = frmtr.getOfferObject();
				try{
					obj.typ = "img";
					obj.ofrtype = "raw";
					obj.desc.short = "";
					obj.desc.long = "";
					obj.img.small = "";
					obj.img.big = offers[i].url_img;
					obj.meta.feed = "buzcty";
					obj.meta.cntry = that.mPrms.cntry;
					obj.meta.ctgry = that.mPrms.ctgry;
					obj.meta.prdct = that.mPrms.prdct;
					obj.meta.sz = null;
					obj.lnk = offers[i].url_click;
					obj.prc = "";
					obj.store.name = "";
					obj.store.logo = "";
					obj.store.rtng = "";
					obj.uid = "buzcty";
					rsltArr.push(obj);
				}
				catch(e){}
			}
			return rsltArr;			
		}
		catch(err){}
	}

	this.getURL = function (typ) {
		var map = that.mPrms.cntry || that.geoMap["in"];
		var ip = that.mPrms.ip;
		var ua = "SAMSUNG-GT-S5620/1.0";
		var partner_id;
		if(ctgry.hasOwnProperty(that.mPrms.ctgry))
			partner_id = ctgry[that.mPrms.ctgry];
		else{
			var rand = Math.random();
			if(rand<0.5)
				partner_id = ctgry["Brand"];
			else
				partner_id = ctgry["GeneralContent"];
		}
		console.log(partner_id);
		if(typeof partner_id === "undefined")
			return null;
		var url = "http://show.buzzcity.net/showads.php?get=rich&partnerid=" + partner_id + "&ip=" + ip + "&ua=" + ua + "&imgsize=300x250&fmt=json&limit=100&v=3";
		return url;
	}
};

module.exports = buzzcity;