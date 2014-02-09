//BearCoda Classes
var Event = require('com/bearcoda/events/Event');

//NodeJS Classes
var utils = require("util"); 

/**
 * @class  
 * @classdesc namespace - com/bearcoda/clawserver/events/LoadEvent<br>Used for loading events
 * @constructor
 * @extends events/Event
 * @param type {string} - The event type to be passed to listeners
 * @param loadState {Object} - This data object contains info on load state changes (loadState|oldState|loader|loadFeature)
 * @param bubbles {boolean} - A boolean value indicating if the event should fire down across listeners. Defaults to false
 * @param cancelable {boolean} - A boolean value indicating if the event chain be canceled. Defaults to false
 */
var LoadEvent = function( type, data, bubbles, cancelable ) {
	
	Event.call( this, type, data, bubbles, cancelable );
	
	//Fill in the blanks :P
	this.loadState = data.loadState; 	this.oldState = data.oldState;
	this.loader = data.loader; 			this.loadFeature = data.loadFeature;
}

utils.inherits( LoadEvent, Event );

/**
 * Holds the constant value used for the load state change event
 * @static
 * @constant
 * @type {string}
 */
LoadEvent.LOAD_STATE_CHANGE = 'loadStateChange';

/**
 * Holds the constant value used for the load state change event when it is coming from a LoaderBase
 * @static
 * @constant
 * @type {string}
 */
LoadEvent.LOADER_STATE_CHANGE = 'loaderStateChange';

/**
 * Holds the loadState value that changed
 * @member
 * @readonly
 * @type {string}
 */
LoadEvent.prototype.loadState;

/**
 * Holds the old loadState value that changed [Only for loader state events]
 * @member
 * @readonly
 * @type {string}
 */
LoadEvent.prototype.oldState;

/**
 * Holds the loader base instance which fired the change call
 * @member
 * @readonly
 * @type {LoaderBase}
 */
LoadEvent.prototype.loader;

/**
 * Holds the load feature which owns the state value
 * @member
 * @readonly
 * @type {LoadFeature}
 */
LoadEvent.prototype.loadFeature;

/*
 * PUBLIC API
 */

/**
 * Clones the event object
 * @method
 * @returns newLoadEvent {LoadEvent} - The new load event that was cloned
 */
LoadEvent.prototype.clone = function() {
	return new LoadEvent( this.type, this.data, this.bubbles, this.cancelable );
}

module.exports = LoadEvent;