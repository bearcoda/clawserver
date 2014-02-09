
//BearCoda Classes
var Event = require('com/bearcoda/events/Event');
var delegate = require('com/bearcoda/utils/Utilities').delegate;

//ClawServer Classes
var LoadFeature = require('com/bearcoda/clawserver/features/LoadFeature');

//NodeJS Classes
var utils = require('util'); 

/**
 * @class
 * @classdesc ServerLoadFeature class handles server load functionality
 * @constructor
 * @extends clawserver/features/LoadFeature
 * @param loader {LoaderBase} - The loader object
 * @param configuration {ServerConfigurationBase} - The configuration object
 */
var ServerLoadFeature = function( loader, config ) {
	
	LoadFeature.call( this, loader, config );
	
	this._configLoadHandlerEvent = delegate( this, this.__onConfigLoaded );
	config.on( Event.READY,  this._configLoadHandlerEvent )
}

utils.inherits( ServerLoadFeature, LoadFeature );

var __ServerLoadFeature = ServerLoadFeature.prototype;
	__ServerLoadFeature._configLoadHandler;
	__ServerLoadFeature._loadCalled;

/**
 * Holds server object to use
 * @member
 * @type {object}
 * @readonly
 */
ServerLoadFeature.prototype.server;

/**
 * Indicates if the connection is secure
 * @member
 * @type {boolean}
 * @readonly
 */
ServerLoadFeature.prototype.secure;

/*
 * PRIVATE API
 */
 
__ServerLoadFeature.load = function() {
	if( this.configuration && !this._loadCalled ) {
		if( this.configuration.ready ) {
			LoadFeature.prototype.load.call( this, null );
		}else{
			this._loadCalled = true;
		}
	}
}

__ServerLoadFeature.unload = function() {
	
	if( this._loadCalled ) {
		this._loadCalled = false;
	}else{
		LoadFeature.prototype.unload.call( this, null );
	}
}

__ServerLoadFeature.__onConfigLoaded = function( event ) { 
	if( this._loadCalled ) { 
		this._loadCalled = false;
		this.load();
	}
}
 
__ServerLoadFeature = undefined;
module.exports = ServerLoadFeature;