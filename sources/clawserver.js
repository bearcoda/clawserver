/**
 * @author Joebear
 */
 
/**
 * @class
 * @classdesc [deprecated] Servers as the main ClawServer API utility class. (use new clawserver API now since this class is deprecated)
 * @abstract
 * @version 0.2
 */
var ClawServerAPI = function() {};

/**
 * [deprecated] Creates a new ClawServer instance and sets the server element/configuration value passed in. 
 * @static
 * @param serverType {string} - The server type to create. Note this option is optional and if you want the default server this argument can be omitted.
 * @param serverValue {ServerElementBase|ServerConfigurationBase|JSON|string} - The new server element to set to the ClawServer. Acceptable values can either be elements, configurations, string path, or JSON formatted
 */
ClawServerAPI.createServer = function() 
{
	var value, ClawServer = ClawServerAPI.require('com/bearcoda/clawserver/core/ClawServer');
	if( arguments.length > 1 ) {
		var ConfigClass, ElementClass; 
		switch( arguments[0] ) {
			case 'proxy' :
				ConfigClass = ClawServerAPI.require('com/bearcoda/clawserver/servers/proxyserverclasses/ProxyConfiguration');
				ElementClass = ClawServerAPI.require('com/bearcoda/clawserver/servers/ProxyServer');
				break;
			case 'socket' : 
				ConfigClass = ClawServerAPI.require('com/bearcoda/clawserver/servers/ServerConfiguration');
				ElementClass = ClawServerAPI.require('com/bearcoda/clawserver/servers/SocketServer');
				break;
			case 'static' : 
				ConfigClass = ClawServerAPI.require('com/bearcoda/clawserver/config/StaticConfiguration');
				ElementClass = ClawServerAPI.require('com/bearcoda/clawserver/servers/StaticServer');
				break;
			case 'express' : 
				ConfigClass = ClawServerAPI.require('com/bearcoda/clawserver/config/StaticConfiguration');
				ElementClass = ClawServerAPI.require('com/bearcoda/clawserver/servers/ExpressServer');
				break;
			case 'socket.io' : 
				ConfigClass = ClawServerAPI.require('com/bearcoda/clawserver/servers/ServerConfiguration');
				ElementClass = ClawServerAPI.require('com/bearcoda/clawserver/servers/SocketIOServer');
				break;
			case 'express.io' : 
				ConfigClass = ClawServerAPI.require('com/bearcoda/clawserver/config/StaticConfiguration');
				ElementClass = ClawServerAPI.require('com/bearcoda/clawserver/servers/ExpressIOServer');
				break;
		}
		value = ElementClass != undefined ? new ElementClass(new ConfigClass(arguments[1])) : arguments[0];
	}else{
		value = arguments[0];
	}
	return new ClawServer(value);
}

/**
 * [deprecated] Imports classes from the ClawServer API
 * @static
 * @param classPath {string} - The path of the class you want to load in
 * @returns {object} - Returns target class
 */
ClawServerAPI.require = function( path ) {
	//return require( 'com/bearcoda/' + path );
}

module.exports = function() {
	return ClawServerAPI.createServer.apply( ClawServerAPI, arguments );
}