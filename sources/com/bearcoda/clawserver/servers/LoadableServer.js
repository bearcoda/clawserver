
//ClawServer Classes
var ServerElementBase = require('com/bearcoda/clawserver/servers/ServerElementBase');
var FeatureTypes = require('com/bearcoda/clawserver/features/FeatureTypes');
var LoadFeature = require('com/bearcoda/clawserver/features/LoadFeature');
var LoadEvent = require('com/bearcoda/clawserver/events/LoadEvent');
var LoadState = require('com/bearcoda/clawserver/states/LoadState');

//BearCoda Classes
var delegate = require('com/bearcoda/utils/Utilities').delegate;

//NodeJS Classes
var utils = require('util');

/**
 * @class
 * @classdesc Serves as the base class for loadable servers
 * @constructor
 * @extends clawserver/servers/ServerElementBase
 * @param configuration {ServerConfigurationBase} - The configuration object
 * @param loader {LoaderBase} - The loader object
 */
var LoadableServer = function( config, loader ) {
	
	ServerElementBase.call( this, null );
	this._stateChangeEvent = delegate(this, this.__onLoadStateChanged);
	
	this.loader = loader;
	this.setConfiguration(config);
}

utils.inherits( LoadableServer, ServerElementBase );

/**
 * Holds the loader value
 * @member
 * @readonly
 * @type {LoaderBase}
 */
LoadableServer.prototype.loader;

/** @private */
var __LoadableServer = LoadableServer.prototype;
	__LoadableServer._stateChangeEvent;

/*
 * PROTECTED API
 */
 
/**
 * Creates and returns a new load feature
 * @method
 * @protected
 * @param configuration {ServerConfigurationBase} - The configuration object
 * @param loader {LoaderBase} - The loader object
 * @returns {LoadFeature}
 */
LoadableServer.prototype.createLoadFeature = function( config, loader ) {
	return new LoadFeature( loader, config );
}

/**
 * Fires when the loader is in the loading state
 * @method
 * @protected
 */
LoadableServer.prototype.processLoadingState = function() {
	
}

/**
 * Fires when the loader is in the ready state
 * @method
 * @protected
 */
LoadableServer.prototype.processReadyState = function() {
	
}

/**
 * Fires when the loader is in the unloading state
 * @method
 * @protected
 */
LoadableServer.prototype.processUnloadingState = function() {
	
}

/*
 * PRIVATE API
 */

__LoadableServer.__updateLoadFeature = function() {
	
	var loadFeature = this.getFeature(FeatureTypes.LOAD);
	if (loadFeature) {
		
		if (loadFeature.loadState == LoadState.READY) loadFeature.unload();
		
		loadTrait.off( LoadEvent.LOAD_STATE_CHANGE, this._stateChangeEvent );
		this.removeFeature(FeatureTypes.LOAD);
	}
	
	if (this.loader) {
		loadFeature = this.createLoadFeature(this.configuration, this.loader);
		loadFeature.on( LoadEvent.LOAD_STATE_CHANGE, this._stateChangeEvent, false, 10 );
		this.addFeature(FeatureTypes.LOAD, loadFeature);
	}
}

__LoadableServer.__onLoadStateChanged = function( event ) {
	
	if ( event.loadState == LoadState.LOADING ) {
		this.processLoadingState();
	}else if ( event.loadState == LoadState.READY ) {
		this.processReadyState();
	}else if ( event.loadState == LoadState.UNLOADING ) {
		this.processUnloadingState();
	}
}

/*
 * GETTER / SETTER
 */
 
/**
 * Appropriately sets a new configuration value
 * @method
 * @param newConfiguration {ServerConfigurationBase} - The new configuration value to set
 */
LoadableServer.prototype.setConfiguration = function( value ) {
	ServerElementBase.prototype.setConfiguration.call(this, value);
	this.__updateLoadFeature();
}

/**
 * Appropriately sets a new loader value
 * @method
 * @param newLoader {LoaderBase} - The new loader value to set
 */
LoadableServer.prototype.setLoader = function( value ) {
	this.loader = value;
}

__LoadableServer = undefined;
module.exports = LoadableServer;