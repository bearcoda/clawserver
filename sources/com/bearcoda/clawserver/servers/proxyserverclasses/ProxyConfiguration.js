

//ClawServer Classes
var ServerConfiguration = require('com/bearcoda/clawserver/servers/ServerConfiguration');

//NodeJS Classes
var utils = require('util');

/**
 * @class
 * @classdesc Handles configurations settings for proxy servers elements
 * @constructor
 * @extends clawserver/servers/ServerConfiguration
 * @param data {object|string} - Data to pass into the configuration. String types will be treated as a path to a JSON formatted file.
 */
var ProxyConfiguration = function( data ) {
	
	ServerConfiguration.call( this, data );
}

utils.inherits( ProxyConfiguration, ServerConfiguration );

/**
 * The proxy configuration paths are for automatically redirecting requests to other servers and/or ports. Holds an array of objects which should each hold 3 properties. 
 * The first is one of two options, <b>host</b> which is the request host to detect or <b>path</b> which is the path to detect. The the second property is <b>fowardHost</b> 
 * which is the host to redirect the request to. Defaults to localhost if it is not provided. The third property is <b>forwardPort</b> which is the port to forward the requests 
 * to. This defaults to port 80 if not provided.<br><b>Note: If you are detecting sub-domains then do not set a host in the main options. Keep in mind that you will need to configure
 * your server settings to allow connections to the sub-domains or ports you want your server to detect.</b>
 * @member
 * @type {Array.<object>}
 * @example <pre><code>
 * 
 * //Create options for proxy server
 * var options = {
 * 		port: 80,
 * 		proxyPaths: [
 * 		{
 * 			host:"sub1.myCustomDomain.com",
 * 			forwardHost: "myCustomDomain2.com"
 * 		},
 * 		{
 * 			path:"/myCustomWeb",
 * 			forwardPort: 8080
 * 		}]
 * 	}
 * //Create proxy configuration instance and assign options
 * var ProxyConfiguration = require('com/bearcoda/clawserver/servers/proxyserverclasses/ProxyConfiguration');
 * var configuration = new ProxyConfiguration(options);
 * ...
 * </code></pre>
 */
ProxyConfiguration.prototype.proxyPaths = null;

/**
 * Specifies whether to allow websocket forward
 * @member
 * @type {Boolean}
 */
ProxyConfiguration.prototype.websockets = true;

module.exports = ProxyConfiguration;