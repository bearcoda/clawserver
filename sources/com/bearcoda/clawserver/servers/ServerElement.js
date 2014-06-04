
//ClawServer Classes
var ServerElementBase = require('com/bearcoda/clawserver/servers/ServerElementBase');
var FeatureTypes = require('com/bearcoda/clawserver/features/FeatureTypes');
var ServerLoadFeature = require('com/bearcoda/clawserver/features/ServerLoadFeature');
var ClusterFeature = require('com/bearcoda/clawserver/features/ClusterFeature');
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
var ServerElement = function( config, loader ) {
	
	ServerElementBase.call( this, null );
	this._stateChangeEvent = delegate(this, this.__onLoadStateChanged);
	
	this.loader = loader;
	this.setConfiguration(config);
}

utils.inherits( ServerElement, ServerElementBase );

/**
 * Holds the loader value
 * @member
 * @readonly
 * @type {LoaderBase}
 */
ServerElement.prototype.loader;

/** @private */
var __LoadableServer = ServerElement.prototype;
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
ServerElement.prototype.createLoadFeature = function( config, loader ) {
	return new ServerLoadFeature( loader, config );
}

/**
 * Fires when the loader is in the loading state
 * @method
 * @protected
 */
ServerElement.prototype.processLoadingState = function() {
	
}

/**
 * Fires when the loader is in the ready state
 * @method
 * @protected
 */
ServerElement.prototype.processReadyState = function() {
	
	//By default all loadable servers should have cluster support
	var loadFeature = this.getFeature(FeatureTypes.LOAD);
	if( loadFeature instanceof ServerLoadFeature ) this.addFeature(FeatureTypes.CLUSTER, new ClusterFeature(loadFeature) );
}

/**
 * Fires when the loader is in the unloading state
 * @method
 * @protected
 */
ServerElement.prototype.processUnloadingState = function() {
	this.removeFeature(FeatureTypes.CLUSTER);
}

/*
 * PRIVATE API
 */

__LoadableServer.__updateLoadFeature = function() {
	
	var loadFeature = this.getFeature(FeatureTypes.LOAD);
	if (loadFeature) {
		
		if (loadFeature.loadState == LoadState.READY) loadFeature.unload();
		
		loadFeature.off( LoadEvent.LOAD_STATE_CHANGE, this._stateChangeEvent );
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
ServerElement.prototype.setConfiguration = function( value ) {
	ServerElementBase.prototype.setConfiguration.call(this, value);
	this.__updateLoadFeature();
}

/**
 * Appropriately sets a new loader value
 * @method
 * @param newLoader {LoaderBase} - The new loader value to set
 */
ServerElement.prototype.setLoader = function( value ) {
	this.loader = value;
}

__LoadableServer = undefined;
module.exports = ServerElement;