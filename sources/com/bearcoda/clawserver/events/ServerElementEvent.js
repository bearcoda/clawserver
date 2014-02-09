
//BearCoda Classes
var Event = require('com/bearcoda/events/Event');

//NodeJS Classes
var utils = require('util'); 

/**
 * @class  
 * @classdesc namespace - com/bearcoda/clawserver/events/ServerElementEvent<br>Used for events coming from the server elements
 * @constructor
 * @extends events/Event
 * @param type {string} - The event type to be passed to listeners
 * @param data {object} - This data object contains the properties (featureType|dataSlot|dataValue) which populate depending on fired event
 * @param bubbles {boolean} - A boolean value indicating if the event should fire down across listeners. Defaults to false
 * @param cancelable {boolean} - A boolean value indicating if the event chain be canceled. Defaults to false
 */
var ServerElementEvent = function( type, data, bubbles, cancelable ) {
	Event.call( this, type, data, bubbles, cancelable );
}

utils.inherits( ServerElementEvent, Event );

/**
 * This constant is used for the ServerElementEvent event when a feature has been added to the server Element
 * @static
 * @constant
 * @type {string}
 */
ServerElementEvent.FEATURE_ADD = 'featureAdd';

/**
 * This constant is used for the ServerElementEvent event when a feature has been removed from the server Element
 * @static
 * @constant
 * @type {string}
 */
ServerElementEvent.FEATURE_REMOVE = 'featureRemove';

/**
 * This constant is used for the ServerElementEvent event when data has been added to the server element
 * @static
 * @constant
 * @type {string}
 */
ServerElementEvent.DATA_ADD = 'dataAdd';

/**
 * This constant is used for the ServerElementEvent event when data has been removed from the server element
 * @static
 * @constant
 * @type {string}
 */
ServerElementEvent.Data_REMOVE = 'dataRemove';

/*
 * PUBLIC API
 */

/**
 * Clones the event object
 * @method
 * @returns newServerElementEvent {ServerElementEvent} - The new server element event that was cloned
 */
ServerElementEvent.prototype.clone = function() {
	return new ServerElementEvent( this.type, this.data, this.bubbles, this.cancelable );
}

module.exports = ServerElementEvent;