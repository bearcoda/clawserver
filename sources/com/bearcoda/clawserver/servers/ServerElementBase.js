
//ClawServer Classes
var ServerElementEvent = require('com/bearcoda/clawserver/events/ServerElementEvent');

//BearCoda Classes
var EventDispatcher = require('com/bearcoda/events/EventDispatcher');
var ArrayUtils = require('com/bearcoda/utils/ArrayUtils');

//NodeJS Classes
var utils = require('util');

/**
 * The base class for all server element classes
 * @class
 * @classdesc Serves as a base class for all server elements
 * @constructor
 * @extends events/EventDispatcher
 */
var ServerElementBase = function() {
	EventDispatcher.call( this, this );
	
	this._features = {};
	this._featureTypes = [];
	
	this.setupFeatures();
}

/**
 * Fires when a feature has been added
 * @event ServerElementBase#featureAdd
 * @type {ServerElementEvent}
 */
 
/**
 * Fires when a feature has been removed
 * @event ServerElementBase#featureRemove
 * @type {ServerElementEvent}
 */

utils.inherits( ServerElementBase, EventDispatcher );

/**
 * Holds additional information about the server element
 * @member
 * @readonly
 * @type {object}
 */
ServerElementBase.prototype.serverData;

/**
 * Holds configuration info for this server element
 * @member
 * @readonly
 * @type {object}
 */
ServerElementBase.prototype.configuration;

/** @private */
var __ServerElementBase = ServerElementBase.prototype;
	__ServerElementBase._features;
	__ServerElementBase._featureTypes;

/*
 * PUBLIC API
 */
 
/**
 * Adds data to the server element
 * @method
 * @param PropertyName {string} - The property slot to add the data to
 * @param Value {object} - The value to add
 */
ServerElementBase.prototype.addData = function( propName, value ) {
	
}

/**
 * Removes data to the server element
 * @method
 * @param PropertyName {string} - The property slot to remove the data from
 */
ServerElementBase.prototype.removeData = function( propName ) {
	
}

/**
 * Returns the data slots that have an assigned value
 * @method
 * @returns {Array.<string>} - An Array containing the data keys
 */
ServerElementBase.prototype.dataKeys = function() {
	
}

/**
 * Adds data to the server element
 * @method
 * @param featureType {string} - The type of feature to check if it exists
 * @returns {boolean}
 */
ServerElementBase.prototype.hasFeature = function( featureType ) {
	return this._features[featureType] != undefined;
}

/**
 * Adds data to the server element
 * @method
 * @param featureType {string} - The type of feature to search for
 * @returns {ServerFeatureBase}
 */
ServerElementBase.prototype.getFeature = function( featureType ) {
	return this._features[featureType];
}

/**
 * Returns all the features registered to the server element
 * @method
 * @returns {Array.<string>}
 */
ServerElementBase.prototype.featureTypes = function() {
	return ArrayUtils.copy(this._featureTypes);
}

/*
 * PROTECTED API
 */

/**
 * Creates server data object
 * @method
 * @protected
 */
ServerElementBase.prototype.createDataObj = function() {
	this.serverData = {};
}

/**
 * Setup features for the element
 * @method
 * @protected
 */
ServerElementBase.prototype.setupFeatures = function() {
	
}

/**
 * Add a feature to the server element
 * @method
 * @protected
 * @param featureType {string} - Feature to add
 * @param feature {ServerFeatureBase} - The feature value
 */
ServerElementBase.prototype.addFeature = function( featureType, value ) {
	
	if( !value || this.hasFeature(featureType) || value.featureType != featureType ) return;
	this.setLocalFeature(featureType, value);
	
	//Maybe update list
}

/**
 * Remove a feature from the server element
 * @method
 * @protected
 * @param featureName {string} - Feature to remove
 */
ServerElementBase.prototype.removeFeature = function( featureType ) {
	if( !this.hasFeature(featureType) ) return;
	this.setLocalFeature(featureType);
}

/**
 * Remove a feature from the server element
 * @method
 * @protected
 * @param featureType {string} - The feature to add/remove
 * @param feature {ServerFeatureBase} - If value is non-null then will add, else if null then will remove feature from passed in type.
 */
ServerElementBase.prototype.setLocalFeature = function( type, value ) {
	
	var currentFeature = this._features[type];
	if( !value )
	{
		this._featureTypes.splice(ArrayUtils.indexOf(this._featureTypes, type), 1);
		
		currentFeature.destroy();
		delete this._features[type];
		
		this.dispatchEvent(new ServerElementEvent(ServerElementEvent.FEATURE_REMOVE, type));
	}
	
	if (!currentFeature && value) {
		this._features[type] = currentFeature = value;
		this._featureTypes.push(type);
		
		// Signal addition:
		this.dispatchEvent(new ServerElementEvent(ServerElementEvent.FEATURE_ADD, type));
	}
}

/*
 * PRIVATE API
 */
 
//Future use
 
/*
 * GETTER / SETTER
 */
 
/**
 * Sets the configuration value for the server element
 * @method
 * @param configuration {ServerConfig} - An instance of the ServerConfig Class
 */
ServerElementBase.prototype.setConfiguration = function( value ) {
	this.configuration = value;
}

__ServerElementBase = undefined;
module.exports = ServerElementBase;