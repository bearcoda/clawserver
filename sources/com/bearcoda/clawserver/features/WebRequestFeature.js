
//ClawServer Classes
var ServerFeatureBase = require('com/bearcoda/clawserver/features/ServerFeatureBase');
var FeatureTypes = require('com/bearcoda/clawserver/features/FeatureTypes');
var WebRequestEvent = require('com/bearcoda/clawserver/events/WebRequestEvent');

//BearCoda Classes
var delegate = require('com/bearcoda/utils/Utilities').delegate;

//NodeJS Classes
var utils = require('util');
var cluster = require('cluster');

/**
 * @class
 * @classdesc WebRequestFeature class serves as a base for handling WebRequestFeature functionality
 * @constructor
 * @extends clawserver/features/ServerFeatureBase
 * @param loaderfeature {ServerLoadFeature} - The server load feature object
 */
var WebRequestFeature = function( loadFeature ) {
	
	//Call constructor with feature type
	ServerFeatureBase.call( this, FeatureTypes.WEB_REQUEST );
	
	this.loadFeature = loadFeature;
	this.masterServe = cluster.isMaster && loadFeature.configuration.cores == 1;
}

/**
 * Fires when a web request is made
 * @event WebRequestFeature#webRequest
 * @type {WebRequestEvent}
 */

utils.inherits( WebRequestFeature, ServerFeatureBase );

/**
 * Holds the load feature object
 * @member
 * @protected
 * @readonly
 * @type {ServerLoadFeature}
 */
WebRequestFeature.prototype.loadFeature;

/**
 * Holds the server object
 * @member
 * @protected
 * @readonly
 * @type {Object}
 */
WebRequestFeature.prototype.server;

/**
 * Indicates if the master process should serve web request
 * @member
 * @protected
 * @readonly
 * @type {boolean}
 */
WebRequestFeature.prototype.masterServe;

/*
 * PROTECTED API
 */
 
WebRequestFeature.prototype.destroy = function() {
	
	this.stopServer();
	this.loadFeature = undefined;
	
	ServerFeatureBase.prototype.destroy.call( this, null );
}
 
/**
 * Starts the server to receive requests
 * @method
 * @protected
 */
WebRequestFeature.prototype.startServer = function() {
	if( this.server || 
		(cluster.isMaster && !this.masterServe) ) return;
		
	this.server = this.createServer( delegate(this, this.onRequest) );
	this.serverCreated();
}
 
/**
 * Stops the server from receiving requests
 * @method
 * @protected
 */
WebRequestFeature.prototype.stopServer = function() {
	
	if( !this.server || 
		(cluster.isMaster && !this.masterServe) ) return;
	
	this.serverDestroy();
	this.server.close();
	this.server = undefined;
}

/**
 * Fires when the server has been created
 * @method
 * @protected
 */
WebRequestFeature.prototype.serverCreated = function() {
	
}

/**
 * Fires when the server is about to be destroyed
 * @method
 * @protected
 */
WebRequestFeature.prototype.serverDestroy = function() {
	
}

/**
 * Creates new server object
 * @method
 * @protected
 * @param callback {function} - Callback function to call when request is fired
 */
WebRequestFeature.prototype.createServer = function( callback ) { 
	
	var server;
	//console.log('createServer: ' + this.loadFeature.secure+' : '+(this.loadFeature.configuration.port || 80)+' : '+(this.loadFeature.configuration.host || 'localhost') );
	if( this.loadFeature.secure ) {
		var options = 
		{
			key: fs.readFileSync( this.loadFeature.configuration.tls_key ),
			cert: fs.readFileSync( this.loadFeature.configuration.tls_cert )
		};
		
		server = this.loadFeature.server.createServer( options, callback ).listen( Number(this.loadFeature.configuration.port) || 80, this.loadFeature.configuration.host );
	}else{
		server = this.loadFeature.server.createServer( callback ).listen( Number(this.loadFeature.configuration.port) || 80, this.loadFeature.configuration.host);
	}
	return server;
}

/**
 * Fires when a new request is made
 * @method
 * @protected
 * @param request {object} - Request object
 * @param response {object} - Response object
 */
WebRequestFeature.prototype.onRequest = function( req, res ) {
	this.dispatchEvent( new WebRequestEvent(WebRequestEvent.WEB_REQUEST, {request:req, response:res}) );
}

module.exports = WebRequestFeature;