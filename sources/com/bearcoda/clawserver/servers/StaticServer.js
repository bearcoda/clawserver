
//ClawServer Classes
var HttpServer = require('com/bearcoda/clawserver/servers/HttpServer');
var ServerLoader = require('com/bearcoda/clawserver/loaders/ServerLoader');
var FeatureTypes = require('com/bearcoda/clawserver/features/FeatureTypes');
var ServerLoadFeature = require('com/bearcoda/clawserver/features/ServerLoadFeature');
var StaticServeFeature = require('com/bearcoda/clawserver/features/StaticServeFeature');

//NodeJS Classes
var utils = require('util');

/**
 * @class
 * @classdesc Static server handles web request and serves static files. [Note: This element requires the node-static dependency but can be extended to work with other frameworks]
 * @constructor
 * @extends clawserver/servers/HttpServer
 * @param configuration {StaticConfiguration} - The configuration object
 * @param loader {ServerLoader} - The loader object. Defaults to ServerLoader if loader is null
 */
var StaticServer = function( config, loader ) {
	HttpServer.call( this, config, (loader || new ServerLoader()) );
}

utils.inherits( StaticServer, HttpServer );

/** @private */
var __StaticServer = StaticServer.prototype;

/*
 * PROTECTED API
 */

StaticServer.prototype.createStaticServeFeature = function( loadFeature, httpFeature ) {
	return new StaticServeFeature(loadFeature, httpFeature);
}

/*
 * PRIVATE API
 */

__StaticServer.processReadyState = function() { 
	
	//Call super
	HttpServer.prototype.processReadyState.call( this, null );
	
	//Call add http feature
	var loadFeature = this.getFeature(FeatureTypes.LOAD);
	if( loadFeature instanceof ServerLoadFeature ) {	
		
		var httpFeature = this.getFeature(FeatureTypes.HTTP);
		if( httpFeature ) {
			var staticFeature = this.createStaticServeFeature(loadFeature, httpFeature);
			if( staticFeature ) this.addFeature(FeatureTypes.STATIC_SERVE, staticFeature );
		}
	}
}

__StaticServer.processUnloadingState = function() {
	HttpServer.prototype.processUnloadingState.call( this, null );
	this.removeFeature(FeatureTypes.STATIC_SERVE);
}

__StaticServer = undefined;
module.exports = StaticServer;