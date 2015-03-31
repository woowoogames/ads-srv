var utils = require('util'),
baseApi = require("../baseapi"),
utl = require("../utl"),
frmtr = require("../formatter"),
sha1 = require('sha1'),
crypto = require('crypto'),
entities = require("entities");



var pricegrabber = {
	get : function (request, response) {
		if(typeof request.query['search_kw'] !== 'undefined'){
			var st = request.query['search_kw'];
			st = st.replace(" ","+");
			//var ip = "81.218.191.12"; //montiera ip
			var ip = "204.145.74.4";//verticalAdServer ip
			//var ip = "77.125.153.46";//local ip
			var currentKey = pricegrabber.getCurrentKey("87e713ad792","3234","2.55",ip);
			var keySHA1 = sha1(currentKey);
			var token = crypto.randomBytes(8).toString('hex');
			var finalKey = keySHA1.substring(0,18) + token + keySHA1.substring(18);
			var url = pricegrabber.getURL("3234",finalKey,st);
			console.log(url);
			baseApi.httpGetTimeout(url,function(err, res, body){
				//response.end(body);
				var json = baseApi.xmlToJSON(body);
				response.json(json);
			});
		}
		else{
			response.json({status:"error"});	
		}
	},
	getCurrentKey : function(private_key,pid,version,ip){
		var date = new Date();
		date = date.toISOString();
		var year = date.substring(0,4);
		var month = date.substring(5,7);
		var day = date.substring(8,10);
		var hour = date.substring(11,13);
		var currentKey = private_key + "," + year + "," + month + "," + day + "," + hour + "," + pid + "," + version + "," + ip;
		return currentKey;
	},
	getURL : function(pid,key,st){
		var url = "http://sws.api.pricegrabber.com/search_xml.php?pid=" + pid + "&key=" + key + "&version=2.55" + "&limit=4&q=" + st;
		return url;
	}
}

module.exports = pricegrabber.get;

