var utils = require('util'),
baseApi = require("../baseapi"),
utl = require("../utl"),
frmtr = require("../formatter"),
sha1 = require('sha1'),
crypto = require('crypto'),
entities = require("entities");


/////////////////////////////////


/////////////////////////////////



var pricegrabber = {

	cnfg : {
		// ip: "204.145.74.4", 
		ip : "81.218.191.12",
		private_key : "",
		pid : "",
		version : "2.55"
	},

	get: function (request, response) {
		try{
			if(typeof request.query['search_kw'] !== 'undefined'){

				var st = request.query['search_kw'];
				st = st.replace(" ","+");

				var cntry = request.query['cntry'];
				pricegrabber.setConfig(cntry);

				var currentKey = pricegrabber.getCurrentKey();
				console.log("test page -- " + url);
				var keySHA1 = sha1(currentKey);
				var token = crypto.randomBytes(8).toString('hex');
				var finalKey = keySHA1.substring(0,18) + token + keySHA1.substring(18);
				var url = pricegrabber.getURL(finalKey,st);
				console.log("test page -- " + url);
				// alert(url);
				baseApi.httpGetTimeout(url,function(err, res, body){
					//response.end(body);
					var json = baseApi.xmlToJSON(body);
					response.json(json);
				});
			}
			else{
				response.json({status:"error"});	
			}
		}
		catch (e) {
			console.log(e);
		}
	},

	setConfig : function (cntry) {

		switch (cntry) {
			case "uk":
				pricegrabber.cnfg.private_key = "f87d0b06d42";
				pricegrabber.cnfg.pid = "3385";
				break;
			case "ca":
				pricegrabber.cnfg.private_key = "34d2e646282";
				pricegrabber.cnfg.pid = "3386";
				break;
			default: // us
				pricegrabber.cnfg.private_key = "87e713ad792";
				pricegrabber.cnfg.pid = "3234";
				break;
		}

	},

	getCurrentKey : function(private_key,pid,version,ip){
		var date = new Date();
		date = date.toISOString();
		var year = date.substring(0,4);
		var month = date.substring(5,7);
		var day = date.substring(8,10);
		var hour = date.substring(11,13);
		var currentKey = pricegrabber.cnfg.private_key + "," + year + "," + month + "," + day + "," + hour + "," + pricegrabber.cnfg.pid + "," + pricegrabber.cnfg.version + "," + pricegrabber.cnfg.ip;
		return currentKey;
	},
	getURL : function(key,st){
		var url = "http://sws.api.pricegrabber.com/search_xml.php?pid=" + pricegrabber.cnfg.pid + "&key=" + key + "&version=2.55" + "&limit=1&offers=1&offer_limit=1&q=" + st;
		return url;
	}
}

module.exports = pricegrabber.get;

