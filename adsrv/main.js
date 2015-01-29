
var feedsMngr = require('./feedsmngr'),
	offersMngr = require('./offersmngr'),
	ddlsMngr = require('./ddls/ddlmngr'),
	trndsMngr = require('./trnds/trndmngr'),
	rsrcMngr = require('./rsrcmngr'),
	lgcMngr = require('./lgcmngr'),
	baseApi = require("./baseapi"),
	// path = require("path"),
	frmtr = require("./formatter"),
	_ = require("underscore");


	var adSrv = {
		modules:{},
	/******************************************************************************************************
	*
	* @cntry - the client country
	* @prdct - product name
	* @subid - [optional] subid inside the product 
	* @ctgry - the page context 
	* @st - [optional] search term 
	* @n - [optional] the number of result offers (default is 10) 
	*
	*******************************************************************************************************/

	processRequest: function (request, response) {

		try {

			// check the session ? 
			// request.session.name = request.session.name || new Date().toUTCString();
			// console.log(request.sessionID);


			// request params
			var requestParams = adSrv.getRequestParams(request);

			// list of feeds to work with according to the request params
			var feeds = feedsMngr.getFeeds(requestParams);

			// choose the best feeds to work with, sort by priority
			var sFeeds = lgcMngr.sortFeeds(requestParams.cntry, feeds);

			// Ask the feeds for offers, format and choose the best offers, respond the client 
			var om = new offersMngr.offersMngr(requestParams, sFeeds, function (error, offers) {

				response.header("Cache-Control", "no-cache, no-store, must-revalidate");
				response.header("Pragma", "no-cache");
				response.header("Expires", 0);

				var resData = (error ? { "error": error } : offers);
				resData = frmtr.normalize(requestParams, resData); // add env params to each offer (cntry, ctgry, prdct etc.)
				resData = lgcMngr.chooseOffers(requestParams, resData); // choose the best offers to return to the client

				if (requestParams.callback) {
					response.jsonp(resData);
				}
				else {
					response.json(resData);
				}
			});

			om.getOffers();
		}
		catch (e) {
			console.log("processRequest::err::[" + e + "]");
			response.jsonp({ "error": e });
        }
	},

	init: function () {

		//loading all feeds moudle each modoule init will be execute if exiest
		var moudles_loader = new offersMngr.modules;
		moudles_loader.init();
		adSrv.modules = moudles_loader.modules;

		rsrcMngr.init(function (status) {
			console.log("rsrcMngr.init::status=[" + status + "]");
		});
		
		feedsMngr.init(function (status) {
			console.log("feedsMngr.init::status=[" + status + "]");
		});

		lgcMngr.init(function (status) {
			console.log("lgcMngr.init::status=[" + status + "]");
		});

		ddlsMngr.init(function (status) {
			console.log("ddlsMngr.init::status=[" + status + "]");
		});
        
		trndsMngr.init(function (status) {
			console.log("trndsMngr.init::status=[" + status + "]");
		});
	},

	getRequestParams: function (request) {
		try {
			var requestObject = baseApi.extend(true, {}, request.query);
			_.each(requestObject, function (value, key) {
				requestObject[key] = decodeURIComponent(value).toLowerCase();
				if (key == "cntry" && value.toLowerCase() == "gb") {
					requestObject[key] = "uk";
				}
			});

			if (requestObject.limit) {
				requestObject.limit = parseInt(requestObject.limit);
			}
			requestObject.sz = "300"; // request.params.size;
			return requestObject;
		}
		catch (e) { 
            console.log(e);        
        }
        return "";
	}
};

module.exports = adSrv;
module.exports.modules = adSrv.modules;



