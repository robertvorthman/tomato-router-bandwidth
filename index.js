const request = require('request');
const parse = require('json-literal-parse');

var readings = [];

//http://admin:password@192.168.1.1/update.cgi?exec=netdev&_http_id=YOUR_http_id
var bandwidthUri;

var options = {
	username: 'admin',
	password: '',
	host: '192.168.1.1',
	_http_id: undefined,
	networkInterface: 'vlan2',
	timeBetweenReadings: 2000,
	callback: ()=>{
		console.log('tomato-bandwith: options.callback not defined');
	}
};

function getBandwidth(config, callback){
	if(typeof config._http_id == 'undefined'){
		config.callback({error:'Missing required option _http_id.  Login to your Tomato router, view page source, and search for "_http_id".'});
	}else{
		Object.assign(options, config);
		bandwidthUri = 'http://' + options.username + ':' + options.password + '@' + options.host + '/update.cgi?exec=netdev&_http_id=' + options._http_id;	
		getTotalBytes();
	}
}



function getTotalBytes(){
	request(bandwidthUri, function(error, httpResponse, body){
		if(error) {
			options.callback({error:'node request failed, error was: '+error+'. Is _http_id option correct?  Login to your Tomato router, view page source, and search for "_http_id".'});
		}else if(httpResponse.statusCode == 401){
			options.callback({error:'Incorrect username or password'});
		}else if(httpResponse.statusCode != 200){
			options.callback({error: 'HTTP code '+httpResponse.statusMessage});
		}else{
			//transform C style object literal into JSON literal
			var jsonString = body
				.replace('netdev=','')
				.replace(';','')
				.replace(/rx/g, '"rx"')
				.replace(/tx/g, '"tx"');
	
			//use json-literal-parse to parse JSON with octal values "0x"
			try {
				var bandwidthStats = parse(jsonString);
			} catch(e){
				options.callback({error:"Unable to parse router's response.  Check if "+bandwidthUri+" returns a response."});
				return;
			}
			
			if(typeof bandwidthStats[options.networkInterface] == 'undefined'){
				options.callback({error:'Unable to find networkInterface "'+options.networkInterface+'".  Check if specified networkInterface is displayed when visiting '+bandwidthUri+' in a browser.'});
				return;
			}
			
			bandwidthStats[options.networkInterface].time = new Date().getTime();		
			readings.push(bandwidthStats[options.networkInterface]);
			
			//take additional reading until obtained 2 readings
			if(readings.length < 2){
				//request another reading
				setTimeout(getTotalBytes, options.timeBetweenReadings);
			}else{
				options.callback(calculateBandwidth());
			}
		}
	});
}

function calculateBandwidth(callback){
	var elapsed = (readings[1].time - readings[0].time);
	//bytes transmitted
	var downDiff = readings[1].rx - readings[0].rx;
	var upDiff = readings[1].tx - readings[0].tx;
	
	//bytes per second
	var downlink = downDiff/elapsed*1000;
	var uplink = upDiff/elapsed*1000;
	
	return {
		error: false,
		bandwidth: {
			KbitsDown: downlink*0.008,
			KbitsUp: uplink*0.008,
			MbitsDown: +(downlink*0.000008).toFixed(2),
			MbitsUp: +(uplink*0.000008).toFixed(2),
			elapsed: elapsed,
			readings: readings
		}
	}
}

module.exports = getBandwidth;
