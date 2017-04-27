(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var BatchGeocoder = require("../../src/models/batch_geocoder");
var LocationLoader = require("../../src/models/location_data_loader");

(function(){
    
    
    var csvParser, geocoder,location_loader;
    var newLocations;

    window.onload = function(){
        
        var fileInput = document.getElementById("file-input");
        var location_loader = new LocationLoader( Papa.parse, onLocationsLoaded )
        console.log( "ready", fileInput );
        fileInput.onchange = function( event ){
            location_loader.onFileSelected( event );
        }

        function onLocationsLoaded( err, results ){
            newLocations = results.data;

            var postcodes = results.data.map( function(location){
                return location.postcode;
            })


            geocoder = new BatchGeocoder( postcodes, new google.maps.Geocoder(), onLocationsGeocoded, { logger:console.log } );
            
            geocoder.start();
        }

        function onLocationsGeocoded(err, results){
            debugger;
        }
    }

    function onLocationsLoaded(err, results){
        console.log("Locations Loaded " + results );

    }
})()
},{"../../src/models/batch_geocoder":2,"../../src/models/location_data_loader":3}],2:[function(require,module,exports){
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










},{}],3:[function(require,module,exports){
module.exports = LocationLoader;

function LocationLoader( parseFunction, onComplete, parseOptions ){

    var result;
    this.file           = "No File Selected";

    this.parseOptions                   = parseOptions || {};
    this.parseOptions.skipEmptyLines    =  true;
    this.parseOptions.header            =  true;
    this.parseOptions.complete          = this.onParseComplete.bind( this );
    this.parseOptions.error             = this.onParseError.bind( this );
    
    this.parse          = parseFunction;
    this.onComplete     = onComplete;
}

var _p = LocationLoader.prototype;

_p.onFileSelected = function( event ){
    console.log("on file selected");
    var input = event.target;
    this.file = input.files[ 0 ];
    this.parse( this.file, this.parseOptions );
}

_p.onParseComplete = function( results ){
    console.lo
    var headers         = results.meta.fields.join("");
    var areHeadersValid = Utils.areHeadersPresent( results.meta.fields );    
    results             = Utils.removeInvalidResults( results );

    var success         = areHeadersValid //&& other conditions TODO

    if ( success ){
         this.onComplete( null, results );
    } else if ( !areHeadersValid ) {
        this.onFieldNameError( results );
    }
}

_p.onParseError = function( results ){
    console.log("onParseError")
}   

_p.onFieldNameError = function( results ) {
    this.onComplete("name/location/terminal are not defined as headers. Headers given were:" + results.meta.fields.join("/"), results );
}

var Utils = function()
{
    this.isEmptyString = function( s )
    {
        return typeof(s) === "string" && s.replace(/\s/g," ").length === 0;
    }

    this.isValidData = function ( dataObj ){
        var isValid = true;
        var errors = [];
        for ( var property in dataObj ){
            if ( dataObj.hasOwnProperty( property ) && this.isEmptyString( dataObj[ property ] )){                
                errors.push( property + "is not defined.");
                isValid = false;
            }
        }

        return { isValid:isValid, errors:errors.join(" ") };
    }

    this.areHeadersPresent = function( parsedHeaders ){
        var headersExist = ["name", "location", "terminal"].every( function( header ){
            return parsedHeaders.indexOf( header ) !== -1;
        })

        return headersExist && parsedHeaders.length >=3;
    }
    
    this.isValidTerminal = function( t ){
        return ["Grangemouth",
                "Kingsbury",
                "Bramhall",
                "IPC",
                "Seal Sands",
                "North Tees",
                "Thames",
                "West London"].indexOf(t) >=0;
    }

    //check for empty strings and add to error array
    this.removeInvalidResults = function( resultsToCheck ){
        
        var validData = [];
        var invalidData = [];
        var isValidResult;

        resultsToCheck.data.forEach( function( result ) {
            isValidResult = this.isValidData( result );
            if ( isValidResult.isValid && this.isValidTerminal( result.terminal ) ){
                validData.push( result );
            } else {
                invalidData.push( result );
            }
        });

        resultsToCheck.data = validData;
        resultsToCheck.invalid = invalidData;

        return resultsToCheck;
    }
    
    return this;

}()



},{}]},{},[1]);
