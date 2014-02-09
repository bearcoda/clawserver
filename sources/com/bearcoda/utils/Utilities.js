
/** 
 * @class Utilities
 * @classdesc Holds utility functions for general use
 */
var Utilities = 
{
	/**
	 * @method
	 * @param targetObject {object} - Target object to execute function
	 * @param targetFunction {function} - Target method to execute method
	 * @param args1,args2,.. {object} - Accepts any number of arguments to be passed to target function
	 * @description Delegate a function call to another function 
	 * @example <pre><code>
	 //import delegate function
	 var delegate = require("com/bearcoda/utils/Utilities").delegate;
	 
	 var o = 
	 {
	     func:function( msg )
		 {
			//outputs Fired! Yoo!
			console.log("Fired! " + msg);
		 }
	 }
		
	 //Create delegate
	 var deFunc = delegate( o, o.func, "Yoo!" );
	 
	 //Fire delegate
	 deFunc();</code></pre>
	 */
	delegate: function( __object, __func ) 
	{
		var aArgs = new Array();
		if ( arguments.length > 2 ) 
		{
			aArgs = aArgs.concat( Utilities.duplicateArray( arguments ) );
			var args = aArgs.slice( 2 );
		}
		
		var f = function () 
		{
			var _callee = arguments.callee;
			var aCalleeArgs = new Array();
			
			var nLen = arguments.length;
			for( var i = 0; i < nLen; i++ )
			{
				aCalleeArgs.push( arguments[i] );
			}
			
			var aArgs = new Array();
			aArgs = aArgs.concat( aCalleeArgs, _callee.args );
			
			var target = _callee.targ;
			var func = _callee.method;
			return func.apply(target, aArgs );
		};
		
		f.targ = __object;
		f.method = __func;
		f.args = args;
		return f;
	},
	
	/**
	 * @method
	 * @param array {Array.<object>} - Any array to be copied
	 * @description Duplicates Arrays
	 */
	duplicateArray: function( p_aArguments )
	{
		if( p_aArguments == undefined || p_aArguments.length == 0 ) return;
		
		var aArgs = new Array();
		var nLen = p_aArguments.length;
		
		for( var i = 0; i < nLen; i++ )
		{
			aArgs.push( p_aArguments[ i ] );
		}
		return aArgs;
	},
	
	localPath: require('path').dirname(require.main.filename)
}

module.exports = Utilities;