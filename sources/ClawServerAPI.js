/* 
 * @author Joebear
 */
 
/**
 * @class
 * @classdesc Servers as the main ClawServer API utility class
 * @abstract
 */
var ClawServerAPI = function() {};

/**
 * Creates a new ClawServer instance and sets the server element/configuration value passed in.
 * @static
 * @param serverValue {ServerElementBase|ServerConfigurationBase|JSON|string} - The new server element to set to the ClawServer. Acceptable values can either be elements, configurations, string path, or JSON formatted
 */
ClawServerAPI.createServer = function( value ) { return new clawserver.require('clawserver/core/ClawServer')(value);}

/**
 * Imports classes from the ClawServer API
 * @static
 * @param classPath {string} - The path of the class you want to load in
 * @returns {object} - Returns target class
 */
ClawServerAPI.require = function( path ) {
	return require( 'com/bearcoda/' + path );
}

module.exports = ClawServerAPI;