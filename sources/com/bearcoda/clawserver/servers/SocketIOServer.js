
//ClawServer Classes
var HttpServer = require('com/bearcoda/clawserver/servers/HttpServer');
var ServerLoader = require('com/bearcoda/clawserver/loaders/ServerLoader');
var SocketIOFeature = require('com/bearcoda/clawserver/features/SocketIOFeature');
var FeatureTypes = require('com/bearcoda/clawserver/features/FeatureTypes');

//NodeJS Classes
var utils = require('util');

/**
 * @class
 * @classdesc A socket IO enabled server
 * @constructor
 * @extends clawserver/servers/SocketServer
 * @param configuration {SocketIOConfiguration} - The configuration object
 * @param loader {ServerLoader} - The loader object. Defaults to ServerLoader if loader is null
 */
var SocketIOServer = function( config, loader ) {
	HttpServer.call( this, config, (loader || new ServerLoader()) );
}

utils.inherits( SocketIOServer, HttpServer );

var __SocketIOServer = SocketIOServer.prototype;

/**
 * Holds the client object which receives calls the client
 * @member
 * @readonly
 * @type {object}
 */
SocketIOServer.prototype.client;

/*
 * PROTECTED API
 */

//make sure to create socket io feature only when http feature has been created
__SocketIOServer.createHttpFeature = function(loadFeature) {

	var httpFeature = HttpServer.prototype.createHttpFeature.call( this, loadFeature );
	this.addFeature( 'socket.io', new SocketIOFeature(loadFeature, this.client, httpFeature) );
	return httpFeature;
}

__SocketIOServer.processUnloadingState = function() {

	//Remover socket IO then clear out http
	this.removeFeature('socket.io');

	HttpServer.prototype.processUnloadingState.call( this, null );
}

/*
 * GETTER / SETTER
 */

/**
 * Used to appropriately set a new client value
 * @method
 * @param {object} newClient - Client object which holds all call back values
 */
SocketIOServer.prototype.setClient = function( value ) {
	
	var socketFeature = this.getFeature('socket.io');
	if( this.client == value ) return;

	this.client = value;
	if( socketFeature ) socketFeature.setClient(this.client);
}

__SocketIOServer = undefined;
module.exports = SocketIOServer;