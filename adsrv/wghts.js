// [[wghts]]

var baseApi = require('./baseapi'),
	utl = require("./utl"),
	path = require("path");

var wghts = {

	mWghtsMap : null,

	init: function (clbk) {
		wghts.loadWghts(clbk);
	},

	loadWghts : function (clbk){
		try {

			baseApi.readFile(path.join(path.dirname(__filename), "/data/wghts.js"), function (err, data) {
				if (!err) {
					wghts.mWghtsMap = JSON.parse(data);
				}
				else {
					utl.log("[lgcmngr.js][loadWghts::err] - error getting mWghtsMap [" + err + "]");
				}

				clbk(err || 1);
			});
		}
		catch (e) {
			utl.log("[lgcmngr.js][loadWghts::err] -- [" + e + "]");
			clbk(e);
		}
	},

	gtWght: function (cntry, ctgry) {  // ctgry ? 
		try {
			var ct = wghts.mWghtsMap[cntry];
			if (ct) {
				return ct;
			}
		}
		catch (e) { }
		return 10;
	}	
};


module.exports = wghts;

