$(document).ready(function(){
   $("#results").hide();
   $("#testing").hide();
   $(".spinner").hide();
	var feeds;
	var host = 'http://204.145.74.4';
	//var host = 'http://localhost';
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

	$('#submit').click(function(){
		$("#testing").hide();
		$("#results").hide();
		$(".spinner").show();
		$('.remove').remove();
		var url;
		if($('#ip').val()!=""){
			url = host + '/offers/' + $("#feeds option:selected").text() + '?cntry=' +  $("#geo option:selected").text() + '&prdct=coms001&st=' + $("#ctgry option:selected").text() + '&ctgry=' + $('#ctgry').val() + '&n=10&ip=' + $('#ip').val();
		}
		else{
			url = host + '/offers/' + $("#feeds option:selected").text() + '?cntry=' +  $("#geo option:selected").text() + '&prdct=coms001&st=' + $("#ctgry option:selected").text() + '&ctgry=' + $('#ctgry').val() + '&n=10';
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
	            var pic = obj[i].img.small;
	            var url = obj[i].lnk;
	            $("#custom_table").append("<tr class=\".remove\"><td>"+ feed +"</td><td>" + pname + "</td><td><img src=\"" + pic + "\" height=\"100\" width=\"100\"></td><td>" + obj[i].meta.feed + "</td><td>" + obj[i].meta.cntry + "</td><td>" + obj[i].meta.ctgry + "</td><td>" + obj[i].meta.prdct + "</td><td>" + obj[i].uid + "</td></tr>");
	        }
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
				var url = host + '/offers/' + feeds[i].name + '?cntry=' +  geos[j] + '&prdct=coms001&st=' + $("#ctgry option:selected").text() + '&ctgry=' + $('#ctgry').val() + '&n=10';
				allRequests.push(url);
			}
		}
		return allRequests;
	};
});