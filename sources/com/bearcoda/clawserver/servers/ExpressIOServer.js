
//ClawServer Classes
var ExpressServer = require('com/bearcoda/clawserver/servers/ExpressServer');
var ServerLoader = require('com/bearcoda/clawserver/loaders/ServerLoader');
var SocketIOFeature = require('com/bearcoda/clawserver/features/SocketIOFeature');
var FeatureTypes = require('com/bearcoda/clawserver/features/FeatureTypes');
var ServerLoadFeature = require('com/bearcoda/clawserver/features/ServerLoadFeature');

//NodeJS Classes
var utils = require('util');

/**
 * @class
 * @classdesc A socket IO enabled server with express functionality
 * @constructor
 * @extends clawserver/servers/ExpressServer
 * @param configuration {SocketIOConfiguration} - The configuration object
 * @param loader {ServerLoader} - The loader object. Defaults to ServerLoader if loader is null
 */
var ExpressIOServer = function( config, loader ) {
	ExpressServer.call( this, config, (loader || new ServerLoader()) );
}

utils.inherits( ExpressIOServer, ExpressServer );

var __ExpressIOServer = ExpressIOServer.prototype;

/**
 * Holds the client object which receives calls the client
 * @member
 * @readonly
 * @type {object}
 */
ExpressIOServer.prototype.client;

/*
 * PROTECTED API
 */

__ExpressIOServer.createHttpFeature = function(loadFeature) {

	var httpFeature = ExpressServer.prototype.createHttpFeature.call( this, loadFeature );
	this.addFeature( 'socket.io', new SocketIOFeature(loadFeature, this.client, httpFeature) );
	return httpFeature;
}

__ExpressIOServer.processUnloadingState = function() {

	//Remover socket IO then clear out http
	this.removeFeature('socket.io');
	ExpressServer.prototype.processUnloadingState.call( this, null );
}

/*
 * GETTER / SETTER
 */

/**
 * Used to appropriately set a new client value
 * @method
 * @param {object} newClient - Client object which holds all call back values
 */
ExpressIOServer.prototype.setClient = function( value ) {
	
	var socketFeature = this.getFeature('socket.io');
	if( this.client == value ) return;

	this.client = value;
	if( socketFeature ) socketFeature.setClient(this.client);
}

__ExpressIOServer = undefined;
module.exports = ExpressIOServer;