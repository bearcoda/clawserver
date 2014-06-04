
//ClawServer Classes
var ServerElement = require('com/bearcoda/clawserver/servers/ServerElement');
var ServerLoadFeature = require('com/bearcoda/clawserver/features/ServerLoadFeature');
var SocketLoader = require('com/bearcoda/clawserver/loaders/SocketLoader');
var SocketFeature = require('com/bearcoda/clawserver/features/SocketFeature');
var FeatureTypes = require('com/bearcoda/clawserver/features/FeatureTypes');

//NodeJS Classes
var utils = require('util');

/**
 * @class
 * @classdesc Server element used to leverage tcp socket connections
 * @constructor
 * @extends clawserver/servers/ServerElement
 * @param configuration {ServerConfiguration} - The configuration object
 * @param loader {SocketLoader} - The loader object. Defaults to SocketLoader if loader is null
 */ 
var SocketServer = function( config, loader ) {
	
	//Keep an instance for reference
	this._socketLoader = loader;
	
	ServerElement.call( this, config, loader || new SocketLoader() );
}

utils.inherits( SocketServer, ServerElement );

/*
 * PROTECTED API
 */

/**
 * Creates and returns the socket feature for this class
 * @method
 * @protected
 * @param loadFeature {ServerLoadFeature} - An instance of the ServerLoadFeature class
 * @returns newSocketFeature {SocketFeature} - Should return a new instance of the SocketFeature class
 */
SocketServer.prototype.createSocketFeature = function( loadFeature ) {
	return new SocketFeature(loadFeature);
}
 
SocketServer.prototype.processReadyState = function() { 
	ServerElement.prototype.processReadyState.call( this, null );
	var loadFeature = this.getFeature(FeatureTypes.LOAD);
	if( loadFeature instanceof ServerLoadFeature ) {
		var socketFeature = this.createSocketFeature( loadFeature );
		if( socketFeature && socketFeature.featureType == FeatureTypes.SOCKET ) this.addFeature(FeatureTypes.SOCKET, socketFeature);
	}
}

SocketServer.prototype.processUnloadingState = function() {
	ServerElement.prototype.processUnloadingState.call( this, null );
	this.removeFeature(FeatureTypes.SOCKET);
}

module.exports = SocketServer;