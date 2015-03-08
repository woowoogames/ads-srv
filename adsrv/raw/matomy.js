var baseApi = require("../baseapi"),
    path = require("path"),
	q = require('q'),
	utils = require('util'),
	utl = require("../utl"),
    offersMngr = require('../offersmngr'),
	frmtr = require("../formatter");

var data={};
var resolutions = {
	"160" : "160x600",
	"728" : "728x90",
	"300" : "300x250"
};
var ctrgyMapper = {
    "mobile": "Mobile Content"/*["Mobile Content","Mobile Apps","Mobile Optimized","Telecom"]*/,
    "video games":"Games",
    "downloads":"Downloads",
    "travel":"Travel",
    "dating":"Dating",
    "health":"Health and Wellness",
    "finance":"Finance",
    "celebsngossip":"Other",
    "shopping": "Shopping"/*["eCommerce","Shopping","Shopping Clubs"]*/,
    "education":"Education",
    "spiritual" :"Astrology",
    "web market" : "Auctions",
    "gambling" : "Gambling" /*["Gambling","Lottery"]*/,
    "lifestyle" : "Lifestyle & Fashion",
    "trends" : "Incentivized",
    "home entertainment": "Entertainment",
    "computers & tablets" : "Software",
    "management & success" : "Biz Op",
    "hobbies" : "Other",
    "professional services" : "Home Services"
};

var matomy = function () {
	this.getOffers = function (prms, clbk) {
		utl.log("[matomy.js][getOffers]");
		try{
			//var resolution = resolutions[prms.type];
			var country = prms.cntry;
			var category = prms.ctgry;
			var n = prms.n;
			category = ctrgyMapper[category];
		    if(this.safeResults(country,category)){
		 	   var arr = data[country][category];
		 	   if(arr){
		 	    	var results = [];
		 	   		if(typeof arr['160x600'] !== 'undefined' && arr['160x600'].length>0)
		 	   			results.push({size:160 , value :arr['160x600'][Math.floor(Math.random()*arr['160x600'].length)]});
		 	   		if(typeof arr['300x250'] !== 'undefined' && arr['300x250'].length>0)
		 	   			results.push({size:300 , value :arr['300x250'][Math.floor(Math.random()*arr['300x250'].length)]});
		 	   		if(typeof arr['728x90'] !== 'undefined' && arr['728x90'].length>0)
		 	   			results.push({size:728 , value :arr['728x90'][Math.floor(Math.random()*arr['728x90'].length)]});
			 	   	if(results.length>0){
			 	   		var matomyResults = this.format(results);
			 	   		this.productAndSubid(matomyResults,prms.prdct,prms.subid);
			 	   		clbk(0,matomyResults);
			 	   	}
			 	   	else{
			 	   		clbk(1,"[matomy.js][getOffers] - no match");	
			 	   	}
		 	   }
		 	   else{
		 	   		clbk(1,"[matomy.js][getOffers] - no match");	
		 	   }
		    }
		    else{
		    	clbk(1,"[matomy.js][getOffers] - no match");
		    }
		}
		catch(err){
			that.mClbk(1, "[matomy.js][getOffers] - fatal error - status - " + err);
			clbk(1,e);
		}
	},
	this.productAndSubid = function(matomyResults,productId,subId){
		for(var i = 0 ; i < matomyResults.length ; i++){
			matomyResults[i].lnk += "&dp=" + productId;
			if(typeof subId !== 'undefined'){
				matomyResults[i].lnk += "&dp2=" + subId;
			}
		}
	},
	this.safeResults = function(country,category){
		if(typeof data[country] !== 'undefined'){
			if(typeof data[country][category] !== 'undefined')
				return true;
			else
				return false;
		}
		else
			return false;
	},
	this.format = function (offers) {
		try{
			var rsltArr = [];
			for(var i=0 ; i<offers.length; i++){
				var obj = frmtr.getOfferObject();
				try{
					obj.typ = "img";
					obj.ofrtype = "raw";
					obj.img.big = offers[i].value.banner_img;
					obj.meta.feed = "matomy";
					obj.lnk = offers[i].value.banner_link;
					obj.sz = offers[i].size;
					rsltArr.push(obj);
				}
				catch(e){}
			}
			return rsltArr;			
		}
		catch(err){}
	}

};
var all_resulutions = {
	key_300x250 : {},
	key_160x600 : {},
	key_728x90  : {}
};
var all_programs = {
	key_us: undefined,
	key_pl: undefined,
	key_es: undefined,
	key_de: undefined,
	key_fr: undefined,
	key_in: undefined
};
var resulution_to_load = ["300x250","160x600","728x90"];
var program_to_load = ["au" , "at" , "ar", "br", "cl", "co", "de", "es", "fr", "gb", "hu", "in", "mx", "pe", "pl", "ru", "us", "ve"];
// var categories_to_load=["Biz Op",
// 						"Consumer Products",
// 						"Dating",
// 						"Downloads",
// 						"Entertainment",
// 						"Finance",
// 						"Games",
// 						"Health and Wellness",
// 						"Incentivized",
// 						"Lead Generation",
// 						"Mobile Apps",
// 						"Mobile Optimized",
// 						"Other",
// 						"Software",
// 						"Surveys",
// 						"Travel",
// 						"eCommerce"];
var categories_to_load = [];
var pathGetCodes = [];

