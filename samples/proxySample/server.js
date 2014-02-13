
/*
 * @author Joebear
 */

var options = './config.json';
 
var server = require('ClawServerAPI').createServer( 'proxy', options);
	server.on( 'stateChange', function( event ) {
		console.log( 'stateChange: ' + server.state );
	});

	server.on( 'webRequest', function( event ) {
		console.log('proxyRequest!');
	});
	
//Make other http servers to listen on call
var http = require('http');

var server1 = http.createServer( function( req, res ) {
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end('Hello World\n');
}).listen(8080);

var server2 = http.createServer( function( req, res ) {
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end('Hello World 2!!!\n');
}).listen(8081);
