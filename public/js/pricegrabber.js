

$(document).ready(function () {

	String.prototype.trimLeft = function(charlist) {
		if (charlist === undefined)
			charlist = "\s";

		return this.replace(new RegExp("^[-, ]+"), "");
	};

	$("#bt_submit").click(function () {

		$("#spinner").show();
		
		
		var st = $("#st").val();
		var cntry = $("#slctCntry").val();
		var host = "http://localhost:3000/priceGrabberTestPage?v=1&search_kw=" + st + "&cntry=" + cntry;
		// var host = "http://204.145.74.4/priceGrabberTestPage?v=1&search_kw=" + st + "&cntry=" + cntry;

		console.log("------------------");
		console.log(host);

		$.ajax({
			url: host,
			contentType: "application/json",
			dataType: 'json',
			success: function(data){
				$("#spinner").hide();
				if(data.document.num_results >0){
					if($('#remove').length)
						$('#remove').remove();
					var index = 0;
					var htm;

					var price = data.document.product.offer.price;
					price = price.replace("&amp;pound;", "&pound;").replace("CAD$", "$");

					if(typeof data.document.product.offer.retailer_logo === 'undefined'){
						htm = "<div id='remove' style='text-decoration:none;position: fixed;bottom: -50px;left: 0px;width:300px;height:300px;background:url(\"http://204.145.74.4/images/t2.png\");background-repeat:no-repeat;''>" +
						"<div style='width:152px;height:300px;float:left;'>" +
						"<div style='width:150px;height:248px;float:left;'>" +
						"<div style='width:128px;height:195px;float:left;padding-left:10px;'>" +
						"<div style='width: 100px;height: 40px;margin-top:15px;margin-left:;font-size: 22px;color: rgb(253, 62, 96);;margin-left: 14px;/* text-align: center; */'>" + data.document.product.offer.retailer + "</div>" +
						"<img id='img1' src='" + data.document.product.image_large + "' style='width:130px;height:162px;margin-top:15px;' />" +
						"</div>" +
						"</div>" +
						"</div>" +
						"<a href='" + data.document.product.offer.url + "' target=\"_blank\">" +
						"<div style='width:125px;height:300px;float:left;cursor:pointer;'>" +
						"<div style='width:100%;height:100%;float:left;'>" +
						"<div id='txt1' style='padding-top: 8px;/* padding-left:5px; */color: #ffffff;font-family:arial,sans-serif;font-size: 20px;/* height:14px; */overflow:hidden;width:145px;text-align:center'>"+ data.document.product.catzero.$t + " - " + data.document.product.manufacturer +"</div>" +
						"<div id='txt3' style='padding-left:12px;padding-top: 8px;color:#f9f9f9;font-family:arial,sans-serif;font-size:65%;height:168px;overflow:hidden;width:128px;'>" + getFixedText(decodeHTMLEntities(data.document.product.title_short).trimLeft()) +
						"<div id='txt2' style='padding-left:5px;color: #ffffff;font-family:arial,sans-serif;font-size:24px;height:25px;overflow:hidden;width: 168px;margin-top: 9px;margin-left: 16px;text-align: left;'>" + price + "</div></div>" +
						"</div>" +
						"</div></a>" +
						"</div>";
					}
					else{
						htm = "<div id='remove' style='text-decoration:none;position: fixed;bottom: -50px;left: 0px;width:300px;height:300px;background:url(\"http://204.145.74.4/images/t2.png\");background-repeat:no-repeat;' '>" +
						"<div style='width:152px;height:300px;float:left;'>" +
						"<div style='width:150px;height:248px;float:left;'>" +
						"<div style='width:128px;height:195px;float:left;padding-left:10px;'>" +
						"<div style='width: 100px;height: 40px;margin-top:15px;margin-left:;font-size: 22px;color: rgb(253, 62, 96);;margin-left: 14px; text-align: center;'><img id='img1' src='" + data.document.product.offer.retailer_logo + "' style=\"text-align: center;\" '/>" + data.document.product.offer.retailer + "</div>" +
						"<img id='img1' src='" + data.document.product.image_large + "' style='width:130px;height:162px;margin-top:15px;' />" +
						"</div>" +
						"</div>" +
						"</div>" +
						"<a href='" + data.document.product.offer.url + "' target=\"_blank\">" +
						"<div style='width:125px;height:300px;float:left;cursor:pointer;'>" +
						"<div style='width:100%;height:100%;float:left;'>" +
						"<div id='txt1' style='padding-top: 8px;/* padding-left:5px; */color: #ffffff;font-family:arial,sans-serif;font-size: 20px;/* height:14px; */overflow:hidden;width:145px;text-align:center'>"+ data.document.product.catzero.$t + " - " + data.document.product.manufacturer +"</div>" +
						"<div id='txt3' style='padding-left:12px;padding-top: 8px;color:#f9f9f9;font-family:arial,sans-serif;font-size:65%;height:168px;overflow:hidden;width:128px;'>" + getFixedText(decodeHTMLEntities(data.document.product.title_short).trimLeft()) +
						"<div id='txt2' style='padding-left:5px;color: #ffffff;font-family:arial,sans-serif;font-size:24px;height:25px;overflow:hidden;width: 168px;margin-top: 9px;margin-left: 16px;text-align: left;'>" + price + "</div></div>" +
						"</div>" +
						"</div></a>" +
						"</div>";
					}

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
		if(typeof data[i].offer !='undefined')
			return i;
	}
}

function getFixedText(title){
	if(title.indexOf('-')!=-1){
		return title.substring(0,title.indexOf('-'));
	}
	else{
		return title
	}
}

function decodeHTMLEntities(text) {
	var entities = [
	['apos', '\''],
	['amp', '&'],
	['lt', '<'],
	['gt', '>'],
	['#33','!'],
	['#34','"'],
	['#35','#'],
	['#36','$'],
	['#37','%'],
	['#38','&'],
	['#39','\''],
	['#40','('],
		['#41',')'],
['#42','*'],
['#43','+'],
['#44',','],
['#45','-'],
['#46','.'],
['#47','/'],
['#58',':'],
['#59',';'],
['#60','<'],
['#61','='],
['#62','>'],
['#63','?'],
['#64','@'],
['#91','['],
['#92','\\'],
['#93',']'],
['#94','^'],
['#95','_'],
['#96','`'],
['#97','-'],
['#123','{'],
['#124','|'],
['#125','}'],
];

for (var i = 0, max = entities.length; i < max; ++i) 
	text = text.replace(new RegExp('&'+entities[i][0]+';', 'g'), entities[i][1]);

return text;
}


});
});