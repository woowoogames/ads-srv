// var io = require('../routes/xml_io.js');
var baseApi = require("../../../baseapi.js");
// var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
// var xmlhttp = new XMLHttpRequest();
var q = require('q');
var xml_data=null;

var progarms_country = ["us","fr","pl","es","de","gb","in"];
var ad_sizes = ['300x250','160x600','728x90'];
var pathGetCodes = [];

var refresh_banners = function (callback){	
	try{
		createGetCodePath();
		var promises = [];
		promises.push(resulutions_execute());
		q.all(promises).then(function() {
			console.log('DONE-banners ! **********');
			callback("bannerDone");
		});
	}
	catch(err){}
}

var createGetCodePath = function(){
	for(var i=0 ; i<progarms_country.length ;i++){
		for(var j=0 ; j<ad_sizes.length ;j++){
			var resulution = ad_sizes[j].split('x');
			pathGetCodes.push({
				country : progarms_country[i],
				size: ad_sizes[j],
				url:"https://network.adsmarket.com/site/API2?userid=215541&key=c99a05a58833a5585f07ca45745dde73&fn=getcodes&Type=2|3&width=" + resulution[0] +"&height=" + resulution[1] + "&country=" + progarms_country[i]
			});
		}
	}
}

var refresh_programs = function(callback){
	try{
		var promises = [];
		promises.push(program_excecute());
		q.all(promises).then(function() {
			console.log('DONE-programs ! **********');
			callback("programDone");
		});
	}
	catch(err){}
}



function delayedLoop(collection, callback, interval){
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

var resulutions_execute = function(){
	var defered = q.defer();
	try{
		delayedLoop(pathGetCodes,function(idx,currPath,callback){
			var resulution = currPath.size.split('x');
			var path_to_save_to = './matomy_data/ad/banners/' + pathGetCodes[idx].country + "/" + pathGetCodes[idx].size;
			//var path = "https://network.adsmarket.com/site/API2?userid=215541&key=c99a05a58833a5585f07ca45745dde73&fn=getcodes&Type=2|3&width=" + resulution[0] +"&height=" + resulution[1];
			var path = currPath.url;
			baseApi.httpsGetTimeout(path,1000000000,function(err, res, body){
				baseApi.writeFileSync(path_to_save_to +'.xml',body);
				console.log("done :" + currPath.country + " " + currPath.size);
				if(callback)
					callback();
				if(idx == pathGetCodes.length-1) {
					defered.resolve();
				}
			});
		});
	}
	catch(err){
		console.log(err);
	}
	return defered.promise;
}

var program_excecute = function(){
	var defered = q.defer();
	try{
		delayedLoop(progarms_country,function(idx,curr_contry,callback){
			var path_to_save_to = "./matomy_data/programs/"+progarms_country[idx];
			//create_file_ajax_request("https://network.adsmarket.com/site/API2?userid=215541&key=c99a05a58833a5585f07ca45745dde73&fn=findprograms&countries=" + curr_contry ,path_to_save_to,callback);
			var path = "https://network.adsmarket.com/site/API2?userid=215541&key=c99a05a58833a5585f07ca45745dde73&fn=findprograms&relationship_status=3&countries=" + curr_contry;
			baseApi.httpsGetTimeout(path,1000000000,function(err, res, body){
				baseApi.writeFileSync(path_to_save_to +'.xml',body);
				console.log("done :" + path_to_save_to + ".xml");
				if(callback)
					callback();
				if(idx == progarms_country.length-1) {
					defered.resolve();
				}
			});
		});
	}
	catch(err){
		console.log(err);
	}
	return defered.promise;
}

module.exports.refresh = {
	refresh_banners:refresh_banners,
	refresh_programs:refresh_programs
}