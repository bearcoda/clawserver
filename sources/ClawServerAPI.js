/**
 * @author Joebear
 */
 
/**
 * @class
 * @classdesc Servers as the main ClawServer API utility class
 * @abstract
 * @version 0.1.1
 */
var ClawServerAPI = function() {};

/**
 * Creates a new ClawServer instance and sets the server element/configuration value passed in.
 * @static
 * @param serverType {string} - The server type to create. Note this option is optional and if you want the default server this argument can be omitted.
 * @param serverValue {ServerElementBase|ServerConfigurationBase|JSON|string} - The new server element to set to the ClawServer. Acceptable values can either be elements, configurations, string path, or JSON formatted
 */
ClawServerAPI.createServer = function() 
{
	var value, ClawServer = ClawServerAPI.require('clawserver/core/ClawServer');
	if( arguments.length > 1 ) {
		var configClass, elementClass; 
		switch( arguments[0] ) {
			case 'proxy' :
				configClass = ClawServerAPI.require('clawserver/servers/proxyserverclasses/ProxyConfiguration');
				elementClass = ClawServerAPI.require('clawserver/servers/ProxyServer');
				value = new elementClass(new configClass(arguments[1]));
				break;
			default :
				value = arguments[0];
				break;
		}
	}else{
		value = arguments[0];
	}
	return new ClawServer(value);
}

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