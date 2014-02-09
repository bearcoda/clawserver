
//ClawServer Classes
var ClawCore = require( 'com/bearcoda/clawserver/core/ClawCore' );
var FeatureTypes = require( 'com/bearcoda/clawserver/features/FeatureTypes' );
var LoadEvent = require( 'com/bearcoda/clawserver/events/LoadEvent' );
//var LoadEvent = require( 'com/bearcoda/clawserver/events/WebRequestEvent' );
var ServerEvent = require( 'com/bearcoda/clawserver/events/ServerEvent' );
var LoadState = require( 'com/bearcoda/clawserver/states/LoadState' );
var ServerStates = require( 'com/bearcoda/clawserver/states/ServerStates' );
var ServerElementBase = require( 'com/bearcoda/clawserver/servers/ServerElementBase' );
var ServerElement = require( 'com/bearcoda/clawserver/servers/ServerElement' );
var ServerConfigurationBase = require( 'com/bearcoda/clawserver/core/ServerConfigurationBase' );
var ServerConfiguration = require( 'com/bearcoda/clawserver/servers/ServerConfiguration' );

//BearCoda Classes
var EventDispatcher = require('com/bearcoda/events/EventDispatcher');
var delegate = require('com/bearcoda/utils/Utilities').delegate;

//NodeJS Classes
var utils = require('util'); 

/**
 * @class 
 * @constructor
 * @extends clawserver/core/ClawCore
 * @classdesc Main ClawServer class
 * @param server {ServerElementBase} - Server element to be used on ClawServer
 */
var ClawServer = function( server ) {
	
	ClawCore.call( this, null );
	
	this._loadStateChange = delegate(this, this.onLoadState);
	if( server ) this.setServer( server );
}

/**
 * Fires when a new server element has been set
 * @event ClawServer#serverChange
 * @type {ServerEvent}
 */
 
/**
 * Fires when the server state has changed
 * @event ClawServer#stateChange
 * @type {ServerEvent}
 */

/**
 * Fires when a web request is made
 * @event ClawServer#webRequest
 * @type {WebRequestEvent}
 */
 
utils.inherits( ClawServer, ClawCore );

/** @private */
var __ClawServer = ClawServer.prototype;
	__ClawServer._loadStateChange;

/**
 * Server's current state
 * @member
 * @readonly
 * @type {string}
 */
ClawServer.prototype.state;

/**
 * Indicates whether the server can load configurations
 * @member
 * @readonly
 * @type {boolean}
 */
ClawServer.prototype.canLoad;

/*
 * PROTECTED API
 */

/**
 * Notfies when a server feature has been changed
 * @method
 * @protected
 * @param featureType {string} - The feature type that was changed
 * @param added {boolean} - Boolean value indicating if the feature was added or removed
 */
ClawServer.prototype.onFeatureChanged = function( featureType, add ) {
	
	ClawCore.prototype.onFeatureChanged.call( this, featureType, add );
	switch (featureType)
	{
		case FeatureTypes.LOAD : 
			this.__changeListeners(add, featureType, LoadEvent.LOAD_STATE_CHANGE, this._loadStateChange );			
			this.canLoad = add;		
			
			if (add) {
				var loadState = this.server.getFeature(featureType).loadState;
				if (loadState != LoadState.READY && loadState != LoadState.LOADING) this.__load();
			}							
			break;
		case FeatureTypes.WEB_REQUEST : 
			// && this.server.getFeature(featureType).loadState == LoadState.READY
			//this.changeListeners(add, featureType, WebRequestEvent.WEB_REQUEST, this._loadStateChange );		
			if( this.canLoad ) {
				if( add ) 
				{
					this.server.getFeature(FeatureTypes.WEB_REQUEST).startServer();
				}else{
					this.server.getFeature(FeatureTypes.WEB_REQUEST).stopServer();
				}
			}
			break;
	}
}

/**
 * Fires when the load feature fires a load state change
 * @method
 * @protected
 * @param event {LoadEvent} - The LoadEvent object
 */
