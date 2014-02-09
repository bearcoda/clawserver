
//ClawServer Classes
var LoadableServer = require('com/bearcoda/clawserver/servers/LoadableServer');
var ServerLoadFeature = require('com/bearcoda/clawserver/features/ServerLoadFeature');
var ServerLoader = require('com/bearcoda/clawserver/loaders/ServerLoader');
var ClusterFeature = require('com/bearcoda/clawserver/features/ClusterFeature');
var WebRequestFeature = require('com/bearcoda/clawserver/features/WebRequestFeature');
var FeatureTypes = require('com/bearcoda/clawserver/features/FeatureTypes');

//BearCoda Classes
var delegate = require('com/bearcoda/utils/Utilities').delegate;

//NodeJS Classes
var utils = require('util');

/**
 * @class
 * @classdesc Serves as the main class for server elements
 * @constructor
 * @extends clawserver/servers/LoadableServer
 * @param configuration {ServerConfigurationBase} - The configuration object
 * @param loader {LoaderBase} - The loader object. Defaults to ServerLoad if loader is null
 */
var ServerElement = function( config, loader ) {
	LoadableServer.call( this, config, (loader || new ServerLoader()) );
}

utils.inherits( ServerElement, LoadableServer );

/*
 * PROTECTED API
 */

ServerElement.prototype.createLoadFeature = function( config, loader ) {
	return new ServerLoadFeature( loader, config );
}

ServerElement.prototype.processReadyState = function() { 
	
	var loadFeature = this.getFeature(FeatureTypes.LOAD);
	if( loadFeature instanceof ServerLoadFeature ) {
		
		var cluster = new ClusterFeature(loadFeature);
		this.addFeature(FeatureTypes.CLUSTER, cluster );
			
		var webRequest = new WebRequestFeature(loadFeature);
		this.addFeature(FeatureTypes.WEB_REQUEST, webRequest );
	}
}

ServerElement.prototype.processUnloadingState = function() {
	
	this.removeFeature(FeatureTypes.CLUSTER);
	this.removeFeature(FeatureTypes.WEB_REQUEST);
}

module.exports = ServerElement;