// var io = require('../routes/xml_io.js');
var baseApi = require("../../../baseapi.js");
// var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
// var xmlhttp = new XMLHttpRequest();
var q = require('q');
var xml_data=null;

var progarms_contray = ["us","fr","pl","es","de","uk","in"];
var ad_sizes = ['300x250','160x600','728x90'];


var refresh_banners = function (callback){	
	try{
		var promises = [];
		promises.push(resulutions_execute());
		q.all(promises).then(function() {
			console.log('DONE-banners ! **********');
			callback("bannerDone");
		});
	}
	catch(err){}
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
		delayedLoop(ad_sizes,function(idx,curr_size,callback){
			var resulution = curr_size.split('x');
			var path_to_save_to = './matomy_data/ad/banners/1/' + ad_sizes[idx];
			var path = "https://network.adsmarket.com/site/API2?userid=215541&key=c99a05a58833a5585f07ca45745dde73&fn=getcodes&Type=2|3&width=" + resulution[0] +"&height=" + resulution[1];
			baseApi.httpsGetTimeout(path,1000000000,function(err, res, body){
				baseApi.writeFileSync(path_to_save_to +'.xml',body);
				if(callback)
					callback();
				if(idx == ad_sizes.length-1) {
					defered.resolve();
				}
			});
			//create_file_ajax_request("https://network.adsmarket.com/site/API2?userid=215541&key=c99a05a58833a5585f07ca45745dde73&fn=getcodes&Type=2|3&width=" + resulution[0] +"&height=" + resulution[1],path_to_save_to,callback);
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
		delayedLoop(progarms_contray,function(idx,curr_contry,callback){
			var path_to_save_to = "./matomy_data/programs/1/"+progarms_contray[idx];
			//create_file_ajax_request("https://network.adsmarket.com/site/API2?userid=215541&key=c99a05a58833a5585f07ca45745dde73&fn=findprograms&countries=" + curr_contry ,path_to_save_to,callback);
			var path = "https://network.adsmarket.com/site/API2?userid=215541&key=c99a05a58833a5585f07ca45745dde73&fn=findprograms&countries=" + curr_contry;
			baseApi.httpsGetTimeout(path,1000000000,function(err, res, body){
				baseApi.writeFileSync(path_to_save_to +'.xml',body);
				if(callback)
					callback();
				if(idx == progarms_contray.length-1) {
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


// var create_file_ajax_request = function (path,path_to_save_to,callback)
// {
// 	console.log(path);
// 	try{
// 		xmlhttp.onreadystatechange=function()
// 		{
// 			if (xmlhttp.readyState==4 && xmlhttp.status==200)
// 			{
// 				xml_data = xmlhttp.responseText;
// 				baseApi.writeFileSync(path_to_save_to +'.xml',xml_data);
// 				console.log('finished!');
// 				if(callback)
// 					callback();
// 			}
// 		}
// 		xmlhttp.open("GET",path,true);
// 		xmlhttp.send();
// 	}
// 	catch(err){
// 		console.log(err);
// 	}
// }
