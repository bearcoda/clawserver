
//ClawServer Classes
var HttpEvent = require('com/bearcoda/clawserver/events/HttpEvent');
var HttpFeature = require('com/bearcoda/clawserver/features/HttpFeature');

//BearCoda Classes
var delegate = require('com/bearcoda/utils/Utilities').delegate;

//NodeJS Classes
var httpProxy = require('http-proxy');
var url = require('url');
var utils = require('util');

/**
 * @class
 * @classdesc ProxyRequestFeature class serves as a base for handling ProxyRequestFeature functionality
 * @constructor
 * @extends clawserver/features/HttpFeature
 * @param loadfeature {ServerLoadFeature} - The server load feature object
 */
var ProxyRequestFeature = function( loadFeature ) {
	
	//Call constructor with feature type
	HttpFeature.call( this, loadFeature );
	
	//Initiate host maps
	this.createHostMaps();
	
	//Whoa trying something new
	this._proxy = httpProxy.createProxyServer({});
}

utils.inherits( ProxyRequestFeature, HttpFeature );

var __ProxyRequestFeature = ProxyRequestFeature.prototype;
	__ProxyRequestFeature._proxy;

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
		var i, mapSlot, nLen = proxyPaths.length;
		for( i = 0; i < nLen; i++ )
		{
			mapSlot = proxyPaths[i].host != undefined ? proxyPaths[i].host : proxyPaths[i].path;
			if( mapSlot ) {
				this.forwardMaps[mapSlot] = {
					host: proxyPaths[i].forwardHost || 'localhost',
					port: proxyPaths[i].forwardPort || 80
				}
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
ProxyRequestFeature.prototype.onRequest = function( req, res ) { //, redirect ) {
	
	//Get map and redirect call if exists
	var mapSlot = this.__getMapSlot(req);
	if( mapSlot ) this._proxy.web( req, res, {target:'http'+(this.forwardMaps[mapSlot].secure == true ? 's' : '')+'://'+this.forwardMaps[mapSlot].host+':'+this.forwardMaps[mapSlot].port} );
	
	//Dispatch event letting know we got a request
	this.dispatchEvent( new HttpEvent(HttpEvent.WEB_REQUEST, {request:req, response:res}) );
}

/*
 * PRIVATE API
 */

__ProxyRequestFeature.serverCreated = function() {
	if( this.loadFeature.configuration.websockets != false ) this.server.on( 'upgrade', delegate(this, this.onHTTPUpgrade) );
}

__ProxyRequestFeature.getListenerCallBack = function( eventType )
{
	if( eventType == 'upgrade' ) return;
	return HttpFeature.prototype.getListenerCallBack.call( this, eventType );
}

__ProxyRequestFeature.onHTTPUpgrade = function( req, socket, head ) {
	
	//Call super
	HttpFeature.prototype.onHTTPUpgrade.call( this, req, socket, head );
	
	//If websockets are used then redirect that too
	var mapSlot = this.__getMapSlot(req);
	if( mapSlot ) this._proxy.ws( req, socket, head, {target:'ws'+(this.forwardMaps[mapSlot].secure == true ? 's' : '')+'://'+this.forwardMaps[mapSlot].host+':'+this.forwardMaps[mapSlot].port} );
}

__ProxyRequestFeature.__getMapSlot = function( req ) {
	
	var mapSlot, host = req.headers.host.replace(/\:(\d+)/i, '');
	if( this.forwardMaps[host] != undefined ) {
		mapSlot = host;
	}else{
		var tempSlot = url.parse(req.url).pathname;
		if( tempSlot.lastIndexOf('/') > 0 ) tempSlot = '/' + tempSlot.split('/')[1];
		if( this.forwardMaps[tempSlot] != undefined ) mapSlot = tempSlot;
	}
	return mapSlot;
}

__ProxyRequestFeature = undefined;
module.exports = ProxyRequestFeature;