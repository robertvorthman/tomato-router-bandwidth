var tomatoBandwidth = require('tomato-router-bandwidth');

var options = {
	username: 'admin', //required
	password: 'password', //required
	_http_id: 'YOUR_http_id', //required, login to your Tomato router, view page source, and search for "_http_id".
	host: '192.168.1.1',
	callback: (result) =>{
		console.log('Download mbps', result.bandwidth.MbitsDown, ', Upload mbps', result.bandwidth.MbitsUp);
	}
};

tomatoBandwidth(options);