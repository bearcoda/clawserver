
/**
 * @class
 * @classdesc Holds all the constant values for load states
 */
var LoadState = function() {};

/**
 * Indicates that the load operation is idle or has not started
 * @static
 * @constant
 * @type {string}
 */
LoadState.UNINITIALIZED = 'uninitialized';
 
/**
 * Indicates that the load operation has started
 * @static
 * @constant
 * @type {string}
 */
LoadState.LOADING = 'loading';

/**
 * Indicates that the load operation has finished and ready
 * @static
 * @constant
 * @type {string}
 */
LoadState.READY = 'ready';

/**
 * Indicates that the load operation is unloading
 * @static
 * @constant
 * @type {string}
 */
LoadState.UNLOADING = 'unloading';

/**
 * Indicates that there was an error in the load operation
 * @static
 * @constant
 * @type {string}
 */
LoadState.ERROR = 'loadError';

module.exports = LoadState;