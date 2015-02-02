// var fork = require('child_process').fork;
// var matomyChild = fork('./adsrv/raw/matomy_node_server/matomy.js');
var data = {};

var utils = require('util'),
baseApi = require("../baseapi"),
utl = require("../utl")
frmtr = require("../formatter");

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

////////////////////////////////////////////////////////
		clbk(0,[]);
		return;
////////////////////////////////////////////////////////

		utl.log("[matomy.js][getOffers]");
		try{
			//console.log(data);
			var resolution = resolutions[prms.sz];
			var country = prms.cntry;
			var category = prms.ctgry;
			var n = prms.n;
			category = ctrgyMapper[category];
		    var arr = data[country][category][resolution];
		    // console.log(country + " " + category + " " + resolution);
		    // console.log("###################################matomy#######################")
		    // console.log(arr);
		    if(typeof arr !== 'undefined'){
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
	}

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

function init(){
	utl.log("[matomy.js][init] - process forked");
	//matomyChild.on('message',function(mess){
	//	data = mess.matomy;
	//	matomyChild.kill();
	//});
}

//matomyChild.on("exit", function() {
//	  console.log("[################ - matomyChild - exit]");
//});

/*
process.on("SIGINT", function() {
	  console.log("[################ - main - SIGINT]");
	  matomyChild.kill();
	  process.exit();
});
*/

// init();

module.exports = matomy;