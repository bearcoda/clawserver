//BearCoda Classes
var Event = require('com/bearcoda/events/Event');

//NodeJS Classes
var utils = require("util"); 

/**
 * @class  
 * @classdesc Used for socket events
 * @constructor
 * @extends events/Event
 * @param type {string} - The event type to be passed to listeners
 * @param data {Object} - This data object contains info on socket events (stream|)
 * @param bubbles {boolean} - A boolean value indicating if the event should fire down across listeners. Defaults to false
 * @param cancelable {boolean} - A boolean value indicating if the event chain be canceled. Defaults to false
 */
var SocketEvent = function( type, data, bubbles, cancelable ) {
	
	Event.call( this, type, data, bubbles, cancelable );
	
	//Fill in the blanks :P
	this.stream = data.stream; this.socket = data.socket;
}

utils.inherits( SocketEvent, Event );

/**
 * Holds the constant value used for socket connection event
 * @member
 * @type {Stream}
 */
SocketEvent.prototype.stream;

/**
 * Holds the constant value used for socket connection event
 * @member
 * @type {Socket}
 */
SocketEvent.prototype.socket;

/**
 * Holds the constant value used for socket connection event
 * @static
 * @constant
 * @type {string}
 */
SocketEvent.CONNECTION = 'connection';

/**
 * Holds the constant value used for socket disconnection event
 * @static
 * @constant
 * @type {string}
 */
SocketEvent.DISCONNECT = 'disconnect';

/**
 * Holds the constant value used for socket calls event
 * @static
 * @constant
 * @type {string}
 */
SocketEvent.CALL = 'call';

/*
 * PUBLIC API
 */

/**
 * Clones the event object
 * @method
 * @returns newSocketEvent {SocketEvent} - The new load event that was cloned
 */
SocketEvent.prototype.clone = function() {
	return new SocketEvent( this.type, this.data, this.bubbles, this.cancelable );
}

module.exports = SocketEvent;