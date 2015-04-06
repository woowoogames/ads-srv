var utils = require('util'),
	baseApi = require("../baseapi"),
	utl = require("../utl"),
	frmtr = require("../formatter"),
	sha1 = require('sha1'),
	crypto = require('crypto'),
	entities = require("entities");

String.prototype.trimLeft = function(charlist) {
  if (charlist === undefined)
    charlist = "\s";
 
  return this.replace(new RegExp("^[-, ]+"), "");
};


var pricegrabber = function () {
	this.mClbk = null;
	this.mPrms = null;

	var that = this;
	this.getOffers = function (prms, clbk) {
		this.mPrms = prms;
		this.mClbk = clbk;
		//var ip = "81.218.191.12"; //montiera ip
		//var ip = "69.65.43.205";//overplay us ip
		var ip = "204.145.74.4";//verticalAdServer ip
		//var ip = "77.125.153.46";//local ip
		var currentKey = this.getCurrentKey("87e713ad792","3234","2.55",ip);
		var keySHA1 = sha1(currentKey);
		var token = crypto.randomBytes(8).toString('hex');
		var finalKey = keySHA1.substring(0,18) + token + keySHA1.substring(18);
		var url = this.getURL("3234",finalKey,prms);
		try {
			baseApi.httpGetTimeout(url,function(err, res, body){
				try{
					var json = baseApi.xmlToJSON(body);
					if(that.saftyCheck(json)){
						var results = that.format(json.document.product);
						if(results.length >0){
							utl.log("[pricegrabber.js][getOffers] - return [" + results.length + "] results");
							that.mClbk(0, results);
						}
						else{
							utl.log("[pricegrabber.js][getOffers] - return 0 results");
							that.mClbk(1, []);
						}
					}
					else{
						utl.log("[pricegrabber.js][getOffers] - return 0 results");
						that.mClbk(1, []);
					}
				}
				catch(e){
					utl.log("[pricegrabber.js][getOffers:err] -- fatal error [" + e + "]");
					that.mClbk(1, []);
				}
			});
		}
		catch (e) {
			utl.log("[pricegrabber.js][getOffers::err] -- fatal error [" + e + "]");
			that.mClbk(1, e);
		}
	};

	this.saftyCheck = function(json){
		if(typeof json !== 'undefined'){
			if(typeof json.document !== 'undefined'){
				if(typeof json.document.product !== 'undefined')
					return true;
				else
					return false;
			}
			else
				return false;
		}
		else
			return false;
	};

	this.format = function(offer){
		var rsltArr = [];
		var obj = frmtr.getOfferObject();
		try{
			obj.typ = "img";
			obj.ofrtype = "feed";
			obj.desc.short = this.titleFix(offer.title_short);
			obj.desc.long = entities.decodeXML(offer.title);
			obj.img.small = offer.image_medium;
			obj.img.big = offer.image_160;
			obj.meta.feed = "prcgrbr";
			obj.meta.cntry = that.mPrms.cntry;
			obj.meta.ctgry = that.mPrms.ctgry;
			obj.meta.prdct = that.mPrms.prdct;
			obj.sz = "";
			obj.prc = offer.price[0].$t;
			obj.lnk = entities.decodeHTML(offer.offer.url);
			obj.store.rtng = offer.offer.rating;
			obj.store.name = offer.offer.retailer;
			if(typeof offer.offer.retailer_logo !== 'undefined')
				obj.store.logo = offer.offer.retailer_logo;
			obj.uid = "";
			rsltArr.push(obj);
			return rsltArr;
		}
		catch(e){
			utl.log("[pricegrabber.js][format::err] -- [" + e + "]");
			return rsltArr;
		}
	};

	this.titleFix = function(title){
		return this.getFixedText(this.decodeHTMLEntities(title).trimLeft())
	};

	this.getFixedText = function(title){
		if(title.indexOf('-')!=-1){
			return title.substring(0,title.indexOf('-'));
		}
		else{
			return title
		}
	}

	this.decodeHTMLEntities = function(text) {
	    var entities = [
	        ['apos', '\''],
	        ['amp', '&'],
	        ['lt', '<'],
	        ['gt', '>'],
	        ['#33','!'],
			['#34','"'],
			['#35','#'],
			['#36','$'],
			['#37','%'],
			['#38','&'],
			['#39','\''],
			['#40','('],
			['#41',')'],
			['#42','*'],
			['#43','+'],
			['#44',','],
			['#45','-'],
			['#46','.'],
			['#47','/'],
			['#58',':'],
			['#59',';'],
			['#60','<'],
			['#61','='],
			['#62','>'],
			['#63','?'],
			['#64','@'],
			['#91','['],
			['#92','\\'],
			['#93',']'],
			['#94','^'],
			['#95','_'],
			['#96','`'],
			['#97','-'],
			['#123','{'],
			['#124','|'],
			['#125','}'],
	    ];
	    for (var i = 0, max = entities.length; i < max; ++i) 
	        text = text.replace(new RegExp('&'+entities[i][0]+';', 'g'), entities[i][1]);

	    return text;
	}

	this.getCurrentKey = function(private_key,pid,version,ip){
		var date = new Date();
		date = date.toISOString();
		var year = date.substring(0,4);
		var month = date.substring(5,7);
		var day = date.substring(8,10);
		var hour = date.substring(11,13);
		var currentKey = private_key + "," + year + "," + month + "," + day + "," + hour + "," + pid + "," + version + "," + ip;
		return currentKey;
	};

	this.getURL = function(pid,key,prms){
		var st = prms.st.replace(" ","+");
		var url = "http://sws.api.pricegrabber.com/search_xml.php?pid=" + pid + "&key=" + key + "&version=2.55" + "&q=" + st + "&limit=1&offers=1&offer_limit=1&mode=" + this.fixProduct(prms.prdct);
		return url;
	};

	this.fixProduct = function(product){
		var prefix = "montiera_";
		var prdct = product.substring(0,4);
		var num = product.substring(4);
		return prefix + prdct + "_" + num;
	}


};
module.exports = pricegrabber;

