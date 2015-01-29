var io = require('../routes/xml_io.js');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xmlhttp = new XMLHttpRequest();
var xml_data=null;

var progarms_contray = ["us","fr","pl","es","de","uk","in"];

exports.refresh_banners = function (req,res){	
	try{
		resulutions_execute(function(){
			res.json({status : "refresh finished"});
		});
		res.json({status: "refresh in process..."});
	}
	catch(err){}
}

exports.refresh_programs = function(req,res){
	try{
		program_excecute();
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

var resulutions_execute = function(callback_finish){
	try{
		var ad_sizes = ['300x250'/*,'160x600','728x90'*/];
		delayedLoop(ad_sizes,function(idx,curr_size,callback){
			var resulution = curr_size.split('x');
			var path_to_save_to = './matomy_data/ad/banners/' + ad_sizes[idx];
			create_file_ajax_request("https://network.adsmarket.com/site/API2?userid=215541&key=c99a05a58833a5585f07ca45745dde73&fn=getcodes&Type=2|3&width=" + resulution[0] +"&height=" + resulution[1],path_to_save_to,callback);
		});
		callback_finish();
	}
	catch(err){
		console.log(err);
	}
}

var program_excecute = function(){
	try{
		delayedLoop(progarms_contray,function(idx,curr_contry,callback){
			var path_to_save_to = "./matomy_data/programs/"+progarms_contray[idx];
			create_file_ajax_request("https://network.adsmarket.com/site/API2?userid=215541&key=c99a05a58833a5585f07ca45745dde73&fn=findprograms&countries=" + curr_contry ,path_to_save_to,callback);
		});
	}
	catch(err){
		console.log(err);
	}
}

var create_file_ajax_request = function (path,path_to_save_to,callback)
{
	try{
		xmlhttp.onreadystatechange=function()
		{
			if (xmlhttp.readyState==4 && xmlhttp.status==200)
			{
				xml_data = xmlhttp.responseText;
				io.write_file(xml_data,path_to_save_to +'.xml');
				console.log('finished!');
				if(callback)
					callback();
			}
		}
		xmlhttp.open("GET",path,true);
		xmlhttp.send();
	}
	catch(err){
		console.log(err);
	}
}
