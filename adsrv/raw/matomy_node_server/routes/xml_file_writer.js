var fs = require('fs');

exports.write = function(data,path){
	fs.writeFile(path, data, function(err) {
		if(err) {
			console.log(err);
		} else {
			console.log("The file was saved!");
		}
	});
}

