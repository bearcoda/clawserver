
//BearCoda Classes
var Event = require("com/bearcoda/events/Event");

//NodeJS Classes
var util = require('util');

/*
 * INIT API
 */

/**
 * @class
 * @extends events/Event
 * @constructor
 * @classdesc The used for time based events. See [Timer]{@link Timer.html} class for more details
 * @param type {string} - The event type to be passed to listeners
 * @param data {object} - The data this event contains
 * @param bubbles {boolean} - A boolean value indicating if the event should fire down across listeners. Defaults to false
 * @param cancelable {boolean} - A boolean value indicating if the event chain be canceled. Defaults to false
 */
var TimerEvent = function( type, data, bubbles, cancelable ) 
{
	Event.call( this, type, data, bubbles, cancelable );
}
util.inherits(TimerEvent, Event);

/**
 * @static
 * @type {string}
 * @description Event type used when a timed sequence is fired
 */
TimerEvent.TIMER = 'timer';

/**
 * @static
 * @type {string}
 * @description Event type used when all timed sequences have fired
 */
TimerEvent.TIMER_COMPLETE = 'timerComplete';

/*
 * PUBLIC API
 */

/**
 * @method
 * @returns newTimerEvent {TimerEvent} - The new timer event that was cloned
 * @description Event type used when all timed sequences have fired
 */
TimerEvent.prototype.clone = function() 
{
	return new TimerEvent( this.type, this.data, this.bubbles, this.cancelable );
}

module.exports = TimerEvent;