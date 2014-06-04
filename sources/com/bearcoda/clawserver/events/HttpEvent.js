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
var HttpEvent = function( type, data, bubbles, cancelable ) {
	
	Event.call( this, type, data, bubbles, cancelable );
	
	//Fill in the blanks :P
	this.request = data.request;
	this.response = data.response;
	this.head = data.head;
}

utils.inherits( HttpEvent, Event );

/**
 * Holds the constant value used for http connect
 * @static
 * @constant
 * @type {string}
 */
HttpEvent.CONNECT = 'connect';

/**
 * Holds the constant value used for http upgrade
 * @static
 * @constant
 * @type {string}
 */
HttpEvent.UPGRADE = 'upgrade';

/**
 * Holds the constant value used for the http requests
 * @static
 * @constant
 * @type {string}
 */
HttpEvent.WEB_REQUEST = 'webRequest';


/**
 * Holds the instance of the node IncomingMessage class
 * @member
 * @readonly
 * @type {http.IncomingMessage}
 */
HttpEvent.prototype.request;

/**
 * Holds the instance of the node ServerResponse class
 * @member
 * @readonly
 * @type {http.ServerResponse}
 */
HttpEvent.prototype.response;

/**
 * Holds the call head
 * @member
 * @readonly
 * @type {object}
 */
HttpEvent.prototype.head;

/**
 * Holds the loader base instance which fired the change call
 * @member
 * @readonly
 * @type {LoaderBase}
 */
HttpEvent.prototype.server;

/*
 * PUBLIC API
 */

/**
 * Clones the event object
 * @method
 * @returns newHttpEvent {ServerElementEvent} - The new web request event that was cloned
 */
HttpEvent.prototype.clone = function() {
	return new HttpEvent( this.type, this.data, this.bubbles, this.cancelable );
}

module.exports = HttpEvent;