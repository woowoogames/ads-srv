﻿
var fs = require("fs"),
	_ = require("underscore"),
	utils = require('util'),
	request = require('request'),
	http = require('http'),
	https = require('https'),
	utl = require('./utl'),
    xml2json = require("xml2json"),
	extend = require('node.extend'),
	querystring = require('querystring'),
    CronJob = require('cron').CronJob,
    exec = require('exec'),
	fork = require('child_process').fork;

var baseApi = {
	cronJobs:{},
	alivePrcs:{},
	cron:function(cronName,path,cronTime,callback){
		var cronJob = new CronJob({
			cronTime: cronTime,
			onTick: function() {
		    	console.log("[baseapi.js][baseApi][cron] - cron " + cronName);
		    	exec(['node',path],
		    		{timeout:1000 * 60 * 60 * 2,killSignal:'SIGINT'},//kill process after 2 hours
		    		function(err, out, code) {
		    			if (err instanceof Error)
		    				throw err;
		    			process.stderr.write(err);
		    			process.stdout.write(out);
		    			callback();
		    		});
		    },
		    start: true
		});
		baseApi.cronJobs[cronName] = cronJob;
	},
	fork : function(path){
		var fileName = path.replace(/^.*[\\\/]/, '').replace('.js','');
		baseApi.alivePrcs[fileName] = fork(path);
	},
	kill : function(moduleToKill){
		baseApi.alivePrcs[moduleToKill].kill();
	},
	killAll : function(){
		utl.log("[prcsmngr.js][killAll] - Kill All Forked Processes");
		for (var process in baseApi.alivePrcs) {
			utl.log(process + " Killed");
			baseApi.kill(process);
			delete baseApi.alivePrcs.process;
		}
	},
	readFile: function (path, encoding, callback) {
		try {
			var fn = function (err, data) {
				if (err) {
					utl.log("[baseapi.js][readFile::err] error while reading file [" + path + "][" + err + "]");
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
				utl.log("[baseapi.js][createFile::err] error while creating file [" + path + "][" + err + "]");
				callback(null);
			}
			else {
				fs.close(fd, function (err) {
					if (err) {
						utl.log("[baseapi.js][createFile::err] error while closing file [" + path + "][" + err + "]");
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
    				// utl.log("[baseapi.js][httpGetTimeout] end");
    				return callback(null, res, body);
    			}).on('error', function (err) {
    				utl.log("[baseapi.js][httpGetTimeout::err] [" + err.message + "]");
    				return callback(err, res, body);
    			});
				
    		});

    		request.setTimeout(3000, function () {
				request.abort();
				utl.log("[baseapi.js][httpGetTimeout] timeout");
    			return callback(1, "httpGet2 timeout", null);
    		});

    	}
    	catch (e) {
    		utl.log("[baseapi.js][httpGetTimeout::err] [" + e + "]");
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

