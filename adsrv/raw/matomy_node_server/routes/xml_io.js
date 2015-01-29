var xml2js = require('xml2js');
var fs = require('fs');
var ajax = require('../routes/ajax_req.js');

exports.read_file = function(path,callback){
	try{
		var file_content;
		var parser = new xml2js.Parser();
		fs.readFile(path, function(err, data) {
		    if(typeof data !== 'undefined'){
			    parser.parseString(data, function (err, result) {
			    	callback(result);
				});
		    }
		    else{
		    	return callback(undefined);
		    }
		});
	}
	catch(err){
		console.log(path + "file not found!");
	}
}

exports.write_file = function(data,path){
	try{
		fs.writeFile(path, data, function(err) {
			if(err) {
				console.log(err);
			} else {
				console.log("The file " + path + " saved!");
			}
		});
	}
	catch(err){}
}
