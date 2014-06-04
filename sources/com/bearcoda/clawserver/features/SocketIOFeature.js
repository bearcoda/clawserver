//ClawServer Classes
var HttpFeature = require('com/bearcoda/clawserver/features/SocketFeature');
var FeatureTypes = require('com/bearcoda/clawserver/features/FeatureTypes');
var SocketFeature = require('com/bearcoda/clawserver/features/SocketFeature');

//BearCoda Classes
var delegate = require('com/bearcoda/utils/Utilities').delegate;

//NodeJS Classes
var utils = require('util');

/**
 * @class
 * @classdesc SocketIOFeature class serves as a base for working with the socket.IO API
 * @constructor
 * @extends clawserver/features/SocketFeature
 * @param loaderfeature {ServerLoadFeature} - The server load feature object
 * @param HttpFeature {String} - Pass in an http feature if you wish to attach http request functionality to the socket
 */
var SocketIOFeature = function( loadFeature, client, httpFeature ) {
	
	//Re-routes the close listener
	this._closeProp = 'disconnect';
	this._calls = {};
	this.client = client;

	this.httpFeature = httpFeature;

	//Call constructor with feature type and loaderfeature
	SocketFeature.call( this, loadFeature, httpFeature );

	//for this we do a small hack to feature type
	this.featureType = 'socket.io';
}

utils.inherits( SocketIOFeature, SocketFeature );
var __SocketIOFeature = SocketIOFeature.prototype;
	__SocketIOFeature._calls;


/**
 * Use the client object to receive calls coming from the end user
 * @member
 * @readonly
 * @type {Object}
 */
SocketIOFeature.prototype.client;

/**
 * If a http feature is passed in then hook this up to the listener
 * @member
 * @readonly
 * @type {HttpFeature}
 */
SocketIOFeature.prototype.httpFeature;

/*
 * PUBLIC API
 */

SocketIOFeature.prototype.emit = function( handlerName, data ) {
	var i, nLen = this.clients.length;
	for( i = 0; i < nLen; i++ )
	{
		this.clients[i].emit(handlerName, data);
	}
}

/*
 * PROTECTED API
 */
 
SocketIOFeature.prototype.onClientObjChanged = function( value ) {
	
	//Remove old calls
	if( this.client ) this.registerCalls(false);
	
	this.client = value;
	
	//Register new
	if( this.client ) this.registerCalls();
}
 
SocketIOFeature.prototype.registerCalls = function( register ) {
	
	if( !this.clients || this.clients.length == 0 ) return;
	
	var i, len = this.clients.length;
	for( i = 0; i < len; i++ ) {
		this.bindClientCalls( this.clients[i], (register || true) );
	}
}

SocketIOFeature.prototype.bindClientCalls = function( client, bind ) {
	//console.log('bindClientCalls: ' + client+' : '+this.client);
	if( !this.client ) return;
	
	var i;
	for( i in this.client ) {
		//Either you check to see if the function or event exists on the client object
		if( typeof(this.client[i]) == 'function' ) this.bindClientCallAt( client, i, bind );
	}
}

SocketIOFeature.prototype.bindClientCallAt = function( client, handlerName, bind ) {
	var callbackName = handlerName+'_'+client.id;
	if( bind == false ) {
		try {
			client.off( handlerName, this._calls[callbackName] );
		}catch(e) {
			//Couldn't unregister
			console.log('Error: ' + e)
		}
		this._calls[callbackName] = undefined; delete this._calls[callbackName];
	}else{
		this._calls[callbackName] = delegate( this, this.onClientCall, client, handlerName );
		client.on( handlerName, this._calls[callbackName] );		
	}
}

SocketIOFeature.prototype.onClientCall = function( data, client, handlerName ) {
	//console.log('onClientCall: ' + handlerName);
	//Check to make sure 
	if( typeof(this.client[handlerName]) == 'function' ) {
		this.client[handlerName]( client, data );
	}
}

__SocketIOFeature.createServer = function( callback ) { 
	
	var server, 
		io = require('socket.io'),
		options = this.getOptions(this.loadFeature.secure);

	server = io.listen.apply( io, this.getListenerInfo() );
	return options.instances != undefined ? server.of(options.instances) : server.sockets;
}

__SocketIOFeature.getCreateCallback = function() {
	//Socket IO doesnt allow you to attach callbacks so pass back nothing here
	return undefined;
}

__SocketIOFeature.getListenerInfo = function() {
	//If you want to attach http functionality then that is done here
	return this.httpFeature != undefined ? [this.httpFeature.server] : [Number(this.loadFeature.configuration.port) || 80, this.loadFeature.configuration.host];
}

__SocketIOFeature.getOptions = function( secure ) {
	//Adding instance data if applies
	var options = SocketFeature.prototype.getOptions.call( this, secure );
		options.instances = this.loadFeature.configuration.instances;

	return options;
}

__SocketIOFeature.getListenerCallBack = function( eventType ) {
	if( eventType != 'connection' && eventType != 'disconnect' ) {
		//if not either then ignore for now
		return undefined
	}else{
		return SocketFeature.prototype.getListenerCallBack.call( this, eventType );
	}
}

__SocketIOFeature.onConnection = function( socket ) {
	this.bindClientCalls( socket, true );
	SocketFeature.prototype.onConnection.call( this, socket );
}

__SocketIOFeature.onDisconnect = function( socket ) {
	this.bindClientCalls( socket, false );
	SocketFeature.prototype.onDisconnect.call( this, socket );
}


/*
 * GETTER / SETTER
 */
 
SocketIOFeature.prototype.setClient = function( value ) {
	if( this.client == value ) return;
	this.onClientObjChanged(value);
}

__SocketIOFeature = undefined;
module.exports = SocketIOFeature;