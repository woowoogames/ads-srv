
/*

// trend format

"t203": {  // [[all countries]] 

	id: 203,

	ctgrs: [],
	cntrs:[],

	desc: "diet",
	longdesc: "",

	typ: "img", // (link, img, ifr, htm, flsh) 
	sz : "300",   // 300, 728, 160 or 0 for all

	kwrds: ["",""], 

	subidname : "", // if needed, the subid will be concatenated to the link url

	lnk: "", // contains the link to navigate to ..
	img: "https://montiera.hs.llnwd.net/e2/coms/bnr/trnd/t305.jpg" // contains the item to display (image, iframe, html..)
},
*/


// the ad server will not "look for trends" according to predefined keywords.
// if the client needs trends, it will need to send the desired search term and category.  ????

var baseApi = require("../baseapi"),
	path = require("path"),
	frmtr = require("../formatter");


var trndsMngr = {

	////////////////////////////////////////////////////////////////////////////////////////////////

	mTrndsMap: null,
	mTrndsMapIdx: null,

	// public 
	init : function (clbk){
		trndsMngr.loadTrnds(clbk);
	},

	loadTrnds : function (clbk){
		try {
			// load the trends map into memory
			baseApi.readFile(path.join(path.dirname(__filename), "/data.js"), function (err, data) {
				if (!err) {
					trndsMngr.mTrndsMap = JSON.parse(data);
					trndsMngr.mTrndsMapIdx = trndsMngr.createIdxMap();
				}
				else {
					console.log("trndsMngr::loadTrnds:: error getting trnds");
				}

				clbk(err || 1);
			});
		}
		catch (e) {
			clbk(e);
		}
	},

	getOffers : function (prms) {

		try {

			if (!trndsMngr.mTrndsMapIdx || trndsMngr.mTrndsMap.length == 0) {
				console.log("trndsMngr::getOffers error - no map");
				return [];
			}

			var cntry = trndsMngr.mTrndsMapIdx[prms.cntry];
			if(!cntry){
				cntry = trndsMngr.mTrndsMapIdx["int"];
			}

			var ctgry = cntry[prms.ctgry];
			if (!ctgry) {
				console.log("trndsMngr::getOffers - no deals");
				return [];
			}

			var offers = [];
			var n = ctgry.length;

			if (n <= prms.n) {
				for (var i = 0 ; i < n ; i++) {
					offers.push(trndsMngr.mTrndsMap[ctgry[i]]);
				}
			}
			else{
				var count = 0, idxs = ",";
				while(offers.length < 10 && (count++) < 100){
					var k = Math.floor(Math.random() * (ctgry.length));
					if(idxs.indexOf("," + k + ",") < 0){
						offers.push(trndsMngr.mTrndsMap[ctgry[k]]);
					}
				}
			}

			var rslt = trndsMngr.format(offers);
			if (rslt && rslt.length) {
				return rslt;
			}
			else{
				console.log("trndsMngr::getOffers - unknown error");
				return [];
			}
		}
		catch (e) {
			console.log("trndsMngr::getOffers - error [" + e + "]");
			return [];
		}
	},

	format : function (rslt) {
		try {
			var rsltArr = [];
			for (var i = 0 ; i < rslt.length ; i++) {
				try {
					var obj = frmtr.getOfferObject();
					var offer = rslt[i];

					obj.typ = offer.typ;
					obj.ofrtype = "trnd";
					obj.uid = offer.id;
					obj.stndaln = offer.standalone;

					obj.desc.short = offer.desc || "";
					obj.desc.long = offer.longdesc || "";

					obj.img.big = offer.img;

					obj.lnk = offer.lnk;
					obj.sz = offer.sz;

					////////////////////////////////////////// place for subid

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

	createIdxMap: function () {
		var idxMap = {};
		try{
			for (var trnd in trndsMngr.mTrndsMap) {
			
				var cntrs = trndsMngr.mTrndsMap[trnd].cntrs;
				var ctgrs = trndsMngr.mTrndsMap[trnd].ctgrs;

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

						idxMap[crntCntry][crntCtgry].push(trnd); // push only the trend id
					}
				}
			}
		}
		catch (e) {
			console.log("trndsMngr::createIdxMap error " + e);
		}
		return idxMap;
	}
};


module.exports = trndsMngr;



