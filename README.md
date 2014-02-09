# ClawServer API v0.1 [alpha]

## Overview

ClawServer is a Node.js API framework designed to allow setup of multiple server configurations under one code base. It's still very light
in its current form but thinking ahead you should be able to setup for example a simple HTTP server, socket.IO, or a proxy server to forward calls. 
Those are just some examples but with time there should be much more functionality added.

*Note: This is pre-alpha software. Software is offered AS-IS and at this point we don't recommend it for commercial projects. BearCoda takes absolutely no 
responsibility for damages resulting from the use of this product*
<br><br>

## How To Use

Except for configurations, currently it's not too important to know what each does since there is only one ServerElement available. However, it does help in case you
want to create your own elements. ClawServer primarily works with four main components. 

 * ServerConfiguration - Handles loading of configurations to use with the server. The configuration accepts an object or a string path
 to a JSON formatted file.
 
			//Load API
			var clawserverAPI = require('ClawServerAPI');
			
			//Load configuration class
			var ServerConfiguration = clawserverAPI.require('clawserver/servers/ServerConfiguration');
			
			//Create new configuration instance
			var configuration = new ServerConfiguration( './config.json' );
			...or
			var configuration = new ServerConfiguration( {host:'localhost', port:8080, cores:1} );
 
 * ServerLoader - Handles loading server objects or dependencies the ClawServer may use.
 
			...
			//Load loader class
			var ServerLoader = clawserverAPI.require('clawserver/loaders/ServerLoader');
			
			//Create new loader instance
			var loader = new ServerLoader();
 
 * ServerElement - Uses both loader and configuration to load, manage, and run the server.
 
			...
			//Load element class
			var ServerElement = clawserverAPI.require('clawserver/servers/ServerElement');
			
			//Create new instance and assign configuration and loader instances
			var element = new ServerElement( configuration, loader );
 
 * ClawServer - The main server that manages data and events coming from the element.
 
			...
			//Load server class
			var ClawServer = clawserverAPI.require('clawserver/core/ClawServer');
			
			//Create new ClawServer instance
			var server = new ClawServer(element);
				
			//listen to the web request event
			server.on( 'webRequest', function(event) {
				//Event is instance of WebRequestEvent class
				event.response.writeHead(200, {'Content-Type': 'text/plain'});
				event.response.end('Hello World\n');
			});
			
Since there is only one element to work with at the current moment you can use the ClawServerAPI class to greatly simplify this process.

			var server = require('ClawServerAPI').createServer( './config.json' );
			...or
			var server = require('ClawServerAPI').createServer( {host:'localhost', port:8080, cores:1} );
			
			//listen to the web request event
			server.on( 'webRequest', function(event) {
				//Event is instance of WebRequestEvent class
				event.response.writeHead(200, {'Content-Type': 'text/plain'});
				event.response.end('Hello World\n');
			});

