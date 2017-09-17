//var assert = require('assert');

function BatchGeocoder(tofind, geocoder, onComplete, settings) {
    //assert(geocoder,"Must Provide a Geocoder");
    //assert(tofind, "Must provide a location");

    settings = settings || {};

    if (typeof tofind === "string") {
        tofind = [tofind];
    }

    this.onComplete = onComplete;
    this.success = [];
    this.retry = []; //for rate limited requests
    this.errors = [];
    this.geocoder = geocoder;
    this.locations = tofind;
    this.geocodeInterval = settings.geocodeInterval || 0;
    this.rateIncrease = settings.rateIncrease || 1000;
    this.logger = settings.logger || null;
}

var _p = BatchGeocoder.prototype;

_p.start = function() {
    this.checkQueueForNextLocation();
};

_p.checkQueueForNextLocation = function() {
    var location = this.locations.pop();
    var getNextLocation = this.getLocationData.bind(this, location);

    if (location !== undefined) {
        setTimeout(getNextLocation, this.geocodeInterval);
    } else {
        this.onComplete({
            success: this.success,
            retry: this.retry,
            errors: this.errors
        });
    }
};

//wrapper function for calling Google.Maps.geocoder.geocode
//Provide a single location to search for ( postcode, street address )
_p.getLocationData = function(toFind) {
    var batcher = this;

    var onComplete = (function() {
        var lookingFor = toFind;

        return function(result, status) {
            batcher.onGeocodeResponse(lookingFor, result, status);
        };
    })();

    this.geocoder.geocode({ address: toFind }, onComplete);
};

//Callback for Google.Maps.geocoder.geocode
_p.onGeocodeResponse = function(locationId, geocodedData, status) {
    if (this.logger) {
        this.logger("Geocoder:" + locationId, geocodedData, status);
    }

    var result = { locationId: locationId, status: status, msg: "" };

    switch (status) {
        case "OK":
            if (geocodedData.length === 1) {
                result.lat = geocodedData[0].geometry.location.lat();
                result.lng = geocodedData[0].geometry.location.lng();
                result.full_address = geocodedData[0].formatted_address;
                result.msg = "Location Found";
                this.onLocationParsed(null, result);
            } else {
                result.msg = "Multiple locations found for address.";
                this.onLocationParsed(
                    new Error("Multiple locations found for address."),
                    result
                );
            }
            break;
        case "UNKNOWN_ERROR":
        case "OVER_QUERY_LIMIT":
            this.retry.push(locationId);
            this.geocodeInterval += this.rateIncrease;
            result.msg = "Over query limit/Server Error. Will retry.";
            this.onLocationParsed(
                new Error("Over query limit/Server Error."),
                result
            );
            break;
        //case "REQUEST_DENIED":
        //case "INVALID_REQUEST":
        //case "ZERO RESULTS":
        default:
            result.msg = "Not Found!";
            this.onLocationParsed(new Error("Location Not Found"), result);
            break;
    }
};

_p.onLocationParsed = function(err, result) {
    if (err) {
        this.errors.push(result);
    } else {
        this.success.push(result);
    }

    this.checkQueueForNextLocation();
};

module.exports = BatchGeocoder;
