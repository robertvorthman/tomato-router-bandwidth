var tomatoBandwidth = require('tomato-router-bandwidth');

var options = {
	username: 'admin', //required
	password: 'password', //required
	_http_id: 'YOUR_http_id', //required, login to your Tomato router, view page source, and search for "_http_id".
	host: '192.168.1.1', //default value
	networkInterface: 'vlan2', //default value
	callback: (result) =>{
		if(result.error){
			console.log('Error: ', result.error);
		}else{
			console.dir(result);
		}
	}
};

tomatoBandwidth(options);