function create_data_object(){
	for(var i=0 ; i<program_to_load.length ; i++){
		data[program_to_load[i]] = get_all_country_categires(all_programs['key_'+program_to_load[i]]);
	}
	for(var i=0 ; i<program_to_load.length ; i++){
		for(var j=0 ; j<resulution_to_load.length ; j++){
			for(var k=0 ; k<categories_to_load.length ; k++){
				var json_response = get_json_response(all_resulutions['key_'+resulution_to_load[j]][program_to_load[i]],
					all_programs['key_'+program_to_load[i]],categories_to_load[k]);
				if(json_response.length>0){
					var c =data[program_to_load[i]];
					var d = c[categories_to_load[k]];
					d[resulution_to_load[j]] = json_response;
				}
			}
		}
	}
}

function get_all_country_categires(country){
	var ctgrs = {};
	for(var i=0 ; i<country.length ; i++){
		for(var j = 0 ; j<country[i].program_category.length ; j++){
			var key = country[i].program_category[j];
			if(!ctgrs[key]){
				var cat = ctgrs[country[i].program_category[j]] = {};
				for(var k=0 ; k<resulution_to_load.length ; k++){
					cat[resulution_to_load[k]]={};
				}
			}
		}
	}
	return ctgrs;
}

//resulution --> all_resulutions['key_'+resolution]
//programs   --> all_programs['key_'+country]
function get_json_response(resulution,programs,category){
//	var size = resulution.reply.codes[0].creative.length;
	var size = resulution.reply.codes.creative.length;
	var p_id = get_program_id_by_category(category,programs);
	var json_response = [];
	for(var i =0 ; i < size ; i++){
		if(p_id.indexOf(resulution.reply.codes.creative[i].program_id)!=-1){//match!
			var add = {banner_img : resulution.reply.codes.creative[i].content_url,
				banner_link : resulution.reply.codes.creative[i].traffic_sources.traffic_source.click_url};
				json_response.push(add);
			}
		}
		// if(p_id.indexOf(resulution.reply.codes[0].creative[i].program_id[0])!=-1){//match!
		// 	var add = {banner_img : resulution.reply.codes[0].creative[i].content_url[0],
		// 		banner_link : resulution.reply.codes[0].creative[i].traffic_sources[0].traffic_source[0].click_url[0]};
		// 		json_response.push(add);
		// 	}
		// }
		return json_response;
	}

	function delayedLoop(collection, callback, interval) {
		try {
			var index = 0, length = collection.length,
			collection = collection || [];
			interval = interval || 0;
			(function loopMe() {
				if (index < length) {
					callback.call(collection[index], index, collection[index], function (cntinue) {
						setTimeout(function () {
							try {
								index++;
								if (cntinue !== false) {
									loopMe();
								}
							}
							catch (e) 
							{}
						}, interval);
					});
				}
			} ())
		}
		catch (e) { 
		}
	}

	function init(callback){
		var promises = [];
		loadCategories();
		createGetCodePath();
		promises.push(initBanners());
	    promises.push(init_files(program_to_load,"matomy_node_server/matomy_data/programs/",all_programs,get_program_id_category));
		q.all(promises).then(function() {
			callback();
		});
	}

	function initBanners(){
		var defered = q.defer();
		delayedLoop(pathGetCodes,function(idx,curr,callback){
			try{
				baseApi.readFile(path.join(path.dirname(__filename),"matomy_node_server/matomy_data/ad/banners/" + curr.country + "/" + curr.size + '.xml'),function(err,data){
						var result = baseApi.xmlToJSON(data);
						if(typeof result !== 'undefined'){
							all_resulutions["key_" + curr.size][curr.country] = result;
							utl.log("[matomy.js][initBanners] - read " + curr.country + "/" + curr.size + ".xml file finished! ");
							callback();
							if(idx == pathGetCodes.length-1) {
								defered.resolve();
							}
						}
					});
			}
			catch(err){
				console.log("init failed!");
			}
		});
		return defered.promise;
	}

	var createGetCodePath = function(){
		for(var i=0 ; i<program_to_load.length ;i++){
			for(var j=0 ; j<resulution_to_load.length ;j++){
				var resulution = resulution_to_load[j].split('x');
				pathGetCodes.push({
					country : program_to_load[i],
					size: resulution_to_load[j]
				});
			}
		}
	}


	function init_files(files_to_load,relative_path,load_to,execute_function){
		var defered = q.defer();
		delayedLoop(files_to_load,function(idx,curr_array_obj,callback){
			try{
				baseApi.readFile(path.join(path.dirname(__filename),relative_path + curr_array_obj + '.xml'),function(err,data){
						var result = baseApi.xmlToJSON(data);
						if(typeof result !== 'undefined'){
							if(typeof execute_function !== 'undefined'){
								load_to["key_" + curr_array_obj] = execute_function(result,curr_array_obj);
							}
							else{
								load_to["key_" + curr_array_obj] = result;
							}
							utl.log("[matomy.js][init_files] - read " + curr_array_obj + " file finished! ");
							callback();
							if(idx == files_to_load.length-1) {
								defered.resolve();
							}
						}
					});
			}
			catch(err){
				console.log("init failed!");
			}
		});
		return defered.promise;
	}

	function get_program_id_by_category(category,geo_arr){
		var p_id = [];
		for(var i=0 ; i<geo_arr.length ;i++){
			if(geo_arr[i].program_category.indexOf(category)!=-1){
				p_id.push(geo_arr[i].program_id);
			}
		}
		return p_id;
	}

	function get_program_id_category(geo,country){
		var size = geo.reply.programs.program.length;
		var programid_category_array = [];
		for (var i = 0; i < size; i++) {//
			if(geo.reply.programs.program[i].association_status=="Approved"){
				// if(geo.reply.programs[0].program[0].countries.indexOf(country)!=-1 && geo.reply.programs[0].program[0].countries.length==1){
					var program_id = geo.reply.programs.program[i].id;
					var program_category = geo.reply.programs.program[i].categories.split(',');
					var obj_to_add = {program_id : program_id , program_category : program_category};
					programid_category_array.push(obj_to_add);
				//}
			}
		}
		return programid_category_array;
	}


	function loadCategories(){
		var defered = q.defer();
		baseApi.readFile(path.join(path.dirname(__filename),"matomy_node_server/matomy_data/category.xml"),function(err,data){
			var ctgrs = baseApi.xmlToJSON(data);
			for(var i=0 ; i<ctgrs.reply.categories.category.length ; i++){
				categories_to_load.push(ctgrs.reply.categories.category[i].category_title);
			}
			defered.resolve();
		});
		return defered.promise;
	}

init(function(){
	create_data_object();
	console.log("[matomy.js][init] - done! - all files loaded to memory");
});

// update process each day at 24:00
// baseApi.cron("MatomyUpdate",path.join(path.dirname(__filename),"/matomy_node_server/matomy.js"),'00 00 00 * * *',function(){
//     offersMngr.mdlsMngr.modules.raw['matomy'].init(); //reload module after update
// });

module.exports = {
	matomy : matomy,
	init : init
}
