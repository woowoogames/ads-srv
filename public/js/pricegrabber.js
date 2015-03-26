$(document).ready(function(){
	$("#bt_submit").click(function(){
		$("#spinner").show();
		//var host = "http://localhost"
		var host = "http://204.145.74.4"
		var st  = $("#st").val();
		$.ajax({
			url : host + '/priceGrabberTestPage?search_kw=' + st,
			contentType: "application/json",
			dataType: 'json',
			success: function(data){
				$("#spinner").hide();
				if(data.document.num_results >0){
					if($('#remove').length)
						$('#remove').remove();
					var index = findIndex(data.document.product);
					var htm = "<div id='remove' style='text-decoration:none;position: fixed;bottom: -50px;left: 0px;width:300px;height:300px;cursor:pointer;background:url(\"http://localhost/images/t2.png\");background-repeat:no-repeat;' onclick='ui.bnrclk();'>" +
					"<a href='" + data.document.product[index].direct_offer.url + "' target=\"_blank\"><div style='width:152px;height:300px;float:left;'>" +
					"<div style='width:150px;height:248px;float:left;cursor:pointer;'>" +
					"<div id='txt1' style='padding-top:20px;padding-left:5px;color:#E8335D;font-family:arial,sans-serif;font-size:14px;height:14px;overflow:hidden;width:145px;text-align:center'>"+ data.document.product[index].catzero.$t +"</div>" +
					"<div id='txt2' style='padding-left:5px;color:#E8335D;font-family:arial,sans-serif;font-size:24px;height:25px;overflow:hidden;width:145px;text-align:center'>" + data.document.product[index].direct_offer.price + "</div>" +
					"<div style='width:128px;height:195px;float:left;padding-left:10px;'>" +
					"<img id='img1' src='" + data.document.product[index].image_large + "' style='width:130px;height:162px;margin-top:15px;cursor:pointer;' />" +
					"</div>" +
					"</div>" +
					"</div>" +
					"<div style='width:125px;height:300px;float:left;cursor:pointer;'>" +
					"<div style='width:168px;height:248px;float:left;'>" +
					"<div id='txt3' style='padding-left:12px;padding-top:10px;color:#f9f9f9;font-family:arial,sans-serif;font-size:17px;height:168px;overflow:hidden;width:128px;'>" + data.document.product[index].title_short + "</div>" +
					"</div>" +
					"</div></a>" +
					"</div>";
					$("body").append(htm);
				}
				else{
					alert("No Results");
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(textStatus, errorThrown);
			}
		});
	
	function findIndex(data){
		for(var i=0 ; i<data.length ;i++){
			if(typeof data[i].direct_offer !='undefined')
				return i;
		}
	}
	});
});