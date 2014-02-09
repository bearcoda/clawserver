
//ClawServer Classes
var ServerFeatureBase = require('com/bearcoda/clawserver/features/ServerFeatureBase');
var FeatureTypes = require('com/bearcoda/clawserver/features/FeatureTypes');
var LoadEvent = require('com/bearcoda/clawserver/events/LoadEvent');
var LoadState = require('com/bearcoda/clawserver/states/LoadState');

//BearCoda Classes
var delegate = require('com/bearcoda/utils/Utilities').delegate;

//NodeJS Classes
var utils = require('util'); 

/**
 * @class
 * @classdesc LoadFeature class serves as a base for handling events coming from loading objects. This is mainly for use with the server element classes
 * @constructor
 * @extends clawserver/features/ServerFeatureBase
 * @param loader {LoaderBase} - The loader object
 * @param configuration {ServerConfigurationBase} - The configuration object
 */
var LoadFeature = function( loader, config ) {
	
	//Call constructor with feature type
	ServerFeatureBase.call( this, FeatureTypes.LOAD );
	
	this.loadState = LoadState.UNINITIALIZED;
	
	this.configuration = config;
	this._loader = loader;
	
	if (this._loader) this._loader.on(LoadEvent.LOAD_STATE_CHANGE, delegate(this, this.__onLoadStateChange), false, 9999);
}

/**
 * Fires when the load state has changed
 * @event LoadFeature#loadStateChange
 * @type {LoadEvent}
 */

utils.inherits( LoadFeature, ServerFeatureBase );

/**
 * Holds the configuration value for this feature
 * @member
 * @type {ServerConfigurationBase}
 * @readonly
 */
LoadFeature.prototype.configuration;

/**
 * Holds the load state value for this feature
 * @member
 * @type {ServerConfigurationBase}
 * @readonly
 */
LoadFeature.prototype.loadState;


/** @private */
var __LoadFeature = LoadFeature.prototype;
	__LoadFeature._loader;
	

/*
 * PUBLIC API
 */

/**
 * Signals loader to start load process
 * @method
 */
LoadFeature.prototype.load = function() {
	if (this._loader)
	{
		if (this.loadState == LoadState.READY)
		{
			console.log('##Error#:Cannot repeat load in ready state. Unload first!#' );
		}
		if (this.loadState == LoadState.LOADING)
		{
			console.log('##Error#:Cannot repeat load in load state!#' );
		}else{
			this._loader.load(this);
		}
	}
}

/**
 * Signals loader to start unload process
 * @method
 */
LoadFeature.prototype.unload = function() {
	if (this._loader)
	{	
		if (this.loadState == LoadState.UNLOADING)
		{
			console.log('##Error#:Already unloading!#' );
		}
		if (this.loadState == LoadState.UNINITIALIZED)
		{
			console.log('##Error#:What the heck are you doing? It is already unloaded!#' );
		}
		this._loader.unload(this);
	}
}

/*
 * PROTECTED API
 */

/**
 * Fires when a new state is going to be set
 * @method
 * @protected
 * @param newState {string} - The new state that will replace the old
 */
LoadFeature.prototype.loadStateChangeStart = function( newState ) {
	
}

/**
 * Fires when a new state has been set
 * @method
 * @protected
 * @param loadState {string} - The load state to set
 */
LoadFeature.prototype.loadStateChangeEnd = function() {
	this.dispatchEvent(new LoadEvent(LoadEvent.LOAD_STATE_CHANGE, {loadState:this.loadState}));
}

/**
 * Appropriately sets the loadState property
 * @method
 * @protected
 * @param loadState {string} - The load state to set
 */
LoadFeature.prototype.setLoadState = function( value ) {
	if( value != this.loadState ) {
		this.loadStateChangeStart(value);
		this.loadState = value;
		this.loadStateChangeEnd();
	}
}

/*
 * PRIVATE API
 */

__LoadFeature.__onLoadStateChange = function( event )
{
	if ( event.loadFeature == this ) this.setLoadState( event.loadState );
}
 
__LoadFeature = undefined;
module.exports = LoadFeature;
