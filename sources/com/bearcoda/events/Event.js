
//BearCoda Classes
var EventPhase = require('com/bearcoda/events/EventPhase');

/**
 * @class  
 * @classdesc Used as a data container for event calls
 * @constructor
 * @param type {string} - The event type to be passed to listeners
 * @param data {object} - The data this event contains
 * @param bubbles {boolean} - A boolean value indicating if the event should fire down across listeners. Defaults to false
 * @param cancelable {boolean} - A boolean value indicating if the event chain be canceled. Defaults to false
 */
var Event = function( type, data, bubbles, cancelable )
{
	this.isDefaultPrevented = false;
	this.isImmediatePropagationStopped = false;
	this.isPropagationStopped = false;
	
	this.eventPhase = EventPhase.AT_TARGET;
	
	this.type = type;
	this.data = data;
	this.bubbles = bubbles || false;
	this.cancelable = cancelable || false;
}

/**
 * @static
 * @type {string}
 * @description Used for state event changes
 */
Event.STATE = 'state';

/**
 * @static
 * @type {string}
 * @description Used for ready event changes
 */
Event.READY = 'ready';


/**
 * @member
 * @type {string}
 * @description Holds the type of the event
 */
Event.prototype.type;

/**
 * @member
 * @type {object}
 * @description Holds any extra data this event contains
 */
Event.prototype.data;

/**
 * @member
 * @type {boolean}
 * @description Holds a boolean value indicating if the event should fire down across listeners. Defaults to false
 */
Event.prototype.bubbles;

/**
 * @member
 * @type {boolean}
 * @description Holds a boolean value indicating if the event chain be canceled. Defaults to false
 */
Event.prototype.cancelable;

/**
 * @member
 * @type {number}
 * @description Holds the event phase value
 */
Event.prototype.eventPhase;

/**
 * @member
 * @type {object}
 * @description Holds original object that fired the event
 */
Event.prototype.target;

/**
 * @member
 * @type {object}
 * @description Holds the most recent target to fire the event
 */
Event.prototype.currentTarget;

/**
 * @member
 * @type {boolean}
 * @description Holds a boolean value indicating that default functionality should be prevented
 */
Event.prototype.isDefaultPrevented;

/**
 * @member
 * @type {boolean}
 * @description Holds a boolean value that prevents the event immediately from continuing in the event tree cycle
 */
Event.prototype.isImmediatePropagationStopped;

/**
 * @member
 * @type {boolean}
 * @description Holds a boolean value that prevents the event from continuing in the event tree cycle
 */
Event.prototype.isPropagationStopped;
	
/*
 * PUBLIC API
 */

/**
 * @method
 * @param phase {number} - New phase value to set
 * @description Set event phase value 
 */
Event.prototype.setPhase = function( phase )
{
	this.eventPhase = phase;
}
 
/**
 * @method
 * @description Prevents the event from carrying out its default functionality
 */
Event.prototype.preventDefault = function()
{
	this.isDefaultPrevented = true;
}

/**
 * @method
 * @description Prevents the event immediately from continuing in the event tree cycle
 */
Event.prototype.stopImmediatePropagation = function()
{
	if( !this.cancelable ) return;
	this.isImmediatePropagationStopped = true;
}

/**
 * @method
 * @description Prevents the event from continuing in the event tree cycle
 */
Event.prototype.stopPropagation = function()
{
	if( !this.cancelable ) return;
	this.isPropagationStopped = true;
}

/**
 * @method
 * @description Returns a clone of the event
 * @returns newEvent {Event} - The event object to clone
 */
Event.prototype.clone = function()
{	
	return new Event(this.type, this.data, this.bubbles, this.cancelable);
}

module.exports = Event;