
var feedsMngr = require('./feedsmngr'),
	offersMngr = require('./offersmngr'),
	ddlsMngr = require('./ddls/ddlmngr'),
	trndsMngr = require('./trnds/trndmngr'),
	rsrcMngr = require('./rsrcmngr'),
	lgcMngr = require('./lgcmngr'),
	baseApi = require("./baseapi"),
	// path = require("path"),
	utl = require("./utl"),
	frmtr = require("./formatter"),
	_ = require("underscore");


	var adSrv = {

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
			utl.log("[main.js][processRequest] url - " + request.url);

			// request params
			var requestParams = adSrv.getRequestParams(request);

			if(requestParams){
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
			}//invalid request
			else{
				utl.log("[main.js][processRequest] - invalid request");
				response.jsonp({status : "invalid request"});
			}
		}
		catch (e) {
			utl.log("[main.js][processRequest::err][" + e + "]");
			response.jsonp({ "error": e });
        }
	},

	init: function () {

		//loading all feeds moudle each modoule init will be execute if exiest

		offersMngr.mdlsMngr.init(function (status) {
			utl.log("[main.js][init][mdlsMngr.init] - status=[" + status + "]");
		});

		rsrcMngr.init(function (status) {
			utl.log("[main.js][init][rsrcMngr.init] - status=[" + status + "]");
		});
		
		feedsMngr.init(function (status) {
			utl.log("[main.js][init][feedsMngr.init] - status=[" + status + "]");
		});

		lgcMngr.init(function (status) {
			utl.log("[main.js][init][lgcMngr.init] - status=[" + status + "]");
		});

		ddlsMngr.init(function (status) {
			utl.log("[main.js][init][ddlsMngr.init] - status=[" + status + "]");
		});
        
		trndsMngr.init(function (status) {
			utl.log("[main.js][init][trndsMngr.init] - status=[" + status + "]\n");
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
			if(frmtr.isValidRequest(requestObject)){
					if (requestObject.limit) {
						requestObject.limit = parseInt(requestObject.limit);
					}
				//requestObject.sz = "300"; // request.params.size;
				requestObject.type = request.params.type;
				return requestObject;
			}
			else{//request isn't valid!
				return null;
			}
		}
		catch (e) { 
            console.log(e);        
        }
        return "";
	}
};

module.exports = adSrv;






