$(document).ready(function(){
	var feeds;
	var countries = {};
	var host = 'http://204.145.74.4';
	//var host = 'http://localhost:5000';
	//	feeds select
	var localRender = function(){
		$("#feeds").empty();
		for(var i=0 ; i<feeds.length ; i++){
			$("#feeds").append("<option value=\"" + feeds[i].name + "\">" + feeds[i].name + "</option>");	
		}
		loadButtons(feeds[0]);
	};
	$("#feeds").change(function(){
		var feed = feeds[this.selectedIndex];
		loadButtons(feed);
	});
	//	feeds select


	//switches
	var loadButtons = function(feed){
		var isActiveValue = $("[name='isActive']").bootstrapSwitch('state');
		var isSerpValue = $("[name='isSerp']").bootstrapSwitch('state');
		var st = $("[name='searchTerm']").bootstrapSwitch('state');
		if(feed.active != isActiveValue){
			$("[name='isActive']").bootstrapSwitch('toggleState');
		}
		if(feed.isSerp != isSerpValue){
			$("[name='isSerp']").bootstrapSwitch('toggleState');
		}
		if(feed.requireSearchTerm !=st){
			$("[name='st']").bootstrapSwitch('toggleState');
		}
		loadContriesSelect2(feed.coverage.cntry.values);
	};
	//switches


	//select2 
	var loadContriesSelect2 = function(geos){
		select2ResetValues();
		$("#geos").select2("val", geos);
	};
	var select2ResetValues = function(){
		$("#geos").select2('val', 'All');
	};
	//select2 


	//submit button click
	$("#submit").click(function(){
		bootbox.confirm("Are you sure?", function(result) {
			var index = $("#feeds").prop("selectedIndex");
			var feedToUpdate = feeds[index];
			var geos = $("#geos").select2('val');
			if(geos){
				var indexGb = geos.indexOf('gb');
				if(indexGb!=-1){
					geos[indexGb] = 'uk';
				}
			}
			else{
				geos = ["all"];
			}
			var isActive = $("[name='isActive']").bootstrapSwitch('state');
			var isSerp = $("[name='isSerp']").bootstrapSwitch('state');
			var st = $("[name='searchTerm']").bootstrapSwitch('state');
			if(result){
				//local feeds update
				feeds[index].st = st;
				feeds[index].isActive = isActive;
				feeds[index].isSerp = isSerp;
				feeds[index].coverage.cntry.values = geos;
				$("#spinner").show();
				$("#successs").show();
				setTimeout(function(){
					$("#successs").hide();}
					,5000);
				var dataPost = {
					"name": feedToUpdate.name,
					"type" : feedToUpdate.type,
					"requireSearchTerm": st,
					"active": isActive,
					"isSerp": isSerp,
					"handler": feedToUpdate.handler,
					"coverage": {
						"cntry": {
							"type": "white",
							"values" : geos
						},
						"prdct": {
							"type": "white",
							"values": ["all"]
						}
					}
				};
				$.ajax({
					url: host + "/updateFeed",
					contentType: "application/json; charset=utf-8",	
					type:"POST",
					data: JSON.stringify(dataPost),
					success : function(test){
						$("#spinner").hide();
						localRender();
					},
					error: function(a,b,c){
						alert(a);
						alert(b);
						alert(c);
					}
				});
			}			
		});
});

//init feeds select - get feed.js from node server 
var loadFeeds = function(){
	$("#feeds").empty();
	$.ajax({
		url : host + '/data/feeds.js',
		contentType: "application/json",
		dataType: 'json',
		success: function(obj){
			feeds = obj;
			gbUkFix(feeds);
			for(var i=0 ; i<feeds.length ; i++){
				$("#feeds").append("<option value=\"" + feeds[i].name + "\">" + feeds[i].name + "</option>");			
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log(textStatus, errorThrown);
		}
	}).done(function(){
		loadButtons(feeds[0]);
	});
};

//init select2 -geos - get feed.js from node server 
var select2Geos = function(){
	$.ajax({
		url:"http://publishers.saferev.com/tools.asmx/GetCountries?token=B1ng007",
		dataType: 'jsonp',
		success : function(geos){
			for(var geoIndex in geos.Rows){
				$("#geos").append("<option value=" + geos.Rows[geoIndex].value.toLowerCase() + ">" +geos.Rows[geoIndex].label +"</option>");
			}
			createGeoObject(geos);
		},
		error: function(a,b,c){
			alert(a);
			alert(b);
			alert(c);
		}	
	}).done(function(){
		loadButtons(feeds[0]);
	});
};

var createGeoObject = function(geos){
	for(var geoIndex in geos.Rows){
		countries[geos.Rows[geoIndex].value.toLowerCase()] = geos.Rows[geoIndex].label;
	}
};

var initPageView = function(){
	$("#geos").select2({
		removeOnSelect : true 
	});
	$("#spinner").hide();
	$("#successs").hide();
	$("[name='isActive']").bootstrapSwitch();
	$("[name='isSerp']").bootstrapSwitch();
	$("[name='searchTerm']").bootstrapSwitch();
};

var gbUkFix = function(feeds){
	for(var feedIndex in feeds){
		var changeAtIndex = feeds[feedIndex].coverage.cntry.values.indexOf("uk");
		if(changeAtIndex!=-1){
			feeds[feedIndex].coverage.cntry.values[changeAtIndex] = "gb";
		}
	}
};

var init = function(){
	initPageView();
	select2Geos();
	loadFeeds();
};
init();
});


