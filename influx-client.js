var influx = require('influx');


var client = influx({
	host : '108.61.119.139',
	port : 8086, // optional, default 8086
	username : 'user',
	password : 'user',
	database : 'db1'
});


function report (seriesName, attrs) {
	console.log(seriesName);
	client.writePoint(seriesName, attrs, function(err) {
    	if(err) {
    		console.log(err);
    	}
    	console.log('ok')
    });
}




module.exports = {
	report: report
};