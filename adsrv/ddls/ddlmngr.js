
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

			var offers = [];

			var ctgry = cntry[prms.ctgry];
			var nonCategories = ddlsMngr.getRandomNonCtrgy(prms);
			if (!ctgry && nonCategories.length==0) {
				utl.log("[ddlmngr.js][getOffers] - no deals");
				return [];
			}
			if(ctgry){
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
			}
			else{
				offers = ddlsMngr.smartConcat(offers,nonCategories);
			}

			offers = ddlsMngr.filterByProduct(offers,prms);

			var rslt = ddlsMngr.format(offers,prms);
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

	getRandomNonCtrgy : function(prms){
		var DefaultDdls = [];
		for(var ddl in ddlsMngr.mDdlsMap){
			if(ddlsMngr.mDdlsMap[ddl].cntry.length == 0){
				if(ddlsMngr.mDdlsMap[ddl].ctgry.length==0){
					DefaultDdls.push(ddlsMngr.mDdlsMap[ddl]);
				}				
			}
			if(ddlsMngr.mDdlsMap[ddl].cntry.indexOf(prms.cntry)!=-1){
				if(ddlsMngr.mDdlsMap[ddl].ctgry.length == 0){//non category ddls
					DefaultDdls.push(ddlsMngr.mDdlsMap[ddl]);
				}
			}
		}
		return DefaultDdls;
	},			

	smartConcat : function(offers,RandomDddls){
		if(offers.length>2)
			return offers;
		else{
			var randOffers = [];
			var size = 3-offers.length;
			size = Math.min(size,RandomDddls.length);
			for(var i=0;i<size ;i++){
				var randInd = Math.floor(Math.random()*(RandomDddls.length-i));
				randOffers.push(RandomDddls[randInd]);
				RandomDddls[randInd] = RandomDddls[RandomDddls.length-1-i];
			}
			return offers.concat(randOffers);
		}
	},

	filterByProduct : function(offers,prms){
		var filtered = offers.filter(function(obj) {
			if(obj.prdct.length==0)
				return true;
			else
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

	format : function (rslt,prms) {
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
					if(typeof offer.source[k] !== 'undefined')
						obj.img.big = obj.img.small = frmtr.ddlsFormat(offer.source[k],prms) || "";
					if(typeof offer.lnk[k] !== 'undefined')
						obj.lnk = frmtr.ddlsFormat(offer.lnk[k],prms) || "";
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



