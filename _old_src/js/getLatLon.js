
var success;
var fail
var retry;
var sitesArray;
var timeTillNextLoad = 1000;
var isRetry = false;
var geocoder

function initMap()
{	
	geocoder = new google.maps.Geocoder();	
	var terminalData;
	var siteData;
	var site;

	var counter = 0;

	var sitesToEncode = [];
	success = [];
	for ( var terminalName in allSiteData )
	{
		terminalData = allSiteData[ terminalName ];

		for ( var location in terminalData )
		{
			site = new SiteData( location, terminalData[ location ] );
			site.geocoder = geocoder;
			sitesToEncode.push( site );
		}

		if ( ++counter > 15 ) break;
	}

	startEncoding( sitesToEncode );
}

function startEncoding( usingSites )
{
	sitesArray = usingSites.slice();

	fail = [];
	retry = [];
	
	getNextLocation();
}


function getNextLocation()
{
	var nextSite = sitesArray.pop();

	if ( sitesArray.length > 0 ) 	nextSite.getLatLon( onSiteGeocoded );
	else							nextSite.getLatLon( onLastSiteGeocoded );
}

function onSiteGeocoded( site, result )
{
	var loadInterval = timeTillNextLoad + Math.floor( Math.random() * 1000)

	console.log( "Geocoded " + site.data.postcode + " with status of " + result +". " + sitesArray.length + " left. Trying again in " + loadInterval / 1000 +"s");

	if ( result == "OK" )
	{
		success.push( site );
	}
	else if ( result == "OVER_QUERY_LIMIT" )
	{
		loadInterval = 1500;
		retry.push( site );
	}
	else
	{
		fail.push( site )
	}

	if ( sitesArray.length > 0 )
	{
		setTimeout( getNextLocation, timeTillNextLoad * 2 );
	}
}

function onLastSiteGeocoded( site, result )
{
	onSiteGeocoded( site, result );

	logSiteResults( "Correctly Encoded", success );
	logSiteResults( "Failed", fail );

	if ( retry.length > 0 && !isRetry )
	{
		console.log("Retrying " + retry.length + "  sites...");
		startEncoding( retry );
	}
	else
	{
		logSiteResults( "Try again withe these: ", retry );
	}
}


function logSiteResults( msg, sites )
{	
	var terminalData = {};

	sites.forEach( function( site )
	{
		if ( !terminalData.hasOwnProperty(site.data.postcode))
		{
			terminalData[ site.data.postcode ] = {};
		}

		terminalData[ site.data.postcode ] = site.toJSON();
	});

	console.log(msg)
	console.log( JSON.stringify( terminalData ));
	console.log('--------------------------------\n\n')
}

function SiteData( where, dataObj )
{
	this.data = dataObj
	this.data.postcode = where
}


SiteData.prototype.getLatLon = function( onComplete )
{
	this.onComplete = onComplete
	var site = this;

	this.geocoder.geocode( {address:this.data.postcode}, function( results, status )
	{
		site.onGeocodeSuccess( results, status );
	});
}

SiteData.prototype.onGeocodeSuccess = function(results, status )
{

	if ( status == "OK")
	{
		this.data.lat = results[0].geometry.location.lat();
		this.data.lng = results[0].geometry.location.lng();
	}

	this.onComplete( this, status );

	
}


SiteData.prototype.toJSON = function()
{
	return { 	name:this.data.allNames[0], 
				allNames:this.data.allNames, 
				terminal:this.data.terminal, 
				isUK:this.data.isUKFuels, 
				isKey:this.data.isKeyFuels,
				lat:this.data.lat,
				lng:this.data.lng }
}

