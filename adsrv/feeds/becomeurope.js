var utils = require('util'),
baseApi = require("../baseapi"),
utl = require("../utl")
frmtr = require("../formatter");


var becomeurope = function(){
	var geoUrls = {
		us: "http://us.channel.become.com/livexml/3.1/ldk-us.portal/",
		uk: "http://uk.channel.become.eu/livexml/3.1/ldk-uk.portal/",
		de: "http://de.channel.become.eu/livexml/3.1/ldk-de.portal/",
		fr: "http://fr.channel.become.eu/livexml/3.1/ldk-fr.portal/" ,
		it: "http://it.channel.become.eu/livexml/3.1/ldk-it.portal/" 
	};

	var that = this;

	this.getOffers = function(prms,clbk){
		this.mPrms = prms;
		var url = 'http://Montiera:Pn4wHCp@' + this.getUrl();
		console.log(url);
		baseApi.httpGet({url:url},function (error, response, body) {
			try{
				var data = JSON.parse(body);
				if(that.saftyCheck(data)){
					if(data.productResultsModule.productResults.product.length>0){
						var results = that.format(data.productResultsModule.productResults.product);
						clbk(0,results);	
					}
					else{
						utl.log("[becomeurope.js][getOffers] - return 0 results");
						that.mClbk(1, []);
					}
				}
				else{
					utl.log("[becomeurope.js][getOffers::err] -- fatal error [" + e + "]");
					clbk(1,[]);
				}
			}
			catch(err){
				utl.log("[becomeurope.js][getOffers::err] -- fatal error [" + e + "]");
				clbk(1,[]);
			}
		});
	};

	this.saftyCheck = function(data){
		if(typeof data !== 'undefined')
			if(typeof data.productResultsModule !== 'undefined')
				if(typeof data.productResultsModule.productResults !== 'undefined')
					if(typeof data.productResultsModule.productResults.product !== 'undefined')
						return true;
					else
						return false;
					else
						return false;	
					else
						return false;
					else
						return false;
				};

	this.format = function (offers) {
		try{
			var rsltArr = [];
			for(var i=0 ; i<offers.length; i++){
				var obj = frmtr.getOfferObject();
				try{
					obj.typ = "img";
					obj.ofrtype = "feed";
					obj.desc.short = offers[i].offer.label;
					obj.desc.long = offers[i].description;
					obj.img.small = offers[i].image[0].source;
					obj.img.big = null;
					obj.meta.feed = "becmeurp";
					obj.meta.cntry = that.mPrms.cntry;
					obj.meta.ctgry = that.mPrms.ctgry;
					obj.meta.prdct = that.mPrms.prdct;
					obj.meta.sz = null;
					obj.lnk = "need to add once the implementation finish";
					obj.prc = offers[i].offer.price.value
					obj.store.name = offers[i].offer.merchant.label;
					obj.store.logo = "";
					obj.store.rtng = "";
					obj.uid = "";
					rsltArr.push(obj);
				}
				catch(e){
					utl.log("[buscape.js][format::err] -- [" + e + "]");
				}
			}
			return rsltArr;			
		}
		catch(err){
			utl.log("[buscape.js][format::err] -- [" + e + "]");
		}
	}

	this.getUrl = function(){
		var url = geoUrls[that.mPrms.cntry];
		url += "/query?qry=" + that.mPrms.st + "&rtype=JSON";
		return url;
	};

};

module.exports = becomeurope;