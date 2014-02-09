
//ClawServer Classes
var LoaderBase = require('com/bearcoda/clawserver/loaders/LoaderBase');
var LoadStates = require('com/bearcoda/clawserver/states/LoadState');

//NodeJS Classes
var utils = require('util'); 

/**
 * @class 
 * @constructor
 * @extends clawserver/loaders/LoaderBase
 * @classdesc Serves as the base class for loading serves
 */
var ServerLoader = function() {
	
	//Loader base
	LoaderBase.call( this, null );
}

utils.inherits( ServerLoader, LoaderBase );

/**
 * Specifies whether the connection should be secure
 * @member
 * @readonly
 * @type {boolean}
 */
ServerLoader.prototype.isSecure;

/*
 * PUBLIC API
 */

ServerLoader.prototype.canHandleConfiguration = function( config ) {
	return config.port != undefined && config.host != undefined;
}
 
/*
 * PROTECTED API
 */

/**
 * Checks for and returns the server object to create
 * @method
 * @protected
 * @param {LoadFeature} loadFeature - the target loadFeature to use
 * @returns {object} newServerObj - The server object
 */
ServerLoader.prototype.createServer = function( loadFeature ) {
	return this.isSecure ? require('https') : require('http'); 
}

/**
 * Called when the loader enters into a ready state
 * @method
 * @protected
 * @param {object} newServerObj - The server object
 * @param {LoadFeature} loadFeature - the loadFeature
 */
ServerLoader.prototype.serverReady = function( server, loadFeature ) {
	
	//Assign server to load feature
	loadFeature.server = server;
	loadFeature.secure = this.isSecure;
	
	this.fireStateChange( LoadStates.READY, loadFeature );
}
 
ServerLoader.prototype.doLoadOperation = function( loadFeature ) {
	
	this.fireStateChange( LoadStates.LOADING, loadFeature );
	
	this.isSecure = loadFeature.configuration.tls_key != undefined || loadFeature.configuration.pfx != undefined;
	
	//Go ahead and create server then send ready call
	this.serverReady( this.createServer(loadFeature), loadFeature );
}

ServerLoader.prototype.doUnloadOperation = function( loadFeature ) {
	
	this.fireStateChange( LoadStates.UNLOADING, loadFeature );
	
	loadFeature.destroy();
	loadFeature.server = undefined;
	
	this.fireStateChange( LoadStates.UNINTIALIZED, loadFeature );
}
 
module.exports = ServerLoader;