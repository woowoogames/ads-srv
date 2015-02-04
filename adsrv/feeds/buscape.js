var utils = require('util'),
baseApi = require("../baseapi"),
utl = require("../utl")
frmtr = require("../formatter");
var crty=[];
var categories_switch= {"adult" : "Sex Shop",
"appliances" : "Eletrônicos",
"artnentertainment" : "Arte e Antiguidade",
"automotive" : "Automóveis e Veículos",
"babies" : "Bebês e Cia",
"beauty" : "Jóias e Relógios",
"beverages" : "Alimentos e Bebidas",
"books" : "Livros",
"cameranphoto" : "Fotografia",
"casualgames" : "Games",
"celebsngossip" : "Assinaturas e Revistas",
"cinema" : "Filme Digital",
"clothingnaccessories" : "Moda e Acessórios",
"computersntablets" : "Informática",
"cookingnrecipes" : "Alimentos e Bebidas",
"coupons" : "CDs",
"dating" : "Moda e Acessórios",
"diet" : "Alimentos e Bebidas",
"downloads" : "Games",
"education" : "Volta às Aulas",
"electronics" : "Eletrodomésticos",
"family" : "Dia das Mães",
"finance" : "Indústria, Comércio e Negócios",
"forex" : "Indústria, Comércio e Negócios",
"furnitures" : "Casa e Decoração",
"gambling" : "Tabacaria",
"groceryngourmet" : "Tabacaria",
"hardwarenbuilding" : "Construção e Ferramentas",
"health" : "Alimentos e Bebidas",
"hobbies" : "Casa e Decoração",
"holidays" : "Natal",
"homengarden" : "Construção e Ferramentas",
"homenntertainment" : "Pet Shop",
"jewelrynwatches" : "Jóias e Relógios",
"lifestyle" : "Casa e Decoração",
"mail" : "Informática",
"managementnsuccess" : "Informática",
"mobile" : "Celular e Smartphone",
"music" : "CDs",
"naturenenvironment" : "Turismo",
"news" : "Livros",
"officenquipment" : "Papelaria e Escritório",
"outdoor" : "Turismo",
"partiesflowersgifts" : "Flores, Cestas e Presentes",
"petsnanimals" : "Pet Shop",
"politics" : "trends",
"printersFaxes" : "Informática",
"professionalservices" : "Serviços",
"realestate" : "Imóveis",
"religion" : "Artigos Religiosos",
"science" : "Filme Digital",
"selfImprovement" : "Jóias e Relógios",
"serp" : "Jóias e Relógios",
"shopping" : "Flores, Cestas e Presentes",
"social" : "Livros",
"spiritual" : "Artigos Religiosos",
"sports" : "Esporte e Lazer",
"torrent" : "Informática",
"toysngames" : "Games",
"travel" : "Turismo",
"trends" : "Casa e Decoração",
"tv" : "TV",
"videogames" : "Console de Videogame",
"webmarket" : "Indústria, Comércio e Negócios",
"workfromhome" : "Serviços"};

