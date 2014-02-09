
//BearCoda Classes
var EventDispatcher = require('com/bearcoda/events/EventDispatcher');

//ClawServer Classes
var LoadEvent = require('com/bearcoda/clawserver/events/LoadEvent');
var LoadStates = require('com/bearcoda/clawserver/states/LoadState');

//NodeJS Classes
var utils = require('util'); 

/**
 * @class 
 * @constructor
 * @extends events/EventDispatcher
 * @classdesc Serves as the base class for loading utility objects
 */
var LoaderBase = function() {
	EventDispatcher.call( this, this );
}

/**
 * Fires when the load state has changed
 * @event LoaderBase#loadStateChange
 * @type {LoadEvent}
 */

utils.inherits( LoaderBase, EventDispatcher );

/*
 * PUBLIC API
 */

/**
 * Starts the loading process
 * @method
 * @param loadFeature {LoadFeature} - A instance of the LoadFeature Class
 */
LoaderBase.prototype.load = function( loadFeature ) {
	if( this.checkLoad(loadFeature) ) {
		this.doLoadOperation(loadFeature);
	}
}

/**
 * Starts the unloading process
 * @method
 * @param loadFeature {LoadFeature} - A instance of the LoadFeature Class
 */
LoaderBase.prototype.unload = function( loadFeature ) {
	if( this.checkUnload(loadFeature) ) {
		this.doUnloadOperation(loadFeature);
	}
}

/**
 * Checks if the configuration object is compatible with this loader
 * @method
 * @param {ServerConfigurationBase} configuration - The configuration object to check
 * @returns {boolean}
 */
LoaderBase.prototype.canHandleConfiguration = function( config ) {
	return false;
}

/*
 * PROTECTED API
 */

/**
 * Checks to see if it is safe to start the load operation
 * @method
 * @protected
 * @param loadFeature {LoadFeature} - A instance of the LoadFeature Class
 * @returns {boolean}
 */
LoaderBase.prototype.checkLoad = function( loadFeature ) {
	return loadFeature.loadState == LoadStates.UNINITIALIZED || 
	       loadFeature.loadState == LoadStates.ERROR;
}
 
/**
 * Checks to see if it is safe to start the unload operation
 * @method
 * @protected
 * @param loadFeature {LoadFeature} - A instance of the LoadFeature Class
 * @returns {boolean}
 */
LoaderBase.prototype.checkUnload = function( loadFeature ) {
	return loadFeature.loadState != LoadStates.UNLOADING && 
		   loadFeature.loadState != LoadStates.UNINITIALIZED;
}

/**
 * Starts the load operation
 * @method
 * @protected
 * @param loadFeature {LoadFeature} - A instance of the LoadFeature Class
 */
LoaderBase.prototype.doLoadOperation = function( loadFeature ) {
	
}

/**
 * Starts the unload operation
 * @method
 * @protected
 * @param loadFeature {LoadFeature} - A instance of the LoadFeature Class
 */
LoaderBase.prototype.doUnloadOperation = function( loadFeature ) {
	
}

/**
 * Updates the loadState of the LoadFeature
 * @method
 * @protected
 * @param newState {string} - the new load state to update
 * @param loadFeature {LoadFeature} - A instance of the LoadFeature Class
 */
LoaderBase.prototype.fireStateChange = function( newState, loadFeature ) {
	//If change then go ahead and fire event
	if (newState != loadFeature.loadState)
	{
		var oldState = loadFeature.loadState;
		this.dispatchEvent(new LoadEvent(LoadEvent.LOAD_STATE_CHANGE, {
																			loadState: newState,
																			oldState: oldState,
																			loader: this,
																			loadFeature: loadFeature
																		  }));
	}
}

module.exports = LoaderBase;