var baseApi = require("../baseapi"),
    path = require("path"),
	q = require('q'),
	utils = require('util'),
	utl = require("../utl"),
	frmtr = require("../formatter");

var data={};
var resolutions = {
	"160" : "160x600",
	"728" : "728x90" 
};

var ctrgyMapper = {
    "mobile": "'Mobile Content'",
    "videogames":"Games",
    "downloads":"Downloads",
    "travel":"Travel",
    "dating":"Dating",
    "health":"'Health and Wellness'",
    "finance":"Finance",
    "celebsngossip":"Other",
    "shopping":"eCommerce"
};
// Incentivized
// Entertainment
// Insurance
// 'Lead Generation'
// 'Mobile Apps'
// 'Consumer Products'
// Software
// Surveys 
// 'Biz Op'

var matomy = function () {
	this.getOffers = function (prms, clbk) {
		utl.log("[matomy.js][getOffers]");
		try{
			var resolution = resolutions[prms.sz];
			var country = prms.cntry;
			var category = prms.ctgry;
			var n = prms.n;
			category = ctrgyMapper[category];
		    if(this.safeResults(country,category,resolution)){
		 	   var arr = data[country][category][resolution];
		    	var results = shuffle(n,arr);
		    	if(results.length>0){
		    		var matomyResults = this.format(results,resolution);
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
		catch(err){
			that.mClbk(1, "[matomy.js][getOffers] - fatal error - status - " + err);
			clbk(1,e);
		}
	},
	this.safeResults = function(country,category,resolution){
		if(typeof data[country] !== 'undefined'){
			if(typeof data[country][category] !== 'undefined')
				if(typeof data[country][category][resolution] !== 'undefined')
					return true;
				else
					return false;
			else
				return false;
		}
		else
			return false;
	},
	this.format = function (offers,resolution) {
		try{
			var rsltArr = [];
			for(var i=0 ; i<offers.length; i++){
				var obj = frmtr.getOfferObject();
				try{
					obj.typ = "img";
					obj.ofrtype = "raw";
					obj.img.big = offers[i].banner_img;
					obj.meta.feed = "matomy";
					obj.lnk = offers[i].banner_link;
					obj.sz = resolution;
					rsltArr.push(obj);
				}
				catch(e){}
			}
			return rsltArr;			
		}
		catch(err){}
	}

};

function shuffle(n,arr){
	var n = Math.min(n,arr.length);
	var results = [];
	var arrNums = new Array(n);
	var rnd = Math.floor(Math.random()*arr.length);
	for(var i=0 ; i<arrNums.length ;i++){
		while(typeof arrNums[i] === 'undefined'){
			if(arrNums.indexOf(rnd)==-1)
				arrNums[i] = rnd;
			else
				rnd = Math.floor(Math.random()*arr.length);
		}
	}
	for(var i=0 ; i<arrNums.length ;i++){
		var result = {banner_img : arr[arrNums[i]].banner_img,
			banner_link : arr[arrNums[i]].banner_link};
			results.push(result);
		}
		return results;
}

var all_resulutions = {
	key_300x250 : undefined,
	key_160x600 : undefined,
	key_728x90  : undefined
};
var all_programs = {
	key_us: undefined,
	key_uk: undefined,
	key_pl: undefined,
	key_es: undefined,
	key_de: undefined,
	key_fr: undefined,
	key_in: undefined
};
var flag = true;
var resulution_to_load = [/*"300x250",*/"160x600","728x90"];
var program_to_load = ["us","fr","pl","es","de","uk","in"];
var categories_to_load=["Biz Op",
						"Consumer Products",
						"Dating",
						"Downloads",
						"Entertainment",
						"Finance",
						"Games",
						"Health and Wellness",
						"Incentivized",
						"Lead Generation",
						"Mobile Apps",
						"Mobile Optimized",
						"Other",
						"Software",
						"Surveys",
						"Travel",
						"eCommerce"];


function create_data_object(){
	// flag=false;
	for(var i=0 ; i<program_to_load.length ; i++){
		data[program_to_load[i]] = get_all_country_categires(all_programs['key_'+program_to_load[i]]);
	}
	for(var i=0 ; i<program_to_load.length ; i++){
		for(var j=0 ; j<resulution_to_load.length ; j++){
			for(var k=0 ; k<categories_to_load.length ; k++){
				var json_response = get_json_response(all_resulutions['key_'+resulution_to_load[j]],
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
		promises.push(init_files(resulution_to_load,"matomy_node_server/matomy_data/ad/banners/",all_resulutions,undefined));
		promises.push(init_files(program_to_load,"matomy_node_server/matomy_data/programs/",all_programs,get_program_id_category));
		q.all(promises).then(function() {
			//console.log('great sucess **********');
			callback();
		})
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
							utl.log("[matomy.js][init_files] - read " + curr_array_obj + " file finished! ")
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

init(function(){
	create_data_object();
	console.log("[matomy.js][init] - done! - all files loaded to memory");
});
module.exports = matomy;