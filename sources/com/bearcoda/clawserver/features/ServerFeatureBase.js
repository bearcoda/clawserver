
//BearCoda Classes
var EventDispatcher = require('com/bearcoda/events/EventDispatcher');

//NodeJS Classes
var utils = require("util"); 

/**
 * @class
 * @classdesc Serves as a base class for all feature server features
 * @constructor
 * @abstract
 * @extends events/EventDispatcher
 * @param featureType {string} - The feature type this class holds
 */
var ServerFeatureBase = function( featureType ) {
	EventDispatcher.call( this, this );
	
	//Set feature type
	this.featureType = featureType;
}
utils.inherits( ServerFeatureBase, EventDispatcher );

/**
 * @member
 * @type {string}
 * @description Holds feature type this class holds
 */
ServerFeatureBase.prototype.featureType;

/*
 * PUBLIC API
 */

/**
 * @method
 * @description Make sure to clear out the instance
 */
ServerFeatureBase.prototype.destroy = function() {
	this.featureType = undefined;
}
 
//Add to module
module.exports = ServerFeatureBase;