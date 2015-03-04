$(document).ready(function(){
	$("#results").hide();
	$("#testing").hide();
	$(".spinner").hide();
	var data = {
		"columns": [
		{
			"field": "feed",
			"title": "Feed",
			"sortable":true
		},
		{
			"field": "name",
			"title": "Name",
			"sortable":true
		},
		{
			"field": "desc",
			"title": "Desc",
			"sortable":true
		},
		{
			"field": "picture",
			"title": "Picture",
			"sortable":true
		},
		{
			"field": "metaFeed",
			"title": "Meta - Feed",
			"sortable":true
		},
		{
			"field": "metaCntry",
			"title": "Meta - Cntry",
			"sortable":true
		},
		{
			"field": "metaCtgry",
			"title": "Meta - Ctgry",
			"sortable":true
		},
		{
			"field": "metaPrdct",
			"title": "Meta - Prdct",
			"sortable":true
		},
		{
			"field": "uId",
			"title": "UId",
			"sortable":true
		}
		],
		"data": []
	};

	var feeds;
	//var host = 'http://204.145.74.4';
	var host = 'http://localhost';
	$.ajax({
		url : host + '/data/feeds.js',
		contentType: "application/json",
		dataType: 'json',
		success: function(obj){
			feeds = obj;
			for(var i=0 ; i<feeds.length ; i++){
				$("#feeds").append("<option value=\"" + feeds[i].name + "\">" + feeds[i].name + "</option>");			
			}
			changedList();
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log(textStatus, errorThrown);
		}
	});

	$("#feeds").change(function(){
		$("#geo").empty();
		changedList();
	});

	function changedList(){
		var feedObj = getFeedByName($("#feeds option:selected").text());
		var geos = feedObj.coverage.cntry.values;
		for(var i=0 ; i<geos.length ; i++){
			$("#geo").append("<option value=\"" + geos[i] + "\">" + geos[i] + "</option>")
		}
	}

	function getFeedByName(name){
		for(var i=0 ; i<feeds.length ; i++){
			if(feeds[i].name == name)
				return feeds[i];
		}
		return null;
	}


	$('#clear').click(function(){
		$("#testing").hide();
		$("#results").hide();
		$(".spinner").hide();
		$("#custom_table").bootstrapTable('destroy');
		data.data = [];
	});

	$('#submit').click(function(){
		$("#testing").hide();
		$("#results").hide();
		$(".spinner").show();
		var url;
		if($('#ip').val()!=""){
			url = host + '/offers/' + $("#feeds option:selected").text() + '?cntry=' +  $("#geo option:selected").text() + '&prdct=coms001&st=' + $("#st option:selected").text() + '&ctgry=' + $('#ctgry').val() + '&n=10&ip=' + $('#ip').val();
		}
		else{
			url = host + '/offers/' + $("#feeds option:selected").text() + '?cntry=' +  $("#geo option:selected").text() + '&prdct=coms001&st=' + $("#st option:selected").text() + '&ctgry=' + $('#ctgry').val() + '&n=10';
		}
		$.ajax({
			url : url,
			jsonpCallback: 'jsonCallback',
			contentType: "application/json",
			dataType: 'jsonp',
			success: function(obj){
				$(".spinner").hide();
				if (typeof obj === "object") {
					if(obj.length>0){
						draw(obj);
					}
					else{
						$("#results").show();
					}
				}
			}
		});
	});

	var draw = function(obj){
		var size = obj.length;
		for (var i = 0; i < size ; i++) {
			var feed = obj[0].meta.feed;
			var pname = obj[i].desc.short;
			var pic;
			if(typeof obj[i].img.small === 'undefined')
				pic = obj[i].img.small;
			else
				pic = obj[i].img.big;
			var url = obj[i].lnk;
	            var add = {
	            	"feed" : feed,
	            	"desc" : obj[i].desc.short,
	            	"name" : pname,
	            	"picture" : "<img src=\"" + pic + "\" height=\"100\" width=\"100\">",
	            	"metaFeed" : obj[i].meta.feed,
	            	"metaCntry" : obj[i].meta.cntry,
	            	"metaCtgry" : obj[i].meta.ctgry,
	            	"metaPrdct" : obj[i].meta.prdct,
	            	"uId" : obj[i].uid
	            }
	            data.data.push(add);
	        }
	        $("#custom_table").bootstrapTable('destroy');
	        $("#custom_table").bootstrapTable(data);
	    };

	    $("#auto").click(function(){
	    	$("#testing").show();
	    	$(".spinner").show();
	    	var index = 0;
	    	var allRequests = createAutoRequests();
	    	var stop = setInterval(function(){
	    		console.log(index);
	    		index++;
	    		if(index==allRequests.length-1){
	    			clearInterval(stop);
	    			$("#testing").text("Test Finished");
	    			$(".spinner").hide();
	    		}
	    		$.ajax({
	    			url : allRequests[index],
	    			jsonpCallback: 'jsonCallback',
	    			contentType: "application/json",
	    			dataType: 'jsonp',
	    			success: function(obj){
	    				if (typeof obj === "object") {
	    					if(obj.length>0){
	    						draw(obj);
	    					}
	    					else{
	    						$("#custom_table").append("<tr class=\".remove\"><td>NO RESULTS</td><td><a href=\" + allRequests[index] + \" target=\"_blank\">" + allRequests[index] + "</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>");
	    					}
	    				}
	    			}
	    		});
	    	},3500);
	    });

	    var createAutoRequests = function(){
	    	var allRequests=[];
	    	for(var i=0 ; i<feeds.length ; i++){
	    		var geos = feeds[i].coverage.cntry.values;
	    		for(var j =0 ; j <geos.length ; j++){
	    			var url;
	    			if(feeds[i].name == "adworldmedia"){
	    				url = host + '/offers/' + feeds[i].name + '?cntry=' +  geos[j] + '&prdct=coms001&st=sex&ctgry=adult&n=10&ip=56.66.66.66&host=sex.com';					
	    			}
	    			else if(feeds[i].name == "admarketplace"){
	    				url = host + '/offers/' + feeds[i].name + '?cntry=' +  geos[j] + '&prdct=coms001&st=' + $("#st option:selected").text() + '&ctgry=' + $('#ctgry').val() + '&n=10&ip=56.66.66.66';	
	    			}
	    			else if(feeds[i].name == "buzzcity"){
	    				url = host + '/offers/' + feeds[i].name + '?cntry=' +  geos[j] + '&prdct=coms001&st=&ctgry=dating&n=10&ip=58.8.0.0';	
	    			}
	    			else{
	    				url = host + '/offers/' + feeds[i].name + '?cntry=' +  geos[j] + '&prdct=coms001&st=' + $("#st option:selected").text() + '&ctgry=' + $('#ctgry').val() + '&n=10';	
	    			}
	    			allRequests.push(url);
	    		}
	    	}
	    	allRequests.push("http://localhost/offers/serp/?cntry=us&prdct=coms001&st="+$("#st option:selected").text()+"&ctgry=xbox&n=10&ip=56.66.66.66");
	    	return allRequests;
	    };
	});