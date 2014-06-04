//ClawServer Classes
var HttpFeature = require('com/bearcoda/clawserver/features/HttpFeature');

//NodeJS Classes
var utils = require('util');
var express = require('express');

/**
 * @class
 * @classdesc ExpressHttpFeature class serves as a base for handling ExpressHttpFeature functionality.
 * @constructor
 * @extends clawserver/features/HttpFeature
 * @param loadfeature {ServerLoadFeature} - The server load feature object
 */
var ExpressHttpFeature = function( loadFeature ) {
	
	//Call constructor with feature type
	HttpFeature.call( this, loadFeature );
}

utils.inherits( ExpressHttpFeature, HttpFeature );

/** @private */
var __ExpressHttpFeature = ExpressHttpFeature.prototype;

/**
 * Main express object
 * @member
 * @type {ExpressJS}
 */
ExpressHttpFeature.prototype.express;

/*
 * PRIVATE API
 */
 
__ExpressHttpFeature.getCreateCallback = function() {
	this.express = express();
	return this.express;
}

__ExpressHttpFeature = undefined;
module.exports = ExpressHttpFeature;
