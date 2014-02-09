//BearCoda Classes
var Event = require('com/bearcoda/events/Event');

//NodeJS Classes
var utils = require('util'); 

/**
 * @class  
 * @classdesc Used for web request events
 * @constructor
 * @extends events/Event
 * @param type {string} - The event type to be passed to listeners
 * @param loadState {Object} - This data object contains info on load state changes (request|response)
 * @param bubbles {boolean} - A boolean value indicating if the event should fire down across listeners. Defaults to false
 * @param cancelable {boolean} - A boolean value indicating if the event chain be canceled. Defaults to false
 */
var WebRequestEvent = function( type, data, bubbles, cancelable ) {
	
	Event.call( this, type, data, bubbles, cancelable );
	
	//Fill in the blanks :P
	this.request = data.request;
	this.response = data.response;
}

utils.inherits( WebRequestEvent, Event );

/**
 * Holds the constant value used for the load state change event
 * @static
 * @constant
 * @type {string}
 */
WebRequestEvent.WEB_REQUEST = 'webRequest';


/**
 * Holds the loadState value that changed
 * @member
 * @readonly
 * @type {string}
 */
WebRequestEvent.prototype.request;

/**
 * Holds the old loadState value that changed [Only for loader state events]
 * @member
 * @readonly
 * @type {string}
 */
WebRequestEvent.prototype.response;

/**
 * Holds the loader base instance which fired the change call
 * @member
 * @readonly
 * @type {LoaderBase}
 */
WebRequestEvent.prototype.server;

/*
 * PUBLIC API
 */

/**
 * Clones the event object
 * @method
 * @returns newWebRequestEvent {ServerElementEvent} - The new web request event that was cloned
 */
WebRequestEvent.prototype.clone = function() {
	return new WebRequestEvent( this.type, this.data, this.bubbles, this.cancelable );
}

module.exports = WebRequestEvent;