var baseApi = require('../adsrv/baseapi');
var queryString = require('querystring');
var _request = require('request');
var url = require('url') ;
var tools = {
	getData :function(request,response) {
		var queryObject = url.parse(request.url,true).query;
 	    var prms = queryString.stringify(queryObject);
		var serviceUrl = "http://bi.montiera.com/coms/coms.asmx/"+request.params.fn+"?"+prms;
		console.log(serviceUrl);
		//_request.get(serviceUrl).pipe(response);
		baseApi.httpGetTimeout(serviceUrl,function(error,res,body) {
			response.end(body);
		});
	}
}; 

module.exports = tools;