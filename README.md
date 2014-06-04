# ClawServer API v0.2 [alpha]

## Overview

ClawServer is a Node.js API framework designed to allow setup of multiple server configurations under one code base. It's still very light
in its current form but thinking ahead you should be able to setup for example a simple HTTP server, socket.IO, or a proxy server to forward calls. 
Those are just some examples but with time there should be much more functionality added.

*Note: This is pre-alpha software. Software is offered AS-IS and at this point we don't recommend it for commercial projects. BearCoda takes absolutely no 
responsibility for damages resulting from the use of this product*
<br><br>

## What's New?

### v0.2
 * New server classes include static, express, and socket.io functionality.
 * ClawServerAPI is now deprecated so use clawserver instead:
			//Load API
			var clawserver = require('clawserver');
			//Create server
			var server = clawserver( 'proxy', './config.json' );
 * Several bug fixes and stability improvements.

### v0.1.1.1
 * ProxyServer classes now allow you to also detect paths and redirect.
 * Switched out Bouncy dependency and now using http-proxy instead so when using ProxyServer classes make sure to install http-proxy via npm.

### v0.1.1
 * There were syntax errors in the ClawServerAPI class that would throw errors if you tried to create a server.
 * ProxyServer classes have been added to allow a proxy server setup. Please note this functionality requires bouncy API to be installed through npm.
 * ClawServerAPI class createServer now accepts an optional **type** argument to specify which type of server to create.
 * TLS and Proxy feature type classes are now deprecated and are built directly into the API.

### Setup
 
You can create a new server instance by calling the clawserver api:

			var clawserver = require('clawserver')("serverElementName", "configuration");

In order to create a new server element simply pass 2 arguments.

* **serverElementName**: The server element for the api to create. [optional]
  * **http**: Creates a simple http server element. This is the default element if no name is specified.
  * **socket**: Creates a tcp socket server element.
  * **socket.io**: Creates a Socket.io server element. Please note this requires the socket.io API to be installed through npm.
  * **static**: Creates a static server element used to deliver files on the server. Requires node static API to be installed through npm.
  * **express**: Creates an express server element. Requires expressjs to be installed through npm.
  * **express.io**: Creates an express element with socket io functionality. Requires dependencies used for both express and socket.io elements.
* **configuration**: An object containing configuration settings to use on the new server instance or a path to a json file with same settings. 
  * **host**: The host name this server instance will be accessible from.
  * **port**: The port the server should listen on.
  * **cores**: The number of cores to activate on this server.
  * **tls_key**: The path to the tls key to load for secure connections.
  * **tls_cert**: The path to the tls certificate to load for secure connections.
  * **staticPaths**: The static configuration paths are for serving requests for static files. The property should hold an array of objects which should each hold 2 properties. (express and static only)
    * **path**: the path property which is used to to detect a path to serve on the server. 
	* **contentPath**: The second is contentPath which is a path to a local directory or file to serve the content. 
  * **statusPaths**: Contains an object with string values which point to a file path to load to handle http statuses. The key values should be entered depending on the status code to handle. (express and static only)
  * **compress**: Indicates if the compatible files should be compressed or gzipped before being sent to the browser. (static only)
  * **proxyPaths**: The proxy configuration paths are for automatically redirecting requests to other servers and/or ports. Holds an array of objects which should each hold 3 properties. (proxy only)
    * **host**: Is the request host to detect or <b>path</b> which is the path to detect. 
	* **fowardHost**: Is the host to redirect the request to. Defaults to localhost if it is not provided. 
	* **forwardPort**: Is the port to forward the requests to. This defaults to port 80 if not provided.<br><i>Note: If you are detecting sub-domains then do not set a host in the main options. Keep in mind that you will need to configure your server settings to allow connections to the sub-domains or ports you want your server to detect.</i>
  * **websockets**: A boolean value which specifies whether to allow websocket forwarding. (proxy only)
  
