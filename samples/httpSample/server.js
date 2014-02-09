
/*
 * @author Joebear
 */

var options = './config.json';
 
var server = require('ClawServerAPI').createServer(options);
	server.on( 'stateChange', function( event ) {
		console.log( 'stateChange: ' + server.state );
	});

	server.on( 'webRequest', function( event ) {
		console.log('webRequest!');
		event.response.writeHead(200, {'Content-Type': 'text/plain'});
		event.response.end('Hello World\n')
	});