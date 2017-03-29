var assert = require('assert');

function BatchGeocoder( tofind, geocoder, onComplete ){

    assert(geocoder,"Must Provide a Geocoder");
    assert(tofind, "Must provide a location");
    
    if ( typeof( tofind ) === "string" ){
        tofind = [ tofind ];
    }
    
    this.onComplete = onComplete
    this.success    = [];
    this.retry      = [];       //for rate limited requests
    this.errors     = [];
    this.geocoder   = geocoder;
    this.locations  = tofind;
}

var _p = BatchGeocoder.prototype;

_p.getLocationData = function( toFind ){
       
    var batcher = this;
    var lookingFor = toFind;

    this.geocoder.geocode( { address:toFind }, function( result, status ){
        result.location = lookingFor;
        batcher.onGeocodeResponse( result, status );
    });
}

_p.onGeocodeResponse = function( result, status ){


    switch( status )
    {
        case "OK":                  if ( result.length === 1 ){
                                        this.onLocationFound({  location:result.location,
                                                                full_address:result[0].formatted_address,
                                                                lat: result[0].geometry.location.lat(),
                                                                lon: result[0].geometry.location.lon() });
                                    } else {
                                        this.onLocationNotFound( { msg:"Address must resolve to single location", address: result.location } );
                                    }
                                    break;
        case "UNKNOWN_ERROR":
        case "OVER_QUERY_LIMIT":    this.retry.push( result.address );
                                    this.onLocationNotFound({ msg:"Over query limit/Server Error. Will retry.", address:result.location });
                                    break
        case "REQUEST_DENIED":
        case "INVALID_REQUEST":
        case "ZERO RESULTS":        this.onLocationNotFound({msg:"Location Not Found", address:result.location });
                                    break;
    }
}

_p.onLocationNotFound = function( err, result )
{
     this.errors.push( err );
     this.checkQueueForNextLocation();
}

_p.onLocationFound = function( locationObj )
{
     this.success.push( locationObj );
     this.checkQueueForNextLocation();
}

_p.start = function(){
     this.checkQueueForNextLocation();
}

_p.checkQueueForNextLocation = function(){
    if ( this.locations.length > 0 ){
        this.getLocationData( this.locations.pop());
    } else if ( this.onComplete ){
            this.onComplete( {success:this.success, retryr:this.retry, errors:this.errors });
    }
}


module.exports = BatchGeocoder;


// function SiteData( address, onUpdated ){
//     this.address    = address;
//     this.onUpdated  = onUpdated;
//     this.lat        = '';
//     this.lon        = '';
// }

// SiteData.prototype.onLocationUpdate = function(results, status)
// {
//     if ( status === "OK"){
//         this.lat = results[0].geometry.location.lat();
// 		this.lng = results[0].geometry.location.lng();
//     }

//     this.onUpdated( results, status );
// }









