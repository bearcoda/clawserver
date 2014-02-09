
//ClawServer Classes
var ServerConfigurationBase = require('com/bearcoda/clawserver/core/ServerConfigurationBase');

//NodeJS Classes
var utils = require('util');

/**
 * @class
 * @classdesc The main class to handle server configurations
 * @constructor
 * @extends clawserver/core/ServerConfigurationBase
 * @param data {object|string} - Data to pass into the configuration. String types will be treated as a path to a JSON formatted file.
 */
var ServerConfiguration = function( data ) {
	
	ServerConfigurationBase.call( this, data );
}

utils.inherits( ServerConfiguration, ServerConfigurationBase );

/**
 * Host to listen on
 * @member
 * @type {string}
 * @readonly
 */
ServerConfiguration.prototype.host = null;

/**
 * Port to listen on
 * @member
 * @type {string}
 * @readonly
 */
ServerConfiguration.prototype.port = null;

/**
 * The maximum number of cores to activate on this server
 * @member
 * @type {number}
 * @readonly
 */
ServerConfiguration.prototype.cores = null;

/**
 * The path to the tls key to load
 * @member
 * @type {string}
 * @readonly
 */
ServerConfiguration.prototype.tls_key = null;

/**
 * The path to the tls certificate to load
 * @member
 * @type {string}
 * @readonly
 */
ServerConfiguration.prototype.tls_cert = null;

/**
 * Boolean value indicating if tls SNI should be activated
 * @member
 * @type {boolean}
 * @readonly
 */
ServerConfiguration.prototype.tls_sni = null;

module.exports = ServerConfiguration;