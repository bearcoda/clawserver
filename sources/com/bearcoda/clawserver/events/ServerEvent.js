//BearCoda Classes
var Event = require('com/bearcoda/events/Event');

//NodeJS Classes
var utils = require('util'); 

/**
 * @class  
 * @classdesc Used for server events
 * @constructor
 * @extends events/Event
 * @param type {string} - The event type to be passed to listeners
 * @param data {Object} - This data object contains general info on states
 * @param bubbles {boolean} - A boolean value indicating if the event should fire down across listeners. Defaults to false
 * @param cancelable {boolean} - A boolean value indicating if the event chain be canceled. Defaults to false
 */
var ServerEvent = function( type, data, bubbles, cancelable ) {
	Event.call( this, type, data, bubbles, cancelable );
}

utils.inherits( ServerEvent, Event );

/**
 * Holds the constant value used for the server state change event
 * @static
 * @constant
 * @type {string}
 */
ServerEvent.STATE_CHANGE = 'stateChange';

/**
 * Holds the constant value used for the server web request events
 * @static
 * @constant
 * @type {string}
 */
ServerEvent.WEB_REQUEST = 'webRequest';

/**
 * Holds the constant value used for the server element change event
 * @static
 * @constant
 * @type {string}
 */
ServerEvent.SERVER_CHANGE = 'serverChange';

/*
 * PUBLIC API
 */

/**
 * Clones the event object
 * @method
 * @returns newServerEvent {ServerEvent} - The new server event that was cloned
 */
ServerEvent.prototype.clone = function() {
	return new ServerEvent( this.type, this.data, this.bubbles, this.cancelable );
}

module.exports = ServerEvent;