var fork = require('child_process').fork,
	utl = require('./utl');

var prcsMngr = {
	alivePrcs:{},
	fork : function(path){
		var fileName = path.replace(/^.*[\\\/]/, '').replace('.js','');
		prcsMngr.alivePrcs[fileName] = fork(path);
	},
	kill : function(moduleToKill){
		prcsMngr.alivePrcs[moduleToKill].kill();
	},
	killAll : function(){
		utl.log("[prcsmngr.js][killAll] - Kill All Forked Processes");
		for (var process in prcsMngr.alivePrcs) {
			utl.log(process + " Killed");
			prcsMngr.kill(process);
		}
	}
}

module.exports = prcsMngr;