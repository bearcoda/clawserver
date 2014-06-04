
//ClawServer Classes
var ServerFeatureBase = require('com/bearcoda/clawserver/features/ServerFeatureBase');
var FeatureTypes = require('com/bearcoda/clawserver/features/FeatureTypes');
var HttpEvent = require('com/bearcoda/clawserver/events/HttpEvent');

//BearCoda Classes
var delegate = require('com/bearcoda/utils/Utilities').delegate;

//NodeJS Classes
var utils = require('util');
var cluster = require('cluster');
var fs = require('fs');

/**
 * @class
 * @classdesc HttpFeature class serves as a base for handling Http(s) functionality
 * @constructor
 * @extends clawserver/features/ServerFeatureBase
 * @param loaderfeature {ServerLoadFeature} - The server load feature object
 * @param featureType {String} - Feature type for this class (Optional). [Note: Should only be used when extending a class]
 */
var HttpFeature = function( loadFeature, featureType ) {
	
	//Call constructor with feature type
	ServerFeatureBase.call( this, featureType || FeatureTypes.HTTP );
	
	this._events = {};
	this.loadFeature = loadFeature;
	this.masterServe = cluster.isMaster && loadFeature.configuration.cores == 1;
}

/**
 * Fires when a web request is made
 * @event HttpFeature#webRequest
 * @type {HttpEvent}
 */

utils.inherits( HttpFeature, ServerFeatureBase );

var __HttpFeature = HttpFeature.prototype;
	__HttpFeature._events;

/**
 * Holds the load feature object
 * @member
 * @protected
 * @readonly
 * @type {ServerLoadFeature}
 */
HttpFeature.prototype.loadFeature;

/**
 * Holds the server object
 * @member
 * @protected
 * @readonly
 * @type {Object}
 */
HttpFeature.prototype.server;

/**
 * Indicates if the master process should serve web request
 * @member
 * @protected
 * @readonly
 * @type {boolean}
 */
HttpFeature.prototype.masterServe;

/*
 * PUBLIC API
 */

HttpFeature.prototype.on = function( eventType, handler, useCapture, priority, useWeakReference ) {
	
	var hadEventListener = this.hasEventListener(eventType);		
	ServerFeatureBase.prototype.on.call( this, eventType, handler, useCapture, priority, useWeakReference );
	if ( this.server && !hadEventListener ) {				
		this.__updateListener(eventType, true);
	}		
}

HttpFeature.prototype.off = function( eventType, handler, useCapture ) {
	
	ServerFeatureBase.prototype.off.call( this, eventType, handler, useCapture );
	if ( this.server && !this.hasEventListener(eventType) ) {
		this.__updateListener(eventType, false);
	}
}
 
/*
 * PROTECTED API
 */
 
HttpFeature.prototype.destroy = function() {
	
	this.stopServer();
	this.loadFeature = undefined;
	ServerFeatureBase.prototype.destroy.call( this, null );
}
 
/**
 * Starts the server to receive requests
 * @method
 * @protected
 */
HttpFeature.prototype.startServer = function() {
	if( this.server || 
		(cluster.isMaster && !this.masterServe) ) return;
		
	this.server = this.createServer( this.getCreateCallback() || delegate(this, this.onRequest) );
	if( this.activeListeners ) { 
		//add listeners
		var i, len = this.activeListeners.length;
		for( i = 0; i < len; i++ )
		{
			this.__updateListener(this.activeListeners[i], true);
		}
	}
	this.serverCreated();
}
 
/**
 * Stops the server from receiving requests
 * @method
 * @protected
 */
HttpFeature.prototype.stopServer = function() {
	
	if( !this.server || 
		(cluster.isMaster && !this.masterServe) ) return;
	
	//remove listeners
	var i, len = this.activeListeners.length;
	for( i = 0; i < len; i++ )
	{
		this.__updateListener(this.activeListeners[i], false);
	}
		
	this.serverDestroy();
	this.server.close();
	this.server = undefined;
}

