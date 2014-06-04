//ClawServer Classes
var StaticServeFeature = require('com/bearcoda/clawserver/features/StaticServeFeature');

//NodeJS Classes
var utils = require('util');
var express = require('express');

/**
 * @class
 * @classdesc ExpressStaticFeature class is a feature class in serving static files using express
 * @extends clawserver/features/StaticServeFeature
 * @constructor
 * @param loadfeature {ServerLoadFeature} - The server load feature object
 * @param loadfeature {HttpFeature} - The server http feature object
 */
var ExpressStaticFeature = function( loadFeature, httpFeature ) {
	
	//Call constructor with feature type
	StaticServeFeature.call( this, loadFeature, httpFeature );
}

utils.inherits( ExpressStaticFeature, StaticServeFeature );

/** @private */
var __ExpressStaticFeature = ExpressStaticFeature.prototype;

/**
 * Holds express instance
 * @member
 * @protected
 * @type {object}
 */
ExpressStaticFeature.prototype.express;

/*
 * PUBLIC API
 */
 
ExpressStaticFeature.prototype.destroy = function() {
	
	StaticServeFeature.prototype.destroy.call( this, null );
	this.express = undefined;
}
 
/*
 * PROTECTED API
 */

__ExpressStaticFeature.initStaticPaths = function() {
	
	StaticServeFeature.prototype.initStaticPaths.call( this, null );
	if( this.httpFeature && this.httpFeature.express ) {
		this.express = this.httpFeature.express;
	}else{
		console.log('#Error# Express server instance not found!');
	}
}
 
__ExpressStaticFeature.createStaticPathAt = function( host, path, contentPath ) {
	//For now we only handle paths but ill try to work in hosts later on
	this.express.use( path, express.static(contentPath) );
}

__ExpressStaticFeature.onRequest = function( req, res ) { 
	//Override to prevent default functionality
}
 
__ExpressStaticFeature = undefined;
module.exports = ExpressStaticFeature;
