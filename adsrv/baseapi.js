
var fs = require("fs"),
	_ = require("underscore"),
	utils = require('util'),
	request = require('request'),
	http = require('http'),
	https = require('https'),
    xml2json = require("xml2json"),
	extend = require('node.extend'),
	querystring = require('querystring');


var baseApi = {

	readFile: function (path, encoding, callback) {

		try {

			var fn = function (err, data) {
				if (err) {
					console.log(err);
					callback.call(null, "");
				}
				else {
					callback(null, data.replace(/^\uFEFF/, '')); // get rid of BOM markers.
				}
			};

			if (!encoding) {
				encoding = "utf8";
			}
			else if (_.isFunction(encoding)) {
				callback = encoding;
				encoding = "utf8";
			}

			return fs.readFile(path, encoding, fn);
		}
		catch (e) {}
	},

	writeFileSync : function (path, data){
		fs.writeFileSync(path, data);
	},

	writeFile: function (path, data, callback) {

		alert("writeFile - don't use this !!");

		return; 

		fs.writeFile(path, data, function (err) {
			callback(err);
		});
	},

	createFile : function (path, callback){
		fs.open(path, "wx", function (err, fd) {
			if (err) {
				console.log("error while creating file [" + err + "]");
				callback(null);
			}
			else {
				fs.close(fd, function (err) {
					if (err) {
						console.log("error while creating file [" + path + "]");
						callback(null);
					}
					else {
						callback(1);
					}
				});
			}
		});
	},

	renameFile :function (oldPath, newPath, callback){
		fs.rename(oldPath, newPath, function (err) {
			callback(err);
		})
	},

	renameFileSync :function (oldPath, newPath){
		fs.renameSync(oldPath, newPath);
	},

    httpGet: function (url, callback) {
        try {
            return request(url, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    return callback(null, response,body);
                }
                else {
                   return callback(error || "problem fetching data", response, body);
                }
            });
        }
    	catch (e) {
    		callback(1, null, e);
    	}
    },

    httpGetTimeout: function (url, callback) {
    	try {
    		var request = http.get(url, function (res) {

    			var body = "";
    			res.on('data', function (data) {

    				body += data;

    			}).on('end', function () {

    				console.log("httpGetTimeout::end");
    				return callback(null, res, body);

    			}).on('error', function (err) {

    				console.log("httpGetTimeout::err [" + err.message + "]");
    				return callback(err, res, body);
    			});
				
    		});

    		request.setTimeout(3000, function () {
				request.abort();
				console.log("httpGetTimeout -- timeout");
    			return callback(1, "httpGet2 timeout", null);
    		});

    	}
    	catch (e) {
    		callback(1, null, e);
    	}
    },
    httpsGetTimeout: function (url,timeout, callback) {
    	try {
    		var request = https.get(url, function (res) {
    			var body = "";
    			res.on('data', function (data) {
    				body += data;
    			}).on('end', function () {
    				console.log("httpsGetTimeout::end");
    				return callback(null, res, body);
    			}).on('error', function (err) {
    				console.log("httpsGetTimeout::err [" + err.message + "]");
    				return callback(err, res, body);
    			});
    		});
    		request.setTimeout(timeout || 3000, function () {
				request.abort();
				console.log("httpsGetTimeout -- timeout");
    			return callback(1, "httpsGet2 timeout", null);
    		});
    	}
    	catch (e) {
    		callback(1, null, e);
    	}
    },

    xmlToJSON: function (xmlString) {
        try {
            return JSON.parse(xml2json.toJson(xmlString));
        }
        catch (e) { }
    },

    extend: function (isDeep) {
        try {
            return extend.apply(null,[].slice.call(arguments));
        }
        catch (e) { }
    },

    format: function (str) {
        return utils.format.apply(utils, [].slice.call(arguments,[]));
    },

    param: function (object) {

        return querystring.stringify(object);

    }

};


module.exports = baseApi;

/*

var timeout_wrapper = function (req) {
	return function () {
		// do some logging, cleaning, etc. depending on req
		req.abort();
	};
};

var request = http.get(options, function (res) {
	res.on('data', function (data) {
		file.write(data);
		// reset timeout
		clearTimeout(timeout);
		timeout = setTimeout(fn, 10000);
	}).on('end', function () {
		// clear timeout
		clearTimeout(timeout);
		file.end();
		console.log(file_name + ' downloaded ');
		cb(null, file.path);
	}).on('error', function (err) {
		// clear timeout
		clearTimeout(timeout);
		console.log("Got error: " + err.message);
		cb(err, null);
	});
});

// generate timeout handler
var fn = timeout_wrapper(request);

// set initial timeout
var timeout = setTimeout(fn, 10000);

*/