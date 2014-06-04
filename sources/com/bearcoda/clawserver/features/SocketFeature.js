
//ClawServer Classes
var HttpFeature = require('com/bearcoda/clawserver/features/HttpFeature');
var FeatureTypes = require('com/bearcoda/clawserver/features/FeatureTypes');
var SocketEvent = require('com/bearcoda/clawserver/events/SocketEvent');

//BearCoda Classes
var delegate = require('com/bearcoda/utils/Utilities').delegate;

//NodeJS Classes
var utils = require('util');

/**
 * @class
 * @classdesc SocketFeature class serves as a base for handling Socket request and functionality
 * @constructor
 * @extends clawserver/features/HttpFeature
 * @param loaderfeature {ServerLoadFeature} - The server load feature object
 */
var SocketFeature = function( loadFeature ) {
	
	//Call constructor with feature type and loaderfeature
	HttpFeature.call( this, loadFeature, FeatureTypes.SOCKET );
	
	this.clients = [];
	this._disconnect = delegate(this, this.onDisconnect);
}

/** @private */
SocketFeature._SOCKET_ID_COUNT_ = 0;
SocketFeature._SOCKET_ID_PREFIX_ = 'socket';

/**
 * Fires when a web request is made
 * @event SocketFeature#webRequest
 * @type {WebRequestEvent}
 */
 
utils.inherits( SocketFeature, HttpFeature );
var __SocketFeature = SocketFeature.prototype;

/** @private */
__SocketFeature._closeProp = 'close';

/**
 * Keeps a list of connected clients
 * @member
 * @protected
 * @type {Array.<Object>}
 */
SocketFeature.prototype.clients;

/*
 * PROTECTED
 */

/**
 * Searches to see if client exists in the application
 * @method
 * @param {string} - The client id
 * @returns {boolean}
 */
SocketFeature.prototype.clientExists = function( id )
{
	return this.getClientAt(id) != undefined;
}

/**
 * Searches and gets a client object
 * @method
 * @param {string} - The client id
 * @returns {Client}
 */
SocketFeature.prototype.getClientAt = function( id )
{
	var i, client, nLen = this.clients.length;
	for( i = 0; i < nLen; i++ )
	{
		if( this.clients[i].id == id )
		{
			client = this.clients[i];
			break;
		}
	}
	return client;
}
 
/**
 * Listens to new requests coming from the the TCP connection
 * @method
 * @protected
 * @param {Stream} - Native node stream object
 */
SocketFeature.prototype.onSocketRequest = function( stream ) {
	this.dispatchEvent( new SocketEvent(SocketEvent.CALL, {stream:stream}) );
}

/**
 * Fires when a new connection has been made
 * @method
 * @protected
 * @param {Socket|Stream} - Stream object when secure and socket when not
 */
SocketFeature.prototype.onConnection = function( socket ) {
	var disconnect = this._disconnect;
	if( !('id' in socket) ) {
		//Override id here but maybe shouldnt if it's not required
		socket.id = SocketFeature._SOCKET_ID_PREFIX_ + SocketFeature._SOCKET_ID_COUNT_;
		SocketFeature._SOCKET_ID_COUNT_++;
	}
	
	//Add socket to client list
	this.clients.push(socket);
	
	socket.on( this._closeProp, function() { disconnect(socket);});
	this.dispatchEvent( new SocketEvent(SocketEvent.CONNECTION, {socket:socket}) );
}

/**
 * Fires when the connection has closed
 * @method
 * @protected
 * @param {Socket|Stream} - Stream object when secure and socket when not
 */
SocketFeature.prototype.onDisconnect = function( socket ) {
	
	if( 'id' in socket ) this.__removeClient(socket.id);
	this.dispatchEvent( new SocketEvent(SocketEvent.DISCONNECT, {socket:socket}) );
}

/*
 * PRIVATE API
 */

__SocketFeature.getListenerCallBack = function( eventType ) {
	switch( eventType ) { 
		case 'connection' : 
			return this.onConnection;
		case this._closeProp : 
			return null;
		default : 
			return HttpFeature.prototype.getListenerCallBack.call( eventType );
	}
}

__SocketFeature.onRequest = function(stream) {
	this.onSocketRequest(stream);
}

__SocketFeature.__removeClient = function( id )
{
	var i, nLen = this.clients.length;
	for( i = 0; i < nLen; i++ )
	{
		if( this.clients[i].id == id )
		{
			this.clients.splice(i, 1);
			break;
		}
	}
}

__SocketFeature = undefined;
module.exports = SocketFeature;