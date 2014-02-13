

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
 * The proxy configuration paths for automatically redirecting requests to other servers and/or ports. Holds an array of objects which should each hold 3 properties. 
 * The first is the <b>host</b> which is the request host or path to detect. The the second is <b>fowardHost</b> which is the host to redirect the request to. Defaults 
 * to localhost if it is not provided. The third is <b>forwardPort</b> which is the port to forward the requests to. This defaults to port 80 if not provided.
 * @member
 * @type {Array.<object>}
 * @example <pre><code>//Import ClawServer API
 * var clawserverAPI = require('ClawServerAPI');
 * 
 * //Create options for proxy server [Note:Do not provided host]
 * var options = {
 * 		port: 80,
 * 		proxyPaths: [
 * 		{
 * 			host:"sub1.myCustomDomain.com",
 * 			forwardHost: "myCustomDomain2.com"
 * 		},
 * 		{
 * 			host:"sub2.myCustomDomain.com",
 * 			forwardPort: 8080
 * 		}]
 * 	}
 * //Create proxy configuration instance and assign options
 * var ProxyConfiguration = clawserverAPI.require('clawserver/servers/proxyserverclasses/ProxyConfiguration');
 * var configuration = new ProxyConfiguration(options);
 * ...
 * </code></pre>
 */
ProxyConfiguration.prototype.proxyPaths = null;

module.exports = ProxyConfiguration;