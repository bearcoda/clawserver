
//ClawServer Classes
var ServerElement = require('com/bearcoda/clawserver/servers/ServerElement');
var ServerLoadFeature = require('com/bearcoda/clawserver/features/ServerLoadFeature');
var ProxyLoader = require('com/bearcoda/clawserver/servers/proxyserverclasses/ProxyLoader');
var ProxyRequestFeature = require('com/bearcoda/clawserver/servers/proxyserverclasses/ProxyRequestFeature');
var ClusterFeature = require('com/bearcoda/clawserver/features/ClusterFeature');
var FeatureTypes = require('com/bearcoda/clawserver/features/FeatureTypes');

//NodeJS Classes
var utils = require('util');

/**
 * @class
 * @classdesc Detects and redirects web request calls to other servers or ports
 * @constructor
 * @extends clawserver/servers/ServerElement
 * @param configuration {ProxyConfiguration} - The configuration object
 * @param loader {ProxyLoader} - The loader object. Defaults to ProxyLoader if loader is null
 */
var ProxyServer = function( config, loader ) {
	ServerElement.call( this, config, (loader || new ProxyLoader()) );
}

utils.inherits( ProxyServer, ServerElement );

/*
 * PROTECTED API
 */

ProxyServer.prototype.processReadyState = function() { 
	
	var loadFeature = this.getFeature(FeatureTypes.LOAD);
	if( loadFeature instanceof ServerLoadFeature ) {
		
		var cluster = new ClusterFeature(loadFeature);
		this.addFeature(FeatureTypes.CLUSTER, cluster );
			
		var webRequest = new ProxyRequestFeature(loadFeature);
		this.addFeature(FeatureTypes.WEB_REQUEST, webRequest );
	}
}

module.exports = ProxyServer;