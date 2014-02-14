
//ClawServer Classes
var ServerLoader = require('com/bearcoda/clawserver/loaders/ServerLoader');

//NodeJS Classes
var utils = require('util'); 

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
 
module.exports = ProxyLoader;