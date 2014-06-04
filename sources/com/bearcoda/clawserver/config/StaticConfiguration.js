
//ClawServer Classes
var ServerConfiguration = require('com/bearcoda/clawserver/servers/ServerConfiguration');

//NodeJS Classes
var utils = require('util');

/**
 * @class
 * @classdesc Handles configurations settings static file serving servers
 * @constructor
 * @extends clawserver/servers/ServerConfiguration
 * @param data {object|string} - Data to pass into the configuration. String types will be treated as a path to a JSON formatted file.
 */
var StaticConfiguration = function( data ) {
	
	ServerConfiguration.call( this, data );
}

utils.inherits( StaticConfiguration, ServerConfiguration );

/**
 * The static configuration paths are for serving requests for static files. The property should hold an array of objects which should each 
 * hold 2 properties. The first is the <b>path</b> property which is used to to detect a path to serve on the server. The second is <b>contentPath</b> 
 * which is a path to a local directory or file to serve the content.
 * @member
 * @type {Array.<object>}
 * @example <pre><code>
 * 
 * //Create options for static server
 * var options = {
 * 		host: "localhost"
 * 		port: 80,
 * 		staticPaths: [
 * 		{
 * 			path:"/public",
 * 			contentPath: "C:/webPublic"
 * 		},
 * 		{
 * 			path:"/login",
 * 			contentPath: "C:/webPublic/login.html"
 * 		}]
 * 	}
 * //Create static configuration instance and assign options
 * var StaticConfiguration = require('com/bearcoda/clawserver/config/StaticConfiguration');
 * var configuration = new StaticConfiguration(options);
 * ...
 * </code></pre>
 */
StaticConfiguration.prototype.staticPaths = null;

/**
 * Contains an object with string values which point to a file path to load to handle http statuses. The key values should be entered depending on the status code to handle.
 * @member
 * @type {object}
 * @example  <pre><code>
 * 
 * //Create options for static server
 * var options = {
 * 		host: "localhost"
 * 		port: 80,
 * 		statusPaths: {
 *			"404" : "./error.html"
 * 		}
 * 	}
 * //Create static configuration instance and assign options
 * var StaticConfiguration = require('com/bearcoda/clawserver/config/StaticConfiguration');
 * var configuration = new StaticConfiguration(options);
 * ...
 * </code></pre>
 */
StaticConfiguration.prototype.statusPaths = null;

/**
 * Indicates if the compatible files should be compressed or gzipped before being sent to the browser
 * @member
 * @type {boolean}
 */
StaticConfiguration.prototype.compress = null;

/**
 * Indicates in seconds how long a cache should be maintained. Default is 3600 seconds
 * @member
 * @type {number}
 */
StaticConfiguration.prototype.cache = null;

/**
 * Additional headers to be added to requests calls. [Note: Experimental]
 * @member
 * @type {Array.<string>}
 */
StaticConfiguration.prototype.headers = null;

module.exports = StaticConfiguration;