﻿


// [[wghts]]
// http://localhost:3000/offers/?cntry=it&prdct=coms001&st=&ctgry=music&subid=&n=10

var feedsMngr = require('./feedsmngr'),
	offersMngr = require('./offersmngr'),
	ddlsMngr = require('./ddls/ddlmngr'),
	trndsMngr = require('./trnds/trndmngr'),
	rsrcMngr = require('./rsrcmngr'),
	lgcMngr = require('./lgcmngr'),
	// wghts = require('./wghts'),
	baseApi = require("./baseapi"),
	// path = require("path"),
	utl = require("./utl"),
	frmtr = require("./formatter"),
	_ = require("underscore"),
	influxReporter = require('../influx-client');


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
			// influxReporter.report('adsrvr', {
			// 	country: requestParams.cntry,
			// 	category: requestParams.ctgry,
			// 	host: requestParams.host,
			// });
			if (requestParams) {

				// list of feeds to work with according to the request params
				var feeds = []; // 

				if (requestParams.qa) { // asking for specific feed
					console.log("asking for: [" + requestParams.qa + "]");
					feeds = feedsMngr.getFeed(requestParams.qa);
				}
				else {
					console.log("asking for dynamic feed");
					feeds = feedsMngr.getFeeds(requestParams);
				}

				if(feeds.length > 0){
					// choose the best feeds to work with, sort by priority
					var sFeeds = lgcMngr.sortFeeds(requestParams, feeds);
					
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
				else{
					utl.log("[main.js][processRequest] - no feeds available");
					response.jsonp([]);
				}
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

		// loading all feeds moudle each modoule init will be execute if exiest

		offersMngr.mdlsMngr.init(function (status) {
			utl.log("[main.js][init][mdlsMngr.init] - status=[" + status + "]");
		});

		// load resources to the adserver
		rsrcMngr.init(function (status) {
			utl.log("[main.js][init][rsrcMngr.init] - status=[" + status + "]");
		});
		
		// [[wghts]]
		// wghts.init(function (status) {
		// 	utl.log("[main.js][init][wghts.init] - status=[" + status + "]");
		// });

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
			//requestObject.sz = "300"; // request.params.size;
			if(typeof request.params.type !== 'undefined' && typeof request.params.qa !== 'undefined'){
				requestObject.type = request.params.type;
				requestObject.qa = request.params.qa;
			}
			else if(typeof request.params.type !== 'undefined' && request.params.type == 'https'){
				requestObject.type = request.params.type;
			}
			else if(typeof request.params.qa === 'undefined' && typeof request.params.type !== 'undefined' && request.params.type!== 'serp' && request.params.type!== 'ddls' && request.params.type!== 'trnds'){
				requestObject.qa = request.params.type;
			}
			else{
				requestObject.type = request.params.type;
			}
			if(frmtr.isValidRequest(requestObject)){
				if (requestObject.limit) {
					requestObject.limit = parseInt(requestObject.limit);
				}
				if(typeof requestObject.cntry == 'undefined')
					requestObject.cntry = 'int';
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






