
var ArrayUtils = function() {};

/*
 * PUBLIC API
 */

ArrayUtils.pushAt = function( itemList, items, index )
{
	return itemList.slice(0, index).concat(items).concat(itemList.slice(index));
}

ArrayUtils.moveTo = function( itemList, oldIndex, newIndex, length )
{
	length = length || 1;
	var newList = ArrayUtils.copy(itemList), cutOutItems = newList.splice(oldIndex, length);
	return ArrayUtils.pushAt(newList, cutOutItems, newIndex);
}

ArrayUtils.splice = function( itemList, startIndex, deleteCount, items )
{
	if ( itemList == undefined ) return null;
	deleteCount = deleteCount || 1;
	
	//If zero delete count then ignore
	itemList.splice( startIndex, deleteCount );
	
	if ( items != undefined ) itemList = pushAt( itemList, items, startIndex );
	return itemList;
}

ArrayUtils.copy = function( args )
{
	if( args == undefined ) return;
	var aArgs = [], nLen = args.length;
	for( var i = 0; i < nLen; i++ ) aArgs.push( args[i] );
	return aArgs;
}

ArrayUtils.indexOf = function( data, searchElement, startPoint )
{
	if ( searchElement == undefined ) return -1;
	
	startPoint = startPoint || 0;
	var index = -1, i, newArray = startPoint > 0 ? data.slice(startPoint) : data;
	for ( i = 0; i < newArray.length; i++ )
	{
		if ( newArray[i] == searchElement )
		{
			index = i;
			break;
		}
	}
	return index;
}

module.exports = ArrayUtils;