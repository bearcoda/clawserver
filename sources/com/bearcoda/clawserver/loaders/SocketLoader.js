
//ClawServer Classes
var ServerLoader = require('com/bearcoda/clawserver/loaders/ServerLoader');

//NodeJS Classes
var utils = require('util');

/**
 * @class 
 * @constructor
 * @extends clawserver/loaders/ServerLoader
 * @classdesc Serves as the base class for socket serves
 */
var SocketLoader = function() {
	ServerLoader.call( this, null );
}

utils.inherits( SocketLoader, ServerLoader );

var __SocketLoader = SocketLoader.prototype;

/*
 * PRIVATE API
 */

__SocketLoader.createServer = function( loadFeature ) {
	return this.isSecure ? require('tls') : require('net'); 
}

__SocketLoader = undefined;
module.exports = SocketLoader;