/**
 * Fires when the server has been created
 * @method
 * @protected
 */
HttpFeature.prototype.serverCreated = function() {
	
}

/**
 * Fires when the server is about to be destroyed
 * @method
 * @protected
 */
HttpFeature.prototype.serverDestroy = function() {
	
}

/**
 * Creates new server object
 * @method
 * @protected
 * @param callback {function} - Callback function to call when request is fired
 */
HttpFeature.prototype.createServer = function( callback ) { 
	
	var server = this.loadFeature.secure ? this.loadFeature.server.createServer( this.getOptions(true), callback ) : 
										   this.loadFeature.server.createServer( callback );
	
	return server.listen.apply( server, this.getListenerInfo() );
}

/**
 * Gets server options
 * @method
 * @protected
 * @param secure {boolean} - Specifies if the options should contain secure properties [key, cert]
 * @returns {object}
 */
HttpFeature.prototype.getOptions = function(secure) {
	return !secure ? {} : { 
							key: fs.readFileSync( this.loadFeature.configuration.tls_key ),
							cert: fs.readFileSync( this.loadFeature.configuration.tls_cert )
						  };
}

/**
 * Returns the callback handler to add to the server create process 
 * @method
 * @protected
 * @returns {object} - The method or instance that should be called 
 */
HttpFeature.prototype.getCreateCallback = function() {
	return undefined;
}

/**
 * Returns listener information like port and or host
 * @method
 * @protected
 * @returns {Array.<Object>} - An array containing arguments to pass to the server listener 
 */
HttpFeature.prototype.getListenerInfo = function() {
	return [Number(this.loadFeature.configuration.port) || 80, this.loadFeature.configuration.host];
}

/**
 * @method
 * @protected
 * @param eventType {String} - Specifies what event type to register the callback to
 * @returns {function} - The method that should be called 
 */
HttpFeature.prototype.getListenerCallBack = function( eventType ) {
	switch( eventType ) {
		case 'connect' : 
			return this.onHTTPConnect;
			break;
		case 'upgrade' : 
			return this.onHTTPUpgrade;
			break;
		default : 
			return;
	}
}

/**
 * Fires when client request http connect method
 * @method
 * @protected
 * @param request {object} - Request object
 * @param response {object} - Response object
 * @param head {object} - Head object
 */
HttpFeature.prototype.onHTTPConnect = function( req, res, head ) {
	this.dispatchEvent( new HttpEvent(HttpEvent.CONNECT, {request:req, response:res, head:head}) );
}

/**
 * Fires when client request http upgrade method
 * @method
 * @protected
 * @param request {object} - Request object
 * @param response {object} - Response object
 * @param head {object} - Head object
 */
HttpFeature.prototype.onHTTPUpgrade = function( req, res, head ) {
	this.dispatchEvent( new HttpEvent(HttpEvent.UPGRADE, {request:req, response:res, head:head}) );
}


/**
 * Fires when a new request is made
 * @method
 * @protected
 * @param request {object} - Request object
 * @param response {object} - Response object
 */
HttpFeature.prototype.onRequest = function( req, res ) {
	this.dispatchEvent( new HttpEvent(HttpEvent.WEB_REQUEST, {request:req, response:res}) );
}

/*
 * PRIVATE API
 */
 
__HttpFeature.__updateListener = function( eventType, add ) {
	
	if( add ) { 
		var callback = this.getListenerCallBack(eventType);
		if( callback ) {
			this._events[eventType] = delegate( this, callback );
			this.server.on( eventType, this._events[eventType] );
		}
	}else{
		if( this._events[eventType] != undefined ) {
			this.server.off( eventType, this._events[eventType] );
			this._events[eventType] = undefined;
		}
	}
}

__HttpFeature = undefined;
module.exports = HttpFeature;