var buscape = function () {
	this.mClbk = null;
	this.mPrms = null;
	var that = this;

	this.getOffers = function (prms, clbk) {
		utl.log("[buscape.js][getOffers]");
		this.mPrms = prms;
		this.mClbk = clbk;
		try {
			var url = this.getURL("prdct");
			var n = prms.n || 10;
			baseApi.httpGetTimeout(url, function (error, response, body) {
				var data;
				if (!error && body) {
					data = JSON.parse(body);
				}
				if(typeof data !== 'undefined'){
					if(data.totalresultsavailable==0){ //no available products - return default category url by geo
						var geo = that.mPrms.cntry;
						var fix_category = that.mPrms.ctgry.replace(/ /g, '').toLowerCase();
						fix_category = fix_category.replace(/&/g, 'n').toLowerCase();
						var ctgry = categories_switch[fix_category];
						var default_ctgry_obj = get_defualt_category(geo,ctgry);
						utl.log("[buscape.js][getOffers] - return default results");
						that.mClbk(0,[default_ctgry_obj]);
					}
					else{ //results found
						var offers = data.offer;
						if(typeof offers !== "undefined" && offers.length==0){
							utl.log("[buscape.js][getOffers] - return 0 results");
							that.mClbk(1, []);
						}
						else{
							var results = that.format(offers);
							utl.log("[buscape.js][getOffers] - return [" + results.length + "] results");
							that.mClbk(0, results);
						}
					}
				}
				else{
					that.mClbk(1, "[buscape.js][getOffers] - no results");
				}
			});
		}
		catch(err){
			that.mClbk(1,"[buscape.js][getOffers::err] - error getting feed [" + err + "]");
		}
	}

	this.geoMap = {
		br:{
			key: "http://bws.buscape.com/service/findOfferList/61612f32705041654158633d/br/"
		},
		ar:{
			key: "http://bws.buscape.com/service/findOfferList/61612f32705041654158633d/ar/"
		},
		co:{
			key: "http://bws.buscape.com/service/findOfferList/61612f32705041654158633d/co/"
		},
		cl:{
			key: "http://bws.buscape.com/service/findOfferList/61612f32705041654158633d/cl/"
		},
		mx:{
			key: "http://bws.buscape.com/service/findOfferList/61612f32705041654158633d/mx/"
		},
		pe:{
			key: "http://bws.buscape.com/service/findOfferList/61612f32705041654158633d/pe/"
		},
		ve:{
			key: "http://bws.buscape.com/service/findOfferList/61612f32705041654158633d/ve/"
		}
	};

	this.format = function (offers) {
		try{
			var rsltArr = [];
			for(var i=0 ; i<offers.length; i++){
				var obj = frmtr.getOfferObject();
				try{
					obj.typ = "img";
					obj.ofrtype = "feed";
					obj.desc.short = offers[i].offer.offershortname;
					obj.desc.long = offers[i].offer.offername
					obj.img.small = offers[i].offer.thumbnail.url;
					obj.img.big = null;
					obj.meta.feed = "bscpe";
					obj.meta.cntry = that.mPrms.cntry;
					obj.meta.ctgry = that.mPrms.ctgry;
					obj.meta.prdct = that.mPrms.prdct;
					obj.meta.sz = null;
					obj.lnk = offers[i].offer.links[0].link.url;
					obj.prc = offers[i].offer.price.value;
					obj.store.name = offers[i].offer.seller.sellername;
					obj.store.logo = offers[i].offer.seller.thumbnail.url;
					obj.store.rtng = offers[i].offer.seller.rating.useraveragerating.rating;
					rsltArr.push(obj);
				}
				catch(e){
					utl.log("[buscape.js][format::err] -- [" + e + "]");
				}
			}
			return rsltArr;			
		}
		catch(err){
			utl.log("[buscape.js][format::err] -- [" + e + "]");
		}
	}

	this.getURL = function (typ) {
		var map = that.geoMap[that.mPrms.cntry] || that.geoMap["br"];
		var url = map.key;
		if(typ == "prdct"){
			url += "?keyword=" + that.mPrms.st;
			url += "&mdasc=" + that.mPrms.prdct;
			url += "&results=" + that.mPrms.n;
		}
		url += "&format=json";
		return url;
	}
};

var init = function(){
	try{
		var getctrg = "http://sandbox.buscape.com/service/findCategoryList/564771466d477a4458664d3d/?categoryId=0&format=json";
		baseApi.httpGetTimeout(getctrg, function (error, response, body) {
			var data;
			if (!error && body) {
				data = JSON.parse(body);
				set_categories(data.subcategory,"subcategory");
				set_categories(data.top5category,"top5category");
			}
			utl.log("[buscape.js][init] - buscape default categoreis - Loaded")
		},1000000);
	}
	catch(err){
		utl.log("[buscape.js][init] - buscape default categoreis -  Erorr Loading!")
	}
}

function get_defualt_category(geo,category){
	try{
		var answer = {};
		for(var i=0 ; i < crty.length ; i++){
			if(crty[i].catecory_name==category){
				var obj = frmtr.getOfferObject();
				obj.typ = "img";
				obj.ofrtype = "feed";
				obj.desc.short = "default url from buscape for category";
				obj.desc.long = "default url from buscape for category";
				obj.img.small = crty[i].category_img;
				obj.img.big = crty[i].category_img;
				obj.meta.feed = "default_bscpe";
				obj.meta.cntry = geo;
				obj.meta.ctgry = category;
				obj.meta.prdct = null;
				obj.meta.sz = null;
				obj.lnk = crty[i].cat_start_url + geo + crty[i].cat_end_end;
				obj.prc = null;
				obj.store.name = null;
				obj.store.logo = null;
				obj.store.rtng = null;
				return obj;
			}
		}
		return null;
	}
	catch(err){
		console.log(err);
	}
}

function set_categories(tags,type){
	var size = tags.length;
	for(var i=0; i<size ; i++){
		var catecory_name = tags[i][type].name;
		var category_def_url = tags[i][type].links[0].link.url;
		var cat_start_url = category_def_url.substring(0,23);
		var cat_end_end = category_def_url.substring(25);
		var category_img = tags[i][type].thumbnail.url
		var add = {
			catecory_name:catecory_name,
			cat_start_url:cat_start_url,
			cat_end_end:cat_end_end,
			category_img:category_img
		};
		crty.push(add);
	}
}
//init();
module.exports = buscape;