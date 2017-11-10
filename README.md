# tomato-router-bandwidth

Retrieves the real-time bandwidth flowing through a router running Tomato firmware.

## Install

npm install tomato-router-bandwidth

## Example

### Get results like this:

```
Download mbps 0.28 , Upload mbps 176.54
```

### By running this code:

```javascript
var tomatoBandwidth = require('tomato-router-bandwidth');

var options = {
	username: 'admin',
	password: 'password',
	_http_id: 'YOUR_http_id', //Login to your Tomato router, view page source, and search for "_http_id".
	host: '192.168.1.1',
	callback: (result) =>{
		console.log('Download speed', result.bandwidth.MbitsDown, 'Upload speed', result.bandwidth.MbitsUp);
	}
};

tomatoBandwidth(options);
```

## How does this work?

Routers running the open source Tomato firmware return bandwidth statistics from this URL:
http://admin:password@192.168.1.1/update.cgi?exec=netdev&_http_id=YOUR_http_id

## Finding your _http_id

Login to your router's web interface (probably http://192.168.1.1) then view the page source, and search for "_http_id".