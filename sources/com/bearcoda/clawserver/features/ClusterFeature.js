//ClawServer Classes
var ServerFeatureBase = require('com/bearcoda/clawserver/features/ServerFeatureBase');
var FeatureTypes = require('com/bearcoda/clawserver/features/FeatureTypes');

//BearCoda Classes
var delegate = require('com/bearcoda/utils/Utilities').delegate;

//NodeJS Classes
var utils = require('util');
var cluster = require('cluster');

/**
 * @class
 * @classdesc ClusterFeature class is a feature class in charge of managing server cores
 * @extends clawserver/features/ServerFeatureBase
 * @constructor
 * @param loadfeature {ServerLoadFeature} - The server load feature object
 */
var ClusterFeature = function( loadFeature ) {
	
	//Call constructor with feature type
	ServerFeatureBase.call( this, FeatureTypes.CLUSTER );
	
	//set props
	this.is_master = cluster.isMaster == true;
	this.id = this.is_master ? "0" : cluster.worker.id;
	
	var availCores = require('os').cpus().length;
	this.cores = loadFeature.configuration.cores == 0 || availCores <= loadFeature.configuration.cores ? availCores : loadFeature.configuration.cores;
	
	this.initiateCores();
}

utils.inherits( ClusterFeature, ServerFeatureBase );

/** @private */
var __ClusterFeature = ClusterFeature.prototype;

//cores is a one time deal want to make sure we dont start more than we have available
ClusterFeature.__CLUSTER_ACTIVE__ = false;

/**
 * Indicates whether this process is the master
 * @member
 * @readonly
 * @type {boolean}
 */
ClusterFeature.prototype.is_master;

/**
 * Contains the process id
 * @member
 * @readonly
 * @type {string}
 */
ClusterFeature.prototype.id;

/**
 * Indicates the maximum amount of cores this server is allowed to use
 * @member
 * @readonly
 * @protected
 * @type {string}
 */
ClusterFeature.prototype.cores;


/*
 * PUBLIC API
 */

/**
 * @method
 * @protected
 * @param message {object} - Message object to send back to target. If object has 'handlerName' and 'args' then this will fire method on listening process.
 * @description Sends a message to the target process. If sent from master then target is all clusters. If send originates in cluster worker then goes to master.
 */
ClusterFeature.prototype.send = function()
{
	if( this.is_master )
	{
		Object.keys(cluster.workers).forEach(function(id) {
			cluster.workers[id].send.apply( cluster.workers[id], arguments );
		});
	}else{
		//Send to master
		process.send.apply( process, arguments );
	}
}

/**
 * @method
 * @protected
 * @param message {object} - Message object to send back to target. If object has 'handlerName' and 'args' then this will fire method on listening process. Properties must be only string or number as you cannot pass other types including objects.
 * @description Receives message coming from another process
 */
ClusterFeature.prototype.onMessage = function( msg )
{
	
}
 
ClusterFeature.prototype.destroy = function() {
	this.stopCores();
}

/*
 * PROTECTED API
 */
 
/**
 * @method
 * @protected
 * @param worker {Worker} - Worker object
 * @description Fires when worker comes online. Available only to master process
 */
ClusterFeature.prototype.workerOnline = function( worker )
{
	worker.on( "message", delegate(this, this.__onMessage) );
	
}

/**
 * Starts core processes
 * @method
 * @protected
 */
ClusterFeature.prototype.initiateCores = function() {
	
	if( ClusterFeature.__CLUSTER_ACTIVE__ ) return;
	
	if( this.is_master )
	{
		if( this.cores != 1 )
		{
			var i;
			for ( i = 0; i < this.cores; i++ )
			{
				cluster.fork([]);
			}
		}
		
		cluster.on( "online", delegate(this, this.workerOnline ) );
		ClusterFeature.__CLUSTER_ACTIVE__ = true;
	}else{
		cluster.worker.on( "message", delegate(this, this.__onMessage) )
	}
}

/**
 * Stops core processes
 * @method
 * @protected
 */
ClusterFeature.prototype.stopCores = function() {
	
	if( !this.is_master ) return;
	
	//Kill all cores
	for (var id in cluster.workers) {
		cluster.workers[id].kill();
	}
	
	ClusterFeature.__CLUSTER_ACTIVE__ = false;
}

/*
 * PRIVATE API
 */
 
__ClusterFeature.__onMessage = function( msg )
{
	//If not these types then kill
	if( typeof(msg) != "string" && typeof(msg) != "object" ) return;
	
	if( typeof(msg) == "string" || msg.handlerName == undefined )
	{
		this.onMessage(msg);
	}else{
		var handlerName = msg.handlerName;
		if( this.hasOwnProperty(handlerName) ) this[handlerName].apply( this, (msg.args==undefined?[]:msg.args) );
	}
}

__ClusterFeature = undefined;
module.exports = ClusterFeature;
