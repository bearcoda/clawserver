
//ClawServer Classes
var HttpServer = require('com/bearcoda/clawserver/servers/HttpServer');
var ProxyLoader = require('com/bearcoda/clawserver/servers/proxyserverclasses/ProxyLoader');
var ProxyRequestFeature = require('com/bearcoda/clawserver/servers/proxyserverclasses/ProxyRequestFeature');

//NodeJS Classes
var utils = require('util');

/**
 * @class
 * @classdesc Detects and redirects web request calls to other servers or ports
 * @constructor
 * @extends clawserver/servers/HttpServer
 * @param configuration {ProxyConfiguration} - The configuration object
 * @param loader {ProxyLoader} - The loader object. Defaults to ProxyLoader if loader is null
 */
var ProxyServer = function( config, loader ) {
	HttpServer.call( this, config, (loader || new ProxyLoader()) );
}

utils.inherits( ProxyServer, HttpServer );

/*
 * PROTECTED API
 */

ProxyServer.prototype.createHttpFeature = function(loadFeature) {
	return new ProxyRequestFeature(loadFeature);
}

module.exports = ProxyServer;