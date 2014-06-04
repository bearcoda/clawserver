
//ClawServer Classes
var StaticConfiguration = require('com/bearcoda/clawserver/config/StaticConfiguration');

//NodeJS Classes
var utils = require('util');

/**
 * @class
 * @classdesc Handles configurations settings for express server
 * @constructor
 * @extends clawserver/config/StaticConfiguration
 * @param data {object|string} - Data to pass into the configuration. String types will be treated as a path to a JSON formatted file.
 */
var ExpressConfiguration = function( data ) {
	
	StaticConfiguration.call( this, data );
}

utils.inherits( ExpressConfiguration, StaticConfiguration );
module.exports = ExpressConfiguration;