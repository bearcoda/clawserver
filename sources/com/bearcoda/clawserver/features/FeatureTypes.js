
/**
 * @class
 * @classdesc Holds constant values for all available feature types
 */
var FeatureTypes = function() {};

/**
 * Indicates this is the load feature used for loading operations
 * @static
 * @constant
 * @type {string}
 */
FeatureTypes.LOAD = 'load';

/**
 * Indicates this is the Cluster feature used for working with multiple processors
 * @static
 * @constant
 * @type {string}
 */
FeatureTypes.CLUSTER = 'cluster';

/**
 * Indicates this is the WebRequest feature used for tracking requests calls
 * @static
 * @constant
 * @type {string}
 */
FeatureTypes.WEB_REQUEST = 'webRequest';

/**
 * Indicates this is the Media feature used for working with media files on the server [Note: this feature is not yet supported]
 * @static
 * @constant
 * @type {string}
 */
FeatureTypes.MEDIA = 'media';

/**
 * Indicates this is the Encoder feature used for encoding media files on the server [Note: this feature is not yet supported]
 * @static
 * @constant
 * @type {string}
 */
FeatureTypes.ENCODE = 'encode';

/**
 * Indicates this is the Social feature used working with social media on the server [Note: this feature is not yet supported]
 * @static
 * @constant
 * @type {string}
 */
FeatureTypes.SOCIAL = 'social';

module.exports = FeatureTypes;