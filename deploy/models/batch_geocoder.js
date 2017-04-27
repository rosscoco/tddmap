//var assert = require('assert');

function BatchGeocoder( tofind, geocoder, onComplete, settings ){

    //assert(geocoder,"Must Provide a Geocoder");
    //assert(tofind, "Must provide a location");    

    settings = settings || {};

    if ( typeof( tofind ) === "string" ){
        tofind = [ tofind ];
    }
    
    this.onComplete = onComplete
    this.success    = [];
    this.retry      = [];       //for rate limited requests
    this.errors     = [];
    this.geocoder   = geocoder;
    this.locations  = tofind;
    this.geocodeInterval    = settings.geocodeInterval || 0;
    this.rateIncrease       = settings.rateIncrease || 1000;
    this.logger             = settings.logger || null;
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

    if ( this.logger ) { this.logger("Geocoder:" + result, status )};

    switch( status )
    {
        case "OK":                  if ( result.length === 1 ){
                                        this.onLocationFound({  location:result.location,
                                                                full_address:result[0].formatted_address,
                                                                lat: result[0].geometry.location.lat(),
                                                                lon: result[0].geometry.location.lng() });
                                    } else {
                                        this.onLocationNotFound( { msg:"Address must resolve to single location", address: result.location } );
                                    }
                                    break;
        case "UNKNOWN_ERROR":
        case "OVER_QUERY_LIMIT":    this.retry.push( result.location );     
                                    this.geocodeInterval += this.rateIncrease;
                                    this.onLocationNotFound({ msg:"Over query limit/Server Error. Will retry.", address:result.location });
                                    break
        case "REQUEST_DENIED":
        case "INVALID_REQUEST":
        case "ZERO RESULTS":        
        default:                    this.onLocationNotFound({msg:"Location Not Found", address:result.location });
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

    var location = this.locations.pop();
//    console.log(this.geocodeInterval);
    if ( location !== undefined ){
        if ( this.geocodeInterval > 0 ) {
            var geocoder = this;
            
            setTimeout( function(){
                geocoder.getLocationData( location );    
            }, this.geocodeInterval );
        } else {
            this.getLocationData( location );
        }
    } else if ( this.onComplete ){
            this.onComplete( {success:this.success, retry:this.retry, errors:this.errors });
    }
}


module.exports = BatchGeocoder;









