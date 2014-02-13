
//ClawServer Classes
var ServerLoader = require('com/bearcoda/clawserver/loaders/ServerLoader');

//NodeJS Classes
var utils = require('util'); 

//Note: This element requires the bouncy dependency to be installed
var bouncy = require('bouncy');

/**
 * @class 
 * @constructor
 * @extends clawserver/loaders/ServerLoader
 * @classdesc Serves as the base class for loading serves
 */
var ProxyLoader = function() {
	ServerLoader.call( this, null );
}

utils.inherits( ProxyLoader, ServerLoader );

/*
 * PUBLIC API
 */

ProxyLoader.prototype.canHandleConfiguration = function( config ) {
	return ServerLoader.prototype.canHandleConfiguration.call( this, config ) && config.proxyPaths != undefined;
}
 
/*
 * PROTECTED API
 */

ProxyLoader.prototype.createServer = function( loadFeature ) {
	return {createServer:function() {
		if( arguments.length > 1 ){
			return bouncy(arguments[0], arguments[1]);
		}else{
			return bouncy(arguments[0]);
		}
	}};
}
 
module.exports = ProxyLoader;