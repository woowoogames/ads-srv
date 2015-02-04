

var feedsMngr = require('./feedsmngr'),
	baseApi = require("./baseapi"),
	path = require("path"),
	ddlsMngr = require('./ddls/ddlmngr'),
	utl = require("./utl"),
	lgcMngr = require('./lgcmngr'),
	prcsMngr = require('./prcsmngr');

// load the system resources
var rsrcMngr = {


	init: function (clbk) {
		/*
		setInterval(function () {
			rsrcMngr.loadFeeds("http://cdn.montiera.com/coms/adsrv/feeds.js", "/ddls/data.js", function () {
				feedsMngr.loadFeeds(function (status) {
					console.log("rsrcMngr::feedsMngr.loadFeeds - status=[" + status + "]");
				});
			});
		// }, 1000 * 20); // debug
		}, 1000 * 60 * 60 * 24); // 24 hours

		setInterval(function () {
			rsrcMngr.loadFeeds("http://cdn.montiera.com/coms/adsrv/ranks.js", "/data/ranks.js", function () {
				lgcMngr.loadRanks(function (status) {
					console.log("rsrcMngr::lgcMngr.loadRanks - status=[" + status + "]");
				});
			});
		}, 1000 * 60 * 60); // 1 hour
		*/
		// setInterval(function () {
		// 	prcsMngr.fork('./adsrv/raw/matomy_node_server/matomy.js');
		// }, 1000 * 10 * 10); // temp - 10 min 
		setInterval(function () {
			rsrcMngr.loadFeeds("http://cdn-int.montiera.com/data/coms/lgc.js", "/ddls/data.js", function () {
				ddlsMngr.loadDdls(function (status) {
					utl.log("[rsrcMngr.js][init::loadTrnds][loadFeeds] - status = [" + status + "]");
				});
			});
		// }, 1000 * 5); // debug
		}, 1000 * 60 * 15); // temp - 15 min 

		clbk(1);
	},

	loadFeeds: function (url, file, loader) {

		// request(url + "&rnd=" + rsrcMngr.rnd()).pipe(fs.createWriteStream(path.join(path.dirname(__filename), path)));

		baseApi.httpGet(url + "?rnd=" + rsrcMngr.rnd(), function (error, response, data) {

			if (error || !data) {
				console.log("rsrcMngr::loadFeeds - error downloading file [" + url + "]");
				return;
			}

			var newFeed = data;
			baseApi.readFile(path.join(path.dirname(__filename), file), function (err, cntnt) {

				var crntFeed = cntnt;
				if (newFeed != crntFeed) {
					baseApi.writeFileSync(path.join(path.dirname(__filename), file), newFeed);
					loader();
				}

			});

		});
	},

	rnd: function () {
		return Math.floor(Math.random() * 1000) + 1;
	}
	
};


module.exports = rsrcMngr;

