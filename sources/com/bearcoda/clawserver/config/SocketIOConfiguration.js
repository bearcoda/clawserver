
//ClawServer Classes
var ServerConfiguration = require('com/bearcoda/clawserver/servers/ServerConfiguration');

//NodeJS Classes
var utils = require('util');

/**
 * @class
 * @classdesc Handles configurations settings socket io server
 * @constructor
 * @extends clawserver/servers/ServerConfiguration
 * @param data {object|string} - Data to pass into the configuration. String types will be treated as a path to a JSON formatted file.
 */
var SocketIOConfiguration = function( data ) {
	
	ServerConfiguration.call( this, data );
}

utils.inherits( SocketIOConfiguration, ServerConfiguration );

/**
 * Determines the socket IO instance to connect to
 * @member
 * @type {object}
 */
SocketIOConfiguration.prototype.instance = null;

module.exports = SocketIOConfiguration;