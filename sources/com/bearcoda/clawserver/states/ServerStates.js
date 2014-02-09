
//ClawServer classes
var LoadState = require('com/bearcoda/clawserver/states/LoadState');

/**
 * @class
 * @classdesc Holds all the constant values for server states
 */
var ServerStates = function() {};

/**
 * Indicates that the server is idle and has not loaded any settings
 * @static
 * @constant
 * @type {string}
 */
ServerStates.UNINITIALIZED = LoadState.UNINITIALIZED;
 
/**
 * Indicates that the server is currently loading settings and preparing features
 * @static
 * @constant
 * @type {string}
 */
ServerStates.LOADING = LoadState.LOADING;

/**
 * Indicates that the server has loaded configuration and features and is ready to use
 * @static
 * @constant
 * @type {string}
 */
ServerStates.READY = LoadState.READY;

/**
 * Indicates that the server is unloading settings and features
 * @static
 * @constant
 * @type {string}
 */
ServerStates.UNLOADING = LoadState.UNLOADING;

/**
 * Indicates that there was an error in the load operation
 * @static
 * @constant
 * @type {string}
 */
ServerStates.ERROR = 'serverError';

module.exports = ServerStates;