
var utl = require("./utl");

var formatter = {

	cnfg : {

		maxShortDesc: 100,
		maxLongDesc: 500

	},

	getOfferObject  : function() {

		return {

			// link - independent link (<a href ..), iframe, image
			// img - image and link to navigate when the image clicked 
			// iframe - independent
			// html - independent html page
			// htmlpg
			// script
			// any - offer with lots of data 
			typ: null, 


			// feed
			// raw 
			// ddl
			// trnd
			ofrtype : null,

			desc: {
				short: null,
				long: null,
			},

			img: {
				small: null,
				big: null,
			},

			// private for Montiera
			meta: {
				feed: null,
				cntry: null,
				ctgry: null,
				prdct: null
			},

			sz: 0,   // 300, 728, 160, 0 - can be used for any size (like feed result)
			lnk: null,
			prc: null,

			stndaln : null, // standalone offer - just display it, don't handle the click

			store: {
				name: null,
				logo: null,
				rtng: null
			},

			uid: null
			
		}

    },

	normalize: function (requestParams, offrsArr) {

		var nOffrsArr = offrsArr;
		for (var typ in nOffrsArr) {
			for (var i = 0 ; i < nOffrsArr[typ].length ; i++) {
				try {
					var crnt = nOffrsArr[typ][i];

					if (!formatter.validTypes(crnt)) {
						nOffrsArr[typ].splice(i, 1);  // 2do - potential error
						continue;
					}

					crnt.desc.short = formatter.shortDesc(crnt.desc.short);
					crnt.desc.long = formatter.longDesc(crnt.desc.long);

					crnt.meta.feed = crnt.meta.feed || "na";
					crnt.meta.cntry = requestParams.cntry;
					crnt.meta.ctgry = requestParams.ctgry;
					crnt.meta.prdct = requestParams.prdct;
				}
				catch (e) {
					utl.log("[formatter.js][normalize::err] - [" + e + "]");
					nOffrsArr[typ].splice(i, 1);
				}
			}
		}
		return nOffrsArr;
	},

	frmtprc: function () { },

	shortDesc: function (txt) {
		if (!txt) {
			return "";
		}

		if (txt.length > formatter.cnfg.maxShortDesc) {
			return txt.substring(0, formatter.cnfg.maxShortDesc + "..");
		}

		return txt;
	},

	longDesc: function (txt) {
		if (!txt) {
			return "";
		}

		if (txt.length > formatter.cnfg.maxLongDesc) {
			return txt.substring(0, formatter.cnfg.maxLongDesc + "..");
		}

		return txt;
	},

	validTypes: function (offer) {
		switch (offer.typ) {
			case "script":
			case "flash":
			case "img":
			case "iframe":
			case "html":
			case "htmlpg":
			case "any":
				// ok
				break;

			default:
				utl.log("[formatter.js][normalize] error unknown type [" + offer.typ + "]");
				return false;
		}

		switch (offer.ofrtype) {
			case "feed":
			case "ddl":
			case "raw":
			case "trnd":
			case "serp":
				// ok
				break;

			default:
				utl.log("[formatter.js][normalize] error unknown ofrtype [" + offer.ofrtype + "]");
				return false;
		}

		return true;
	},

	getPrice: function (n, crncy) {
		try {
			if (!crncy) {
				return n;
			}

			switch (crncy.toLowerCase()) {
				case "usd":
				case "$":
					return "$" + n;
				case "gbp":
					return "&#163;" + n;
				case "eur":
					return n + "&#8364;";

				default:
					return n;
			}
		}
		catch (e) { }
		return "";
	}

}



module.exports = formatter;