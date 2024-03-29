﻿
var utl = require("./utl"),
	path = require("path"),
	baseApi = require("./baseapi"),
	Entities = require('html-entities').XmlEntities;

entities = new Entities();

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

    urlDecode : function(url){
    	return entities.decode(url);
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
			case "ntb":
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

	validProduct : function(prdct){
		var validProduct = prdct.match(/coms0.[0-9][0-9]{0,7}/g);
		if(validProduct)
			return validProduct.length == 1 && prdct.length == 7; 
		else
			return false;
	},

	validIp : function(ip){
		if(ip=="")
			return true;
		var ipPattern = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]).){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/g;
		return ipPattern.test(ip);
	},


	isValidRequest : function(requestObject){
		if(!formatter.isValidPath(requestObject))
			return false;
		if(formatter.isValidQueryParams(requestObject)){
			for(var key in requestObject){
				if(key == "prdct"){
					if(!formatter.validProduct(requestObject[key]))
						return false;
				}
				if(key == "ip"){
					if(!formatter.validIp(requestObject[key]))
						return false;
				}
			}
			return true;
		}
		else
			return false;			
	},

	isValidQueryParams : function(requestObject){
		var validQuery = requestObject.hasOwnProperty('prdct') && requestObject.hasOwnProperty('ctgry');
		return validQuery;
	},

	isValidPath : function(requestObject){
		if(typeof requestObject.type === 'undefined')
			return true;
		else{
			if(requestObject.type == "serp" || requestObject.type == "ddls" || requestObject.type == "trnds" || requestObject.type == "https")
				return true;
			else
				return false;
		}
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
	},

	ddlsFormat :function(url,prms){
		url = url.replace("#prdct#",prms.prdct);
		url = url.replace("#cntry#",prms.cntry);
		return url;
	},

	ctrgyNameFormat : function(ctgryName){
		return ctgryName.toLowerCase().replace(/#| |,|&/g, '');
	}

}

module.exports = formatter;