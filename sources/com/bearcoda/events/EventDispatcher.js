
//BearCoda Classes
var EventPhase = require("com/bearcoda/events/EventPhase");

/*
 * INIT API
 */

/** 
 * @class
 * @classdesc Same as NodeJS EventEmitter which is awesome but wanted to port this over for a bit more control of events
 * @constructor
 * @param target {object} - Original target firing off event
 * @example <pre>
 //load EventDispatcher dependence
 var EventDispatcher = require("com/bearcoda/events/EventDispatcher");
 var Event = require("com/bearcoda/events/Event");
 
 //load utils class to inherit
 var util = require("util");
 
 //create new class
 var someClass = function()
 {
	EventDispatcher.call(this, this);
 }
 
 //inherit from EventDispatcher
 utils.inherit( someClass, EventDispatcher )
 
 //Manually call event
 someClass.prototype.callEvent = function()
 {
	this.dispatchEvent(new Event("customEvent"));
 }
 
 var mySomeInstance = new someClass();
 
 //listen to event
 mySomeInstance.on( "customEvent", function( event )
 {
	console.log("what is this event? " + event.type );
 });
 
 //fire event
 mySomeInstance.callEvent();</pre>
 */
var EventDispatcher = function( target )
{
	this._listenerCount = 0;
	this._eventTarget = target == null ? this : target;
}

/**
 * @member
 * @type {Array.<string>}
 * @description Holds event types that are being listened to
 */
EventDispatcher.prototype.activeListeners;

var __EventDispatcher = EventDispatcher.prototype;
	__EventDispatcher._listenerCount;
	__EventDispatcher._eventListeners;
	__EventDispatcher._eventTarget;

/*
 * STATIC API
 */

EventDispatcher.__getHandlerIndex = function( eventList, handler, useCapture )
{
	useCapture = useCapture || false;
	var handlerIndex = NaN;
	if ( eventList != null ) 
	{
		var i = 0;
		var nLen = eventList.length;
		for ( i = 0; i < nLen; i++ ) 
		{
			if (eventList[i].isListener(handler,useCapture)) 
			{
				handlerIndex = i;
				break;
			}
		}
	}
	return handlerIndex;
}

EventDispatcher.__updateActiveListeners = function( eventType, listeners, add )
{
	if( listeners == null ) return (!add ? listeners : [eventType]);
	
	var i = listeners.length;
	while ( --i > -1 )
	{
		if( listeners[i] == eventType )
		{
			if( !add ) listeners.splice( i, 1 );
			return listeners;
		}
	}
	
	if( add ) listeners.push( eventType );
	return listeners;
}

EventDispatcher.__compareListeners = function( l1, l2 )
{
	return l1.priority == l2.priority?(l1.orderIndex<l2.orderIndex?-1:1):(l1.priority>l2.priority? -1:1);
}

/*
 * PUBLIC API
 */

/**
 * @method
 * @param type {string} - The event type to listen to
 * @param handler {function} - The handler that should be called when the event is fired
 * @param useCapture {boolean} - Indicates if the event should fire in capture mode only
 * @param priority {number} - Sets the listener priority level. Smaller values places callback higher up the call list
 * @description Register a listener to an event type
 */
EventDispatcher.prototype.on = function( eventType, handler, useCapture, priority, useWeakReference )
{
	//defaults
	useCapture = useCapture || false;
	priority = priority || 0;
	useWeakReference = useWeakReference || false;
	
	if ( this._eventListeners == null ) this._eventListeners = {};
	if ( this._eventListeners[eventType] == undefined ) this._eventListeners[eventType] = new Array();
	
	var aListeners = this._eventListeners[eventType];
	if ( !isNaN(EventDispatcher.__getHandlerIndex(aListeners, handler))) return;
	
	//Update listeners list
	this.activeListeners = EventDispatcher.__updateActiveListeners( eventType, this.activeListeners, true );
	
	//Add new handler
	aListeners.push(new EventListener(handler, priority, this._listenerCount, useCapture));
	this._listenerCount++;
}

/**
 * @method
 * @param type {string} - The event type
 * @param handler {function} - The handler used when the listener registered the event
 * @param useCapture {boolean} - Indicates if the event was using capture mode
 * @description Unregister a listener to an event type
 */
EventDispatcher.prototype.off = function( eventType, handler, useCapture )
{
	if ( this._eventListeners == null ) return;
	
	//defaults
	useCapture = useCapture || false;
	
	var aListeners = this._eventListeners[eventType];
	var handlerIndex = EventDispatcher.__getHandlerIndex(aListeners, handler);
	if ( isNaN(handlerIndex)) return;
	
	aListeners.splice(handlerIndex, 1);
	this.activeListeners = EventDispatcher.__updateActiveListeners( eventType, this.activeListeners, false );
}
 
/**
 * @method
 * @param type {string} - The event type
 * @description Checks to see if event type has listeners
 * @returns {boolean}
 */
EventDispatcher.prototype.hasEventListener = function( eventType )
{
	return (this.numEventListeners(eventType)>0);
}

/**
 * @method
 * @param type {string} - The event type
 * @description Checks to see the amount of listeners registered to the event
 * @returns {number}
 */
EventDispatcher.prototype.numEventListeners = function( eventType )
{
	return this._eventListeners == null || this._eventListeners[eventType] == undefined ? 0 : this._eventListeners[eventType].length;
}

/**
 * @method
 * @param event {Event} - The event being dispatched
 * @description Dispatch and event from the target
 */
EventDispatcher.prototype.dispatchEvent = function( event )
{
	if ( this._eventListeners == null || this._eventListeners[event.type] == undefined ) return false;
	if ( event.target == null ) event.target = this._eventTarget;
	event.currentTarget = this;
	return this.__dispatchQueue(event);
}

/*
 * PROTECTED API
 */

__EventDispatcher.__dispatchQueue = function( eventObj )
{
	var i = 0; var listener = null;
	var capture = eventObj.eventPhase == EventPhase.CAPTURING_PHASE;
	var eventList = this._eventListeners[eventObj.type].sort(EventDispatcher.__compareListeners);
	
	while ( i < eventList.length )
	{
		listener = eventList[i];
		if ( listener.useCapture == capture )
		{
			//Call handler
			listener.dispatchEvent(eventObj);
			
			//Stop calls if event propagation is called
			if ( eventObj.isImmediatePropagationStopped ) break;
		}
		
		if( i < eventList.length && listener != eventList[i] )
		{
			
		}else{
			i++;
		}
	}
	return !eventObj.isDefaultPrevented;
}

/*
 * __PRIVATE__
 */

var EventListener = function( handler, priority, orderIndex, useCapture )
{
	this.handler = handler;
	this.priority = priority || 0;
	this.useCapture = useCapture || false;
	this.orderIndex = orderIndex;
}

EventListener.prototype.handler;
EventListener.prototype.priority;
EventListener.prototype.useCapture;
EventListener.prototype.orderIndex;

EventListener.prototype.isListener = function( handler, capture )
{
	capture = capture || false;
	return this.handler == handler && this.useCapture == capture;
}

EventListener.prototype.dispatchEvent = function( event )
{
	this.handler(event);
}

module.exports = EventDispatcher;
__EventDispatcher = undefined;