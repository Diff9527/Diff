/**
 * 公共方法
 */

//获取node运行系统的IPv4地址
var getIPAdress = function(){
	var interfaces = require('os').networkInterfaces();
	for(var devName in interfaces){
		var iface = interfaces[devName];
		for(var i=0;i<iface.length;i++){
			var alias = iface[i];
			if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){
				return alias.address;
			}
		}
	}
};

exports.getIPAdress = getIPAdress;