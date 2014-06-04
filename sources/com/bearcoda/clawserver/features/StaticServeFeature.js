//ClawServer Classes
var ServerFeatureBase = require('com/bearcoda/clawserver/features/ServerFeatureBase');
var FeatureTypes = require('com/bearcoda/clawserver/features/FeatureTypes');
var HttpEvent = require('com/bearcoda/clawserver/events/HttpEvent');

//BearCoda Classes
var delegate = require('com/bearcoda/utils/Utilities').delegate;

//NodeJS Classes
var utils = require('util');
var url = require('url');
var cluster = require('cluster');
var path = require('path');
var staticCustom;

/**
 * @class
 * @classdesc StaticServeFeature class is a feature class in serving static files
 * @extends clawserver/features/ServerFeatureBase
 * @constructor
 * @param loadfeature {ServerLoadFeature} - The server load feature object
 */
var StaticServeFeature = function( loadFeature, httpFeature ) {
	
	//Call constructor with feature type
	ServerFeatureBase.call( this, loadFeature, FeatureTypes.STATIC_SERVE );
	
	this.loadFeature = loadFeature;
	this.httpFeature = httpFeature;
	
	//Call init to setup dependencies or other supporting code
	this.initStaticPaths();
	
	//Start creating static paths
	this.createStaticPaths();
}

utils.inherits( StaticServeFeature, ServerFeatureBase );

var __StaticServeFeature = StaticServeFeature.prototype;
	__StaticServeFeature._staticPaths;
	__StaticServeFeature._pathCache;

/**
 * Holds http server feature
 * @member
 * @readonly
 * @type {HttpFeature}
 */
StaticServeFeature.prototype.httpFeature;

/**
 * Holds load server feature
 * @member
 * @readonly
 * @type {LoadFeature}
 */
StaticServeFeature.prototype.loadFeature;

/*
 * PUBLIC API
 */
 
StaticServeFeature.prototype.destroy = function() {
	if( this.httpFeature ) {
		this.httpFeature.off( HttpEvent.WEB_REQUEST, this._onWebRequest );
		this.httpFeature = null;
	}
	
	this._staticPaths = undefined;
	this._pathCache = undefined;
}

/*
 * PROTECTED API
 */

//
//Note: The base API is made to work with node-static but should be able to extend and override methods
//		to include other frameworks such as Express. This simply a light weight solution for someone who
//		wants a simple http static serving server.
 
/**
 * Initialize any supporting code or dependencies before creating static paths
 * @method
 * @protected
 */
StaticServeFeature.prototype.initStaticPaths = function() {
	
	/** ========================================================
	 * We're going to extend node-static to alter functionality
	/** ======================================================== */
	
	if( !StaticServeFeature._STATIC__CUSTOM_ )
	{
		var static = require('node-static');
		staticCustom = function(detectPath, directory, options) {
			this.detectPath = detectPath;
			static.Server.call(this, directory, options);
		}
		
		utils.inherits( staticCustom, static.Server );
		staticCustom.prototype.resolve = function (pathname) {
			
			if( this.root.indexOf('.') != -1 ) {
				return path.resolve(this.root);
			}else{
				pathname = pathname.substr( this.detectPath.length );
				return path.resolve(path.join(this.root, pathname));
			}
		};
		StaticServeFeature._STATIC__CUSTOM_ = staticCustom;
	}else{
		staticCustom = StaticServeFeature._STATIC__CUSTOM_;
	}
	/** ======================================================== */
	
	//Setup handler
	this._onWebRequest = delegate( this, this.__onWebRequest );
	
	//By default we're using static API which requires we listen to http requests.
	this.httpFeature.on( HttpEvent.WEB_REQUEST, this._onWebRequest );
}

/**
 * Create static paths
 * @method
 * @protected
 */
StaticServeFeature.prototype.createStaticPaths = function() {
	this._staticPaths = {};
	
	//Create static path
	if( this.loadFeature.configuration && this.loadFeature.configuration.staticPaths ) {
		var staticPaths = this.loadFeature.configuration.staticPaths;
		var i, mapSlot, nLen = staticPaths.length;
		for( i = 0; i < nLen; i++ ) {
			if( staticPaths[i].path != undefined ) this.createStaticPathAt( staticPaths[i].host || this.loadFeature.configuration.host || 'localhost', 
																			staticPaths[i].path, 
																			staticPaths[i].contentPath );
		}
	}
}

/**
 * Create individual static paths
 * @method
 * @protected
 * @param host {string} - Host for the path
 * @param path {string} - A web path to serve the content on
 * @param contentPath {string} - A directory location where the content is stored
 */
StaticServeFeature.prototype.createStaticPathAt = function( host, path, contentPath ) {
	
	if( staticCustom ) {
		if( contentPath && contentPath.length > 0 )  { 
			
			//static options
			var options = {
							gzip: this.loadFeature.configuration.compress || true,
							cache: this.loadFeature.configuration.cache || 3600,
							headers: this.loadFeature.configuration.headers || {}
						  }
			
			this._staticPaths[host+'__'+path] = {
				isFile: (/\.(\w*)$/i).test(contentPath),
				host: host,
				path: path,
				contentPath: contentPath,
				options: options,
				server: new staticCustom(path, contentPath, options)
			}
		}
	}
}

StaticServeFeature.prototype.onRequest = function( req, res ) { 
	var detectedPath = this.getDetectedPath(req);
	var loadFeature = this.loadFeature;
	if( detectedPath ) { 
		req.addListener('end', function () {
			if( detectedPath.isFile ) { 
				detectedPath.server.serveFile( detectedPath.contentPath, 200, {}, req, res );
			}else{
				detectedPath.server.serve(req, res, function( e, res_error ) {
					if( e && e.status == 404 ) {
						if( loadFeature.configuration.statusPaths && loadFeature.configuration.statusPaths['404'] != undefined ) {
							detectedPath.server.serveFile( loadFeature.configuration.statusPaths['404'], 404, {}, req, res );
						}else{
							res.writeHead(e.status, e.headers);
							res.end();
						}
					}
				});
			}
		}).resume();	
	}else{
		res.writeHead(404, {"Content-Type": "text/plain"});
		res.write("404 Not Found\n");
		res.end();
	}
}

StaticServeFeature.prototype.getDetectedPath = function( req ) {
	var urlPath = req.headers.host.replace( /\:\d+/i, '' )+'__'+url.parse(req.url).pathname;
	if( this._pathCache && this._pathCache[urlPath] != undefined ) return this._staticPaths[this._pathCache[urlPath]];
	var i;
	for( i in this._staticPaths ) {
		if( urlPath.indexOf(i) == 0 ) {
			if( !this._pathCache ) this._pathCache = {};
			this._pathCache[urlPath] = i;
			return this._staticPaths[i];
		}
	}
}

/*
 * PRIVATE API
 */

__StaticServeFeature.__onWebRequest = function( event ) {
	this.onRequest( event.request, event.response );
}

__StaticServeFeature = undefined;
module.exports = StaticServeFeature;