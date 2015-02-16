$(document).ready(function(){
	var stop = setInterval(function(){
		var str_request = "http://204.145.74.4/offers?";
	    //var str_request = "http://localhost/offers/160/?";
		var params = "";
		var isValid = true;
		var rnd;
		$.each(unit_values,function(key,value){
			rnd = Math.floor(Math.random()*value.length);
			if(key !== "n"){
				params += key + "=" + value[rnd].param +"&";
				isValid = isValid & value[rnd].valid;
			}
			else{
				params += key + "=" + value[rnd].param;
				isValid = isValid & value[rnd].valid;
			}
		});
		if(isValid==1)
			console.log(str_request + params + "	valid");
		else{
			console.log(str_request + params);
		}
		isValid = true;

		//Create ajax request to node server with the random parameters
		$.ajax({
			    url : str_request + params,
	            jsonpCallback: 'jsonCallback',
		   	    contentType: "application/json",
		   	    dataType: 'jsonp',
			    success: function(obj){
			    	console.log("done" + obj.length);
			    	console.log(str_request + params);
				 	if (typeof obj === "object") {
				 		if(obj.length>0){
				 		var size = obj.length;
					        for (var i = 0; i < size ; i++) {
					            var feed = obj[0].meta.feed;
					            var pname = obj[i].desc.short;
					            var pic = obj[i].img.small;
					            var url = obj[i].lnk;
					            $("#t01").append("<tr class=\"remove\"><td>" + feed + "</td><td>" + pname + "</td><td><img src=\"" + pic + "\" height=\"100\" width=\"100\"></td><td><a href=\"" + str_request + params + "\" target=\"_blank\">" + str_request + params + "</a></td></tr>");
					        }
				 		}
				 		else{
				 			$("#t01").append("<tr class=\"remove\"><td> No Results </td><td> No Results </td><td> No Results </td><td><a href=\"" + str_request + params + "\" target=\"_blank\">"+ str_request + params+" </a></td></tr>");
				 		}
				    }
				    else{
				    	$("#t01").append("<tr class=\"remove\"><td> NAN </td><td> NAN </td><td> NAN </td><td> NAN </td></tr>");
				    }
			    },
			    error: function(jqXHR, textStatus, errorThrown) {
				    console.log(textStatus, errorThrown);
				}
			});
	},700);

	var cntry =[{param:"us",valid:true},
			   	{param:'us',valid:true},
			   	{param:'pl',valid:true},
			   	{param:'es',valid:true},
			   	{param:'uk',valid:true},
			   	{param:'de',valid:true},
			   	{param:'\'',valid:false},
			   	{param:'"',valid:false},
			   	{param:'undefined',valid:false},
			   	{param:'%44%45',valid:false}];

	var prdct =[{param:'coms001',valid:true},
				{param:'coms002',valid:true},
				{param:'coms003',valid:true},
				{param:'coms004',valid:true},
				{param:'coms006',valid:true},
				{param:'coms\'001',valid:false},
				{param:'coms00\'4',valid:false},
				{param:'%25',valid:false},
				{param:'\'',valid:false},
				{param:'\'com',valid:false},
				{param:'\';console.log("err");',valid:false}];

	var st=[{param:'xbox',valid:true},
			{param:'iphone',valid:true},
			{param:'iphone 6',valid:true},
			{param:'smart tv',valid:true},
			{param:'psp',valid:true},
			{param:'i\'pod',valid:false},
			{param:'@x\'bo542x',valid:false},
			{param:'#$%^',valid:false},
			{param:'Θεωρί',valid:false},
			{param:'dʒɪb ər ɪʃ, ˈgɪb-',valid:false}];

	var ctgry= [{param:'mobile',valid:true},
				{param:'dating',valid:true},
				{param:'diet',valid:true},
				{param:'education',valid:true},
				{param:'electronics',valid:true},
				{param:'sh, ˈg',valid:false},
				{param:'finance',valid:false},
				{param:'xbÃÃ¢â‚mobile',valid:false},
				{param:'electr',valid:false},
				{param:'celebsngossip',valid:false}];

	var subid = []

	var n =[{param:'1',valid:true},
			{param:'10',valid:true},
			{param:'20',valid:true},
			{param:'300',valid:true},
			{param:'10000',valid:true},
			{param:'-2',valid:false},
			{param:Infinity,valid:false},
			{param:'10.7',valid:false},
			{param:-Infinity,valid:false},
			{param:'abc',valid:false}];

	var unit_values = {
		cntry:cntry,
		prdct:prdct,
		st:st,
		ctgry:ctgry,
		n:n
	};		

});


//"http://localhost:3000/offers?cntry=us&prdct=coms001&st=xbox&ctgry=mobile&subid=&n=10";



