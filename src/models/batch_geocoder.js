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

_p.start = function(){
     this.checkQueueForNextLocation();
}

_p.checkQueueForNextLocation = function(){
    
    var location = this.locations.pop();
    var getNextLocation = this.getLocationData.bind( this, location );
    
    if ( location !== undefined ){
        setTimeout( getNextLocation, this.geocodeInterval );
    } else {
        this.onComplete( { success:this.success, retry:this.retry, errors:this.errors });
    }
}


//wrapper function for calling Google.Maps.geocoder.geocode
//Provide a single location to search for ( postcode, street address )
_p.getLocationData = function( toFind ){       
    
    var batcher = this;

    var onComplete = function(){

        var lookingFor = toFind;
        
        return function( result, status){
            batcher.onGeocodeResponse( lookingFor, result, status );
        }
    }();

    this.geocoder.geocode( { address:toFind }, onComplete );
}

//Callback for Google.Maps.geocoder.geocode
_p.onGeocodeResponse = function( locationSearched, result, status  ){

    if ( this.logger ) { this.logger("Geocoder:" + locationSearched, result, status )};

    switch( status )
    {
        case "OK":                  if ( result.length === 1 ){
                                        this.onLocationFound({  location:locationSearched,
                                                                full_address:result[0].formatted_address,
                                                                lat: result[0].geometry.location.lat(),
                                                                lon: result[0].geometry.location.lng() });
                                    } else {
                                        this.onLocationNotFound( { msg:"Address must resolve to single location", location: result.location } );
                                    }
                                    break;
        case "UNKNOWN_ERROR":
        case "OVER_QUERY_LIMIT":    this.retry.push( locationSearched ); 
                                    this.geocodeInterval += this.rateIncrease;
                                    this.onLocationNotFound({ msg:"Over query limit/Server Error. Will retry.", location:locationSearched });
                                    break
        case "REQUEST_DENIED":
        case "INVALID_REQUEST":
        case "ZERO RESULTS":        
        default:                    this.onLocationNotFound( {msg:"Location Not Found", location:locationSearched });
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





module.exports = BatchGeocoder;









