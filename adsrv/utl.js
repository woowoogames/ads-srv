var utl = {
	log : function(msg){
		//if('development' == app.get('env')){
			console.log(msg);
		//}
	},
	arrayDiff : function(a,b) {
		return a.filter(function(i) {return b.indexOf(i) == -1;});
	}
};
module.exports = utl;