### HTTP Server
 
		//Create simple http server
		var clawserver = require('clawserver')( 'http', {host: 'localhost', port:80} );
		..or
		//Create simple https server
		var clawserver = require('clawserver')( 'http', {host: 'localhost', port:443, tls_key: 'path to tls key file', tls_cert: 'path to tls cert file'} );
		
		clawserver.on( 'webRequest', function(event) {
			//Event is instance of WebRequestEvent class
			event.response.writeHead(200, {'Content-Type': 'text/plain'});
			event.response.end('Hello World\n');
		});
		
### Socket Server

		//Create socket server
		var clawserver = require('clawserver')( 'socket', {host: 'localhost', port:8080} );
		..or
		//Create secure socket server
		var clawserver = require('clawserver')( 'socket', {host: 'localhost', port:8080, tls_key: 'path to tls key file', tls_cert: 'path to tls cert file'} );
		
		var msg = 'Hello World!';
		clawserver.on( 'call', function( event ) {
			event.stream.write(msg+"\n");
			event.stream.pipe(event.stream);
		});
		
### Serve Static Files (works with express element too)

		//Create simple server
		var clawserver = require('clawserver')( 'static', {
			host: 'localhost', 
			port:80,
			staticPaths: [
				{
					path:"/public",
					contentPath: "C:/webPublic"
				},
				{
					path:"/login",
					contentPath: "C:/webPublic/login.html"
				}]
			} );
		..or
		//Create secure server
		var clawserver = require('clawserver')( 'static', {
			host: 'localhost', 
			port:443, 
			tls_key: 'path to tls key file', 
			tls_cert: 'path to tls cert file',
			staticPaths: [
				{
					path:"/public",
					contentPath: "C:/webPublic"
				},
				{
					path:"/login",
					contentPath: "C:/webPublic/login.html"
				}]
			} );
		
### Express Server

		//Create socket server
		var clawserver = require('clawserver')( 'express', {host: 'localhost', port:80} );
		..or
		//Create secure socket server
		var clawserver = require('clawserver')( 'express', {host: 'localhost', port:443, tls_key: 'path to tls key file', tls_cert: 'path to tls cert file'} );
		
		var express;
		clawserver.on( 'ready', function( event ) {
			express = clawserver.server.express;
			
			//Use express here...
		});
		
### Socket.IO server

		//Create socket.io server
		var clawserver = require('clawserver')( 'socket.io', {host: 'localhost', port:8080} );
		..or
		//Create secure socket.io server
		var clawserver = require('clawserver')( 'socket.io', {host: 'localhost', port:8080, tls_key: 'path to tls key file', tls_cert: 'path to tls cert file'} );
		
		//Fires when a client has connected
		clawserver.on( 'connection', function(event) {
				console.log('connected!');
		});
		
		//Fires when a client has disconnected
		clawserver.on( 'disconnect', function(event) {
				console.log('disconnected!');
		});
		
		//Create client object to receive calls from the front-end
		var clientObj = {};
			clientObj.onMessage = function( client, msg ) {
				console.log( 'onMessage: ' + client+' : '+msg );
			}
			
		//Attach client object to server
		clawserver.server.setClient(clientObj);
		
### Proxy Server

		//Create simple server
		var clawserver = require('clawserver')( 'proxy', {
			host: 'localhost', 
			port:80,
			proxyPaths: [
		  		{
		  			host:"sub1.myCustomDomain.com",
		  			forwardHost: "myCustomDomain2.com"
		  		},
		  		{
		  			path:"/myCustomWeb",
		 			forwardPort: 8080
		  		}]
			} );
		..or
		//Create secure server
		var clawserver = require('clawserver')( 'proxy', {
			host: 'localhost', 
			port:443, 
			tls_key: 'path to tls key file', 
			tls_cert: 'path to tls cert file',
			proxyPaths: [
		  		{
		  			host:"sub1.myCustomDomain.com",
		  			forwardHost: "myCustomDomain2.com"
		  		},
		  		{
		  			path:"/myCustomWeb",
		 			forwardPort: 8080
		  		}]
			} );
			
Stay tuned there is still much more to come :)

