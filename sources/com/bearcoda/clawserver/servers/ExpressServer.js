
//ClawServer Classes
var StaticServer = require('com/bearcoda/clawserver/servers/StaticServer');
var ServerLoader = require('com/bearcoda/clawserver/loaders/ServerLoader');
var FeatureTypes = require('com/bearcoda/clawserver/features/FeatureTypes');
var ExpressStaticFeature = require('com/bearcoda/clawserver/servers/expressserverclasses/ExpressStaticFeature');
var ExpressHttpFeature = require('com/bearcoda/clawserver/servers/expressserverclasses/ExpressHttpFeature');

//NodeJS Classes
var utils = require('util');

/**
 * @class
 * @classdesc Express (3.x) server handles web request and serves static files. [Note: This element requires the node-static dependency but can be extended to work with other frameworks]
 * @constructor
 * @extends clawserver/servers/StaticServer
 * @param configuration {ExpressConfiguration} - The configuration object
 * @param loader {ServerLoader} - The loader object. Defaults to ServerLoader if loader is null
 */
var ExpressServer = function( config, loader ) {
	StaticServer.call( this, config, (loader || new ServerLoader()) );
}

utils.inherits( ExpressServer, StaticServer );

/**
 * Main express object
 * @member
 * @type {ExpressJS}
 */
ExpressServer.prototype.express;

/** @private */
var __ExpressServer = ExpressServer.prototype;

/*
 * PROTECTED API
 */

__ExpressServer.createStaticServeFeature = function( loadFeature, httpFeature ) {
	return new ExpressStaticFeature(loadFeature, httpFeature);
}

__ExpressServer.createHttpFeature = function(loadFeature) {
	return new ExpressHttpFeature(loadFeature);
}

__ExpressServer.processReadyState = function() { 
	
	//Call super
	StaticServer.prototype.processReadyState.call( this, null );

	//Recover express object
	this.express = this.getFeature( FeatureTypes.HTTP ).express;
}

__ExpressServer.processUnloadingState = function() {
	StaticServer.prototype.processUnloadingState.call( this, null );
	this.express = undefined;
}

__ExpressServer = undefined;
module.exports = ExpressServer;