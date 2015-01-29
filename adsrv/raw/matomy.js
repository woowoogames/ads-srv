var data = {};

var utils = require('util'),
baseApi = require("../baseapi"),
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
		try{
			var resolution = resolutions[prms.sz];
			var country = prms.cntry;
			var category = prms.ctgry;
			var n = prms.n;
			category = ctrgyMapper[category];
		    var arr = data[country][category][resolution];
		    if(typeof arr !== 'undefined'){
		    	var results = shuffle(n,arr);
		    	if(results.length>0){
		    		var matomyResults = this.format(results,resolution);
		    		clbk(0,matomyResults);
		    	}
		    	else{
		    		clbk(1,"no match - matomy");
		    	}
		    }
		    else{
		    	clbk(1,"no match - matomy");
		    }
		}
		catch(err){
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
	var fork = require('child_process').fork;
	var matomyChild = fork('./adsrv/raw/matomy_node_server/matomy.js');
	console.log("forked");
	matomyChild.on('message',function(mess){
		data = mess.matomy;
	});
}
init();

module.exports = matomy;