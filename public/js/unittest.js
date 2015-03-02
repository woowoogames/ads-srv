$(document).ready(function(){
	var feeds;
	var host = 'http://204.145.74.4';
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
		$('.remove').remove();
		var url;
		if($('#ip').val()!=""){
			url = host + '/offers/' + $("#feeds option:selected").text() + '?cntry=' +  $("#geo option:selected").text() + '&prdct=coms001&st=' + $('#st').val() + '&ctgry=' + $('#ctgry').val() + '&n=10&ip=' + $('#ip').val();
		}
		else{
			url = host + '/offers/' + $("#feeds option:selected").text() + '?cntry=' +  $("#geo option:selected").text() + '&prdct=coms001&st=' + $('#st').val() + '&ctgry=' + $('#ctgry').val() + '&n=10';
		}
			$.ajax({
		    url : url,
	        jsonpCallback: 'jsonCallback',
	   	    contentType: "application/json",
	   	    dataType: 'jsonp',
	   	    success: function(obj){
			 	if (typeof obj === "object") {
			 		if(obj.length>0){
			 		var size = obj.length;
				        for (var i = 0; i < size ; i++) {
				            var feed = obj[0].meta.feed;
				            var pname = obj[i].desc.short;
				            var pic = obj[i].img.small;
				            var url = obj[i].lnk;
				            $("#t01").append("<tr class=\"remove\"><td>" + feed + "</td><td>" + pname + "</td><td><img src=\"" + pic + "\" height=\"100\" width=\"100\"></td><td>" + obj[i].meta.feed + "</td><td>" + obj[i].meta.cntry + "</td><td>" + obj[i].meta.ctgry + "</td><td>" + obj[i].meta.prdct + "</td><td>" + obj[i].uid + "</td></tr>");
				        }
			 		}
			    }
	   	    }
	   	});
	});
});