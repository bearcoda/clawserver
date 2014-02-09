
//BearCoda Classes
var EventDispatcher = require('com/bearcoda/events/EventDispatcher');
var TimerEvent = require('com/bearcoda/events/TimerEvent');
var delegate = require('com/bearcoda/utils/Utilities').delegate;

//NodeJS Classes
var util = require('util');

/**
 * @class Timer
 * @extends events/EventDispatcher
 * @classdesc Timer class serves as a stopwatch which fires events at the set delay time
 * @constructor
 * @param delay {number} - The amount of time in milliseconds to wait before firing each sequence
 * @param repeatCount {number} - The amount of sequences that should be fired
 * @example <pre>
	 //import timer class
	 var Timer = require('com/bearcoda/utils/Timer');
	 
	 //Create new timer instance
	 var timeObj = new Timer( 3000, 10 );
	 
	 //Listen for TimerEvent timer call
	 timeObj.on( TimerEvent.TIMER, function()
	 {
		console.log("Tick Toc!");
	 });
	 
	 //Listens for TimerEvent complete call
	 timeObj.on( TimerEvent.TIMER_COMPLETE, function()
	 {
		console.log("Timer Complete!");
	 });
	 
	 //Starts timer
	 timeObj.start();
 </pre>
 */
var Timer = function( delay, repeatCount )
{
	EventDispatcher.call(this, this);
	this.currentCount = 0;
	
	this.delay = delay;
	this.repeatCount = repeatCount || 0;
}

/**
 * Fires when a time sequence has passed
 * @event Timer#timer
 * @type {TimerEvent}
 */
 
 /**
 * Fires when all time sequences have fired
 * @event Timer#timerComplete
 * @type {TimerEvent}
 */

util.inherits(Timer, EventDispatcher);

/**
 * Holds the current count of times the sequence has fired 
 * @member 
 * @type {number}
 */
Timer.prototype.currentCount;

/**
 * Holds a boolean value to show if the clock is running
 * @member 
 * @type {boolean}
 */
Timer.prototype.running;

/**
 * Holds a delay count value measured in milliseconds
 * @member 
 * @type {number}
 */
Timer.prototype.delay;

/**
 * Holds the repeat count value
 * @member 
 * @type {number}
 */
Timer.prototype.repeatCount;

	
var __Timer = Timer.prototype;
	__Timer._intervalID;
	
/*
 * PUBLIC API
 */

/**
 * @method
 * @description Resets timer sequence
 */
Timer.prototype.reset = function()
{
	this.currentCount = 0;
}

/**
 * @method
 * @param autoReset {boolean} - Tells the timer if it should reset the time sequence if already started
 * @description Starts timing sequence
 */
Timer.prototype.start = function( autoReset )
{
	autoReset = autoReset || false;
	if ( this._intervalID != null || this.delay == null ) return;
	
	if ( this.repeatCount == this.currentCount && this.repeatCount > 0 && autoReset ) this.currentCount = 0;
	this._intervalID = setInterval( delegate(this, this.__intervalReached), this.delay );
}

/**
 * @method
 * @description Stops the timing sequence
 */
Timer.prototype.stop = function()
{
	if ( this._intervalID == null ) return;
	clearInterval(_intervalID);
	this._intervalID = null;
	
}

/*
 * PROTECTED API
 */

__Timer.__intervalReached = function()
{
	++this.currentCount;
	if ( this.repeatCount > 0 && this.currentCount == this.repeatCount )
	{
		this.__timerCompleted();
	}else{
		this.dispatchEvent( new TimerEvent(TimerEvent.TIMER) );
	}
}

__Timer.__timerCompleted = function()
{
	this.stop();
	this.dispatchEvent( new TimerEvent(TimerEvent.TIMER_COMPLETE) );
}

__Timer.__refreshRate = function()
{
	if ( this._intervalID == null ) return;
	this.stop();
	this.start();
}

/*
 * GETTER / SETTER API
 */

/**
 * @method
 * @param delay {number} - delay value
 * @description Sets the time delay value
 */
Timer.prototype.setDelay = function( value )
{
	if ( this.delay == value ) return;
	
	this.delay = value;
	this.__refreshRate();
}

/**
 * @method
 * @param repeatCount {number} - repeat count value
 * @description Sets the repeat count value
 */
Timer.prototype.setRepeatCount = function( value )
{
	if ( this.repeatCount == value ) return;
	
	this.repeatCount = value < 0 ? 0 : value;
	if ( this.repeatCount >= this.currentCount && this.repeatCount > 0 ) this.__timerCompleted();
}

module.exports = Timer;
__Timer = undefined;
