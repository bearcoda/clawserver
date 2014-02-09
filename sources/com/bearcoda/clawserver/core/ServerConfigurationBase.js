
//BearCoda Classes
var EventDispatcher = require('com/bearcoda/events/EventDispatcher');
var Event = require('com/bearcoda/events/Event');
var delegate = require('com/bearcoda/utils/Utilities').delegate;

//NodeJS Classes
var utils = require('util');
var fs = require("fs");

/**
 * @class 
 * @constructor
 * @extends events/EventDispatcher
 * @classdesc Serves as the base class for configuration settings
 * @param data {object|string} - Data to pass into the configuration. String types will be treated as a path to a JSON formatted file.
 */
var ServerConfigurationBase = function( data ) {
	
	EventDispatcher.call( this, this );
	this.ready = false;
	
	if( data )
	{
		if( typeof(data) == 'string' ) {
			this.load(data);
		}else{
			this.processData(data);
		}
	}
}

/**
 * Fires when the configuration settings have been loaded
 * @event ServerConfigurationBase#ready
 * @type {Event}
 */

utils.inherits( ServerConfigurationBase, EventDispatcher );


/** 
 * Let's you know if the configurations are loaded and ready to use
 * @member
 * @readonly
 * @type {Boolean}
 */
ServerConfigurationBase.prototype.ready;

/** @private */
__ServerConfigurationBase = ServerConfigurationBase.prototype;

/*
 * PUBLIC API
 */

/**
 * @method
 * @param path {string} - Path to a JSON formatted file to load
 */
ServerConfigurationBase.prototype.load = function( path ) { 
	
	//Load server configuration
	fs.readFile( path, "UTF-8", delegate(this, this.__onConfigLoaded) );
}

/*
 * PROTECTED API
 */

/**
 * Processes the data that was loaded into the configuration
 * @method
 * @protected
 * @param data {object} - The data to be processed
 */
ServerConfigurationBase.prototype.processData = function( data ) {
	
	var i;
	for( i in data ){
		//console.log('processData:  ' + i +' : '+ (i in this)+' : '+this.hasOwnProperty(i));
		//Had to use is because only one that can detect props but they must have a null value to be detected :/
		if( i in this ) {
			this[i] = data[i];
		}else{
			this.resolveDataProperty( i, data[i] );
		}
	}
	this.dataReady();
}

/**
 * Fires when data processor can't find property to assign data to
 * @method
 * @protected
 * @param slot {string} - The data slot to be processed
 * @param data {object} - The data to be processed
 */
ServerConfigurationBase.prototype.resolveDataProperty = function( slot, data ) { 
	
}

/**
 * Fires when data has been processed and ready to use
 * @method
 * @protected
 */
ServerConfigurationBase.prototype.dataReady = function() { 
	this.ready = true;
	this.dispatchEvent( new Event(Event.READY) );
}

/*
 * PRIVATE API
 */

__ServerConfigurationBase.__onConfigLoaded = function( error, data ) {
	if( data ) this.processData(JSON.parse(data));
}

__ServerConfigurationBase.__hasOwnProperty = function(obj, prop) {
    var proto = obj.__proto__ || obj.constructor.prototype;
    return (prop in obj) &&
        (!(prop in proto) || proto[prop] !== obj[prop]);
}

__ServerConfigurationBase = undefined;
module.exports = ServerConfigurationBase;