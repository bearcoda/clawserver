
//ClawServer Classes
var ServerElement = require('com/bearcoda/clawserver/servers/ServerElement');
var ServerLoadFeature = require('com/bearcoda/clawserver/features/ServerLoadFeature');
var ServerLoader = require('com/bearcoda/clawserver/loaders/ServerLoader');
var HttpFeature = require('com/bearcoda/clawserver/features/HttpFeature');
var FeatureTypes = require('com/bearcoda/clawserver/features/FeatureTypes');

//BearCoda Classes
var delegate = require('com/bearcoda/utils/Utilities').delegate;

//NodeJS Classes
var utils = require('util');

/**
 * @class
 * @classdesc Serves as the main class for server elements
 * @constructor
 * @extends clawserver/servers/ServerElement
 * @param configuration {ServerConfigurationBase} - The configuration object
 * @param loader {LoaderBase} - The loader object. Defaults to ServerLoad if loader is null
 */
var HttpServer = function( config, loader ) {
	ServerElement.call( this, config, (loader || new ServerLoader()) );
}

utils.inherits( HttpServer, ServerElement );

/*
 * PROTECTED API
 */

/**
 * Creates and returns the http feature for this class
 * @method
 * @protected
 * @param loadFeature {ServerLoadFeature} - An instance of the ServerLoadFeature class
 * @returns newHttpFeature {HttpFeature} - Should return a new instance of the HttpFeature class
 */
HttpServer.prototype.createHttpFeature = function(loadFeature) {
	return new HttpFeature(loadFeature);
}

HttpServer.prototype.processReadyState = function() { 
	
	//Call super
	ServerElement.prototype.processReadyState.call( this, null );
	
	//Call add http feature
	var loadFeature = this.getFeature(FeatureTypes.LOAD);
	if( loadFeature instanceof ServerLoadFeature ) {	
		
		var httpFeature = this.createHttpFeature(loadFeature);
		if( httpFeature && httpFeature.featureType == FeatureTypes.HTTP ) this.addFeature(FeatureTypes.HTTP, httpFeature );
	}
}

HttpServer.prototype.processUnloadingState = function() {
	ServerElement.prototype.processUnloadingState.call( this, null );
	this.removeFeature(FeatureTypes.HTTP);
}

module.exports = HttpServer;