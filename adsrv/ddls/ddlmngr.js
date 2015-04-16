
var baseApi = require("../baseapi"),
	path = require("path"),
	utl = require("../utl"),
	fs = require("fs"),
	frmtr = require("../formatter");



var fsWatchHandl = 0;
var dataFilePath = path.join(path.dirname(__filename), "/data.js");

var ddlsMngr = {
	prms :"",
	////////////////////////////////////////////////////////////////////////////////////////////////

	mDdlsMap: null,
	mDdlsMapIdx: null,

	// public 
	init : function (clbk){
		ddlsMngr.loadDdls(clbk);


		fs.watch(dataFilePath, function(e) {

			clearTimeout(fsWatchHandl);
			fsWatchHandl = setTimeout(function() {
				console.log(dataFilePath + " changed");
				ddlsMngr.loadDdls(function() {});	
			}, 5000);
		});
	},


	loadDdls : function (clbk){
		try {
			// load the feedsmap into memory
			baseApi.readFile(path.join(path.dirname(__filename), "/data.js"), function (err, data) {
				if (!err) {
					ddlsMngr.mDdlsMap = JSON.parse(data);
					ddlsMngr.mDdlsMapIdx = ddlsMngr.createIdxMap();
					ddlsMngr.ddlsMapToLower(ddlsMngr.mDdlsMapIdx);
				}
				else {
					utl.log("[ddlmngr.js][loadDdls] - error getting ddls");
				}

				clbk(err || 1);
			});
		}
		catch (e) {
			clbk(e);
		}
	},

	getOffers : function (prms) {
		ddlsMngr.prms = prms;
		try {
			if (!ddlsMngr.mDdlsMapIdx || Object.keys(ddlsMngr.mDdlsMap).length == 0) {
				utl.log("[ddlmngr.js][getOffers] - error - no map");
				return [];
			}

			var cntry = ddlsMngr.mDdlsMapIdx[prms.cntry];
			if(!cntry){
				cntry = ddlsMngr.mDdlsMapIdx["int"];
			}

			if(!cntry){
				utl.log("[ddlmngr.js][getOffers] - no deals for int");
				return [];
			}

			var ctgry = cntry[prms.ctgry];
			if (!ctgry) {
				utl.log("[ddlmngr.js][getOffers] - no deals");
				return [];
			}

			var offers = [];
			var n = ctgry.length;

			if (n <= prms.n) {
				for (var i = 0 ; i < n ; i++) {
					offers.push(ddlsMngr.mDdlsMap[ctgry[i]]);
				}
			}
			else{
				var count = 0, idxs = ",";
				while(offers.length < 10 && (count++) < 100){
					var k = Math.floor(Math.random() * (ctgry.length));
					if(idxs.indexOf("," + k + ",") < 0){
						offers.push(ddlsMngr.mDdlsMap[ctgry[k]]);
					}
				}
			}

			offers = ddlsMngr.filterByProduct(offers,prms);

			var rslt = ddlsMngr.format(offers);
			if (rslt && rslt.length) {
				utl.log("[ddlmngr.js][getOffers] - returned [" + rslt.length + "] offers");
				return rslt;
			}
			else{
				utl.log("[ddlmngr.js][getOffers] - unknown error");
				return [];
			}
		}
		catch (e) {
			utl.log("[ddlmngr.js][getOffers] - error [" + e + "]");
			return [];
		}
	},

	filterByProduct : function(offers,prms){
		var filtered = offers.filter(function(obj) {
			return obj.prdct.indexOf(ddlsMngr.prms.prdct)!=-1;
		});
		return filtered;
	},

	ddlsMapToLower : function(){
		for(var key in ddlsMngr.mDdlsMapIdx){
			ddlsMngr.mDdlsMapIdx[key] = ddlsMngr.objToLower(ddlsMngr.mDdlsMapIdx[key]);
		}
	},

	objToLower : function(obj){
		var key, keys = Object.keys(obj);
		var n = keys.length;
		var newobj={}
		while (n--) {
		  key = keys[n];
		  newobj[key.toLowerCase()] = obj[key];
		}
		return newobj;
	},

	format : function (rslt) {
		try {
			var rsltArr = [];
			for (var i = 0 ; i < rslt.length ; i++) {
				try {
					var obj = frmtr.getOfferObject();
					var offer = rslt[i];

					obj.typ = offer.rndrTyp;
					obj.ofrtype = "ddl";
					obj.uid = offer.id;
					obj.stndaln = offer.standalone;

					obj.desc.long = obj.desc.short = offer.desc || "";

					var k = Math.floor(Math.random() * (offer.source.length));
					obj.img.big = obj.img.small = offer.source[k] || "",
					obj.lnk = offer.lnk[k] || "",

				    obj.sz = ddlsMngr.getSize(rslt[i].size);
					// place for subid

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
	},

	getSize :function(size){
		if(typeof size !== 'undefined'){
			var sizeCase = size.split("x");
			return sizeCase[0];
		}
		else
			return 0;
	},

	createIdxMap: function () {
		var idxMap = {};
		try{
			for (var ofr in ddlsMngr.mDdlsMap) {
			
				var cntrs = ddlsMngr.mDdlsMap[ofr].cntry;
				var ctgrs = ddlsMngr.mDdlsMap[ofr].ctgry;

				if (cntrs.length == 0) {
					cntrs = ["int"];
				}

				for (var i = 0 ; i < cntrs.length ; i++) {
					var crntCntry = cntrs[i];
					if (!idxMap[crntCntry]) {
						idxMap[crntCntry] = {};
					}

					for (var j = 0 ; j < ctgrs.length ; j++) {
						var crntCtgry = ctgrs[j];
						if (!idxMap[crntCntry][crntCtgry]) {
							idxMap[crntCntry][crntCtgry] = [];
						}

						idxMap[crntCntry][crntCtgry].push(ofr); // push only the offer id
					}
				}
			}
		}
		catch (e) {
			utl.log("[ddlsMngr.js][createIdxMap] - error - " + e);
		}
		return idxMap;
	}
};


module.exports = ddlsMngr;



