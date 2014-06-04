
//ClawServer Classes
var FeatureTypes = require( 'com/bearcoda/clawserver/features/FeatureTypes' );
var LoadEvent = require( 'com/bearcoda/clawserver/events/LoadEvent' );
var ServerElementEvent = require( 'com/bearcoda/clawserver/events/ServerElementEvent' );
var HttpEvent = require( 'com/bearcoda/clawserver/events/HttpEvent' );
var SocketEvent = require( 'com/bearcoda/clawserver/events/SocketEvent' );

//BearCoda Classes
var EventDispatcher = require('com/bearcoda/events/EventDispatcher');
var Event = require('com/bearcoda/events/Event');
var delegate = require('com/bearcoda/utils/Utilities').delegate;

//NodeJS Classes
var utils = require('util'); 

/**
 * @class 
 * @constructor
 * @extends events/EventDispatcher
 * @abstract
 * @classdesc Serves as the base class for the ClawServer
 */
var ClawCore = function() {
	
	EventDispatcher.call( this, this );
	
	this._featureAddEvent = delegate( this, this.__onFeatureAdd );
	this._featureRemoveEvent = delegate( this, this.__onFeatureRemove );
	this._redispatch = delegate( this, this.__redispatchEvent );
	
	//Map out events
	this.eventMaps = {};
	this.eventMaps[LoadEvent.LOAD_STATE_CHANGE] = FeatureTypes.LOAD;
	
	//HTTP events
	this.eventMaps[HttpEvent.CONNECT] = FeatureTypes.HTTP;
	this.eventMaps[HttpEvent.UPGRADE] = FeatureTypes.HTTP;
	this.eventMaps[HttpEvent.WEB_REQUEST] = FeatureTypes.HTTP;
	
	//Socket events
	this.eventMaps[SocketEvent.CONNECTION] = FeatureTypes.SOCKET;
	this.eventMaps[SocketEvent.DISCONNECT] = FeatureTypes.SOCKET;
	this.eventMaps[SocketEvent.CALL] = FeatureTypes.SOCKET;
}

utils.inherits( ClawCore, EventDispatcher );

var __ClawCore = ClawCore.prototype;
	__ClawCore._featureAddEvent;
	__ClawCore._featureRemoveEvent;
	__ClawCore._redispatch;

/**
 * Holds the server element value
 * @member
 * @readonly
 * @type {ServerElementBase}
 */
ClawCore.prototype.server;

/**
 * Holds event Map values
 * @member
 * @protected
 * @readonly
 * @type {Object}
 */
ClawCore.prototype.eventMaps;


/*
 * PUBLIC API
 */

ClawCore.prototype.on = function( eventType, handler, useCapture, priority, useWeakReference ) {
	
	var hadEventListener = this.hasEventListener(eventType), 
		featureType = this.__getEventFeatureType(eventType);
	
	EventDispatcher.prototype.on.call( this, eventType, handler, useCapture, priority, useWeakReference );
	if ( this.server && !hadEventListener && featureType != undefined ) {				
		this.__changeCoreListeners(true, featureType, eventType);	
	}		
}

ClawCore.prototype.off = function( eventType, handler, useCapture ) {
	
	EventDispatcher.prototype.off.call( this, eventType, handler, useCapture );
	var featureType = this.__getEventFeatureType(eventType);
	if ( this.server && !this.hasEventListener(eventType) && featureType != undefined ) this.__changeCoreListeners(false, featureType, eventType);
}

/*
 * PROTECTED API
 */

ClawCore.prototype.onFeatureChanged = function( featureType, add ) {
	
	switch (featureType)
	{
		case FeatureTypes.LOAD : 
			this.__changeCoreListeners(add, featureType, LoadEvent.LOAD_STATE_CHANGE);
			break;
		case FeatureTypes.HTTP : 
			this.__changeCoreListeners(add, featureType, HttpEvent.CONNECT);
			this.__changeCoreListeners(add, featureType, HttpEvent.UPGRADE);
			this.__changeCoreListeners(add, featureType, HttpEvent.WEB_REQUEST);
			break;
		case FeatureTypes.SOCKET :
			this.__changeCoreListeners(add, featureType, SocketEvent.CONNECTION);
			this.__changeCoreListeners(add, featureType, SocketEvent.DISCONNECT);
			this.__changeCoreListeners(add, featureType, SocketEvent.CALL);
		case "socket.io" :
			this.__changeCoreListeners(add, featureType, SocketEvent.CONNECTION);
			this.__changeCoreListeners(add, featureType, SocketEvent.DISCONNECT);
			this.__changeCoreListeners(add, featureType, SocketEvent.CALL);
	}
}
 
/*
 * PRIVATE API
 */

__ClawCore.__getEventFeatureType = function(eventType) { 
	return this.eventMaps[eventType] == FeatureTypes.SOCKET && 
		   this.server && 
		   this.server.hasFeature('socket.io') ? 'socket.io' : this.eventMaps[eventType]
}

__ClawCore.__onFeatureAdd = function(event) {				
	this.onFeatureChanged(event.data, true);				
}

__ClawCore.__onFeatureRemove = function(event) {
	this.onFeatureChanged(event.data, false);						
}

__ClawCore.__changeCoreListeners = function(add, featureType, event)
{
	if (this.server.hasFeature(featureType))
	{		
		if (add && this.hasEventListener(event)) {						
			this.server.getFeature(featureType).on(event, this._redispatch);
		}else{												
			this.server.getFeature(featureType).off(event, this._redispatch);
		}
	}			
}

__ClawCore.__redispatchEvent = function( event ) {
	this.dispatchEvent( event instanceof Event ? event.clone() : event );
}
 
/*
 * GETTER / SETTER
 */

/**
 * Assigns the server element object to the ClawServer
 * @method
 * @param server {ServerElementBase} - The Server element to assign to the ClawServer
 */
ClawCore.prototype.setServer = function( value ) {
	
	var featureType, featureTypes, i, nLen;
	if( this.server ) {
		this.server.off( ServerElementEvent.FEATURE_ADD, this._featureAddEvent );
		this.server.off( ServerElementEvent.FEATURE_REMOVE, this._featureRemoveEvent );
		
		featureTypes = this.server.featureTypes();
		nLen = featureTypes.length;
		
		for (i = 0; i < nLen; i++)
		{
			this.onFeatureChanged(featureTypes[i], false);
		}
	}
	
	this.server = value;
	if( this.server ) {
		this.server.on( ServerElementEvent.FEATURE_ADD, this._featureAddEvent );
		this.server.on( ServerElementEvent.FEATURE_REMOVE, this._featureRemoveEvent );
		
		featureTypes = this.server.featureTypes();
		nLen = featureTypes.length;
		
		for (i = 0; i < nLen; i++)
		{
			this.onFeatureChanged(featureTypes[i], true);
		}
	}
}

__ClawCore = undefined;
module.exports = ClawCore;