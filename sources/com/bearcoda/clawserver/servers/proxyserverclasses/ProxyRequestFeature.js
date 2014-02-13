
//ClawServer Classes
var WebRequestEvent = require('com/bearcoda/clawserver/events/WebRequestEvent');
var WebRequestFeature = require('com/bearcoda/clawserver/features/WebRequestFeature');

//NodeJS Classes
var utils = require('util');

/**
 * @class
 * @classdesc ProxyRequestFeature class serves as a base for handling ProxyRequestFeature functionality
 * @constructor
 * @extends clawserver/features/WebRequestFeature
 * @param loaderfeature {ServerLoadFeature} - The server load feature object
 */
var ProxyRequestFeature = function( loadFeature ) {
	
	//Call constructor with feature type
	WebRequestFeature.call( this, loadFeature );
	
	//Initiate host maps
	this.createHostMaps();
}

utils.inherits( ProxyRequestFeature, WebRequestFeature );

/**
 * Keeps a map of all the hosts to redirect
 * @member
 * @protected
 * @readonly
 */
ProxyRequestFeature.prototype.forwardMaps;

/*
 * PROTECTED API
 */

/**
 * Parse and map proxyPaths
 * @method
 * @protected
 */
ProxyRequestFeature.prototype.createHostMaps = function() {
	if( this.loadFeature.configuration && this.loadFeature.configuration.proxyPaths ) {
		
		this.forwardMaps = {};
		
		var proxyPaths = this.loadFeature.configuration.proxyPaths;
		var i, nLen = proxyPaths.length;
		for( i = 0; i < nLen; i++ )
		{
			this.forwardMaps[proxyPaths[i].host] = {
				host: proxyPaths[i].forwardHost || 'localhost',
				port: proxyPaths[i].forwardPort || 80
			}
		}
	}
}
 
/**
 * Fires when a new request is made
 * @method
 * @protected
 * @param request {object} - Request object
 * @param response {object} - Response object
 */
ProxyRequestFeature.prototype.onRequest = function( req, res, redirect ) {
	if( this.forwardMaps[req.headers.host] != undefined ) {
		redirect( this.forwardMaps[req.headers.host].host, this.forwardMaps[req.headers.host].port );
	}
	this.dispatchEvent( new WebRequestEvent(WebRequestEvent.WEB_REQUEST, {request:req, response:res, redirect:redirect}) );
}

module.exports = ProxyRequestFeature;