ClawServer.prototype.onLoadState = function( event ) {
	
	if (event.loadState == LoadState.READY && this.state == ServerStates.LOADING) {
		this.processReadyState();
	}else if (event.loadState == LoadState.UNINITIALIZED) {				
		this.setState(ServerStates.UNINITIALIZED);
	}else if (event.loadState == LoadState.ERROR) {
		//this.setState(ServerStates.SERVER_ERROR);
	}else if (event.loadState == LoadState.LOADING) {				
		this.setState(ServerStates.LOADING);
	}	
}

/**
 * Fires when the server has entered into a ready state
 * @method
 * @protected
 */
ClawServer.prototype.processReadyState = function() {
	this.setState(ServerStates.READY);

}

/**
 * Used to set state changes
 * @method
 * @protected
 * @param newState {string} - The new state to set 
 */
ClawServer.prototype.setState = function(newState) {
	
	if (this.state != newState)
	{
		this.state = newState;
		this.dispatchEvent( new ServerEvent(ServerEvent.STATE_CHANGE, this.state) );
		
		if (newState == ServerStates.ERROR)
		{
			/* add code for disabling features */
		}
	}
}

/**
 * Resolves and returns new server elements
 * @method
 * @protected
 * @param value {string} - Any type value to resolve
 */
ClawServer.prototype.resolveServerValue = function( value ) {
	
	//Kill immediately if no value is defined
	if( !value ) return;
	
	var newServer;
	if( value )
	{
		if( value instanceof ServerElementBase ) {
			newServer = value;
		}else if( value instanceof ServerConfigurationBase ) {
			newServer = new ServerElement( new ServerConfiguration(value) );
		}else if( typeof(value) == 'string' )
		{
			try {
				//Check if JSON
				newServer = new ServerElement( new ServerConfiguration(JSON.parse(value)) );
			}catch( e ) {
				//Treat as path
				newServer = new ServerElement( new ServerConfiguration(value) );
			}
		}else if( typeof(value) == 'object' ) {
			newServer = new ServerElement( new ServerConfiguration(value) );
		}
	}
	return newServer;
}

/*
 * GETTER / SETTER
 */
 
/**
 * Setter method used to appropriately set the new server element
 * @method
 * @param serverValue {ServerElementBase|ServerConfigurationBase|JSON|string} - The new server element to set to the ClawServer. Acceptable values can either be elements, configurations, string path, or JSON formatted
 */
ClawServer.prototype.setServer = function( value ) {
	
	if( this.server ) {
		if (this.canLoad) {	 
			var loadFeature = this.server.getFeature(FeatureTypes.LOAD);
			if (loadFeature.loadState == LoadState.READY) loadFeature.unload();
		}
	}
	
	var newServer = this.resolveServerValue(value);
	ClawCore.prototype.setServer.call( this, newServer );
	if( newServer ) {
		if (this.server.hasFeature(FeatureTypes.LOAD) == false) {
			this.processReadyState();
		}
		this.dispatchEvent(new ServerEvent(ServerEvent.SERVER_CHANGE));	
	}
}

/*
 * PRIVATE API
 */

__ClawServer.__load = function()
{
	try
	{
		var loadFeature = this.server.getFeature(FeatureTypes.LOAD);
		if ( loadFeature.loadState != LoadState.LOADING && loadFeature.loadState != LoadState.READY ) loadFeature.load();
	}catch (e) {
		this.setState(ServerStates.ERROR);
		this.dispatchEvent( new ServerEvent(ServerEvent.ERROR, null) );
	}
}
 
__ClawServer.__changeListeners = function(add, featureType, event, handler) {			
	if (add) {
		this.server.getFeature(featureType).on(event, handler, false, 1);
	}else if (this.server.hasFeature(featureType)) {		
		this.server.getFeature(featureType).off(event, handler);
	}		
}

__ClawServer = undefined;
module.exports = ClawServer;