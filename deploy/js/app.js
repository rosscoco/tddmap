(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function() {
    var ImportDataController = require("../controller/import_data_controller.js");
    window.onload = function() {

        var body = document.querySelector("body");
        console.log(body.querySelector("#file-input-btn"));
        var app = new ImportDataController(body);
    };
})();

},{"../controller/import_data_controller.js":2}],2:[function(require,module,exports){
//globals Papa
module.exports = ImportDataController;

var CSVLoader = require("../model/location_csv_loader");
var SiteTableView = require("../view/site_table_view");
var GeoCoder = require("../model/batch_geocoder");

/*function ImportDataController(pageDOM) {
    this.initView(pageDOM);
}

var _p = ImportDataController.prototype;

_p.initView = function(withDOM) {
     this.fileInput = withDOM.querySelector( "#file-input-btn" );
    this.view = new SiteTableView( withDOM.querySelector("#site-table-view"));
    this.csvLoader = new CSVLoader( Papa.parse, this.onParseComplete.bind(this) );
    this.fileInput.addEventListener("change", this.csvLoader.onFileSelected.bind(this.csvLoader));
    
    console.log("init View");
};

_p.onFileSelected = function(evt) {
    this.csvLoader = new CSVLoader(Papa, this.onParseComplete);
};

_p.onParseComplete = function(err, results) {
    if (err) {
        this.showError(err);
    } else {
        this.showCSVData(results);
    }
};

_p.showCSVData = function(csvData) {
    console.log(csvData);
};
*/

function ImportDataController( node ){

    var pageDOM = node;
    var controller = this;
    
    var fileInput   = pageDOM.querySelector( "#file-input-btn" );
    var view        = new SiteTableView( withDOM.querySelector("#site-table-view"));
    var csvLoader   = new CSVLoader( Papa.parse, _onParseComplete.bind( controller ));
    
    fileInput.addEventListener("change", function(evt) {
       csvLoader.onFileSelected(evt);
    });

   _onParseComplete = function(err, results) {
        if (err) {
            this.showError(err);
        } else {
            this.showCSVData(results);
        }
    };

    _showCSVData = function(csvData) {
        console.log(csvData);
    };
}
},{"../model/batch_geocoder":3,"../model/location_csv_loader":4,"../view/site_table_view":5}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
module.exports = LocationLoaderFromFile;

function LocationLoaderFromFile(parseFunction, onComplete, parseOptions) {
    var result;
    this.file = "No File Selected";

    this.parseOptions = parseOptions || {};
    this.parseOptions.skipEmptyLines = true;
    this.parseOptions.header = true;
    this.parseOptions.complete = this.onParseComplete.bind(this);
    this.parseOptions.error = this.onParseError.bind(this);

    this.parse = parseFunction;
    this.onComplete = onComplete;
}

var _p = LocationLoaderFromFile.prototype;

_p.onFileSelected = function(event) {
    var input = event.target;
    this.file = input.files[0];
    this.parse(this.file, this.parseOptions);
};

_p.onParseComplete = function(results) {
    var headers = results.meta.fields.join("");
    var areHeadersValid = Utils.areHeadersPresent(results.meta.fields);
    results = Utils.removeInvalidResults(results);

    var success = areHeadersValid; //&& other conditions TODO

    if (success) {
        this.onComplete(null, results);
    } else if (!areHeadersValid) {
        this.onFieldNameError(results);
    }
};

_p.onParseError = function(results) {
    console.log("onParseError");
};

_p.onFieldNameError = function(results) {
    this.onComplete(
        "name/address/terminal are not defined as headers. Headers given were:" +
            results.meta.fields.join("/"),
        results
    );
};

var Utils = (function() {
    this.isEmptyString = function(s) {
        return typeof s === "string" && s.replace(/\s/g, " ").length === 0;
    };

    this.isValidData = function(dataObj) {
        var isValid = true;
        var errors = [];
        for (var property in dataObj) {
            if (
                dataObj.hasOwnProperty(property) &&
                this.isEmptyString(dataObj[property])
            ) {
                errors.push(property + "is not defined.");
                isValid = false;
            }
        }

        return { isValid: isValid, errors: errors.join(" ") };
    };

    this.areHeadersPresent = function(parsedHeaders) {
        var headersExist = ["name", "address", "terminal"].every(function(
            header
        ) {
            return parsedHeaders.indexOf(header) !== -1;
        });

        return headersExist && parsedHeaders.length >= 3;
    };

    this.isValidTerminal = function(t) {
        return (
            [
                "Grangemouth",
                "Kingsbury",
                "Bramhall",
                "IPC",
                "Seal Sands",
                "North Tees",
                "Thames",
                "West London"
            ].indexOf(t) >= 0
        );
    };

    //check for empty strings and add to error array
    this.removeInvalidResults = function(resultsToCheck) {
        var validData = [];
        var invalidData = [];
        var isValidResult;

        resultsToCheck.data.forEach(function(result) {
            isValidResult = this.isValidData(result);
            if (
                isValidResult.isValid &&
                this.isValidTerminal(result.terminal)
            ) {
                validData.push(result);
            } else {
                invalidData.push(result);
            }
        });

        resultsToCheck.data = validData;
        resultsToCheck.invalid = invalidData;

        return resultsToCheck;
    };

    return this;
})();

},{}],5:[function(require,module,exports){
//addSiteData(array)
//receives an array and creates a table row for each one
//deletes previous entries before adding

//updateSite( id, siteData, status )
//

//getValidSiteData()
//returns an array of sites with name, location, terminal, geodata properties set.

//getInvalidSiteData()
//returns an array of sites without any of name, location, terminal, geodata properties set.

function SiteTableView(tableNode) {
    if (
        tableNode &&
        tableNode.nodeType &&
        tableNode.nodeType === 1 &&
        tableNode.nodeName === "TABLE"
    ) {
        this.tableNode = tableNode;
        this.statusIconClasses = {
            default: "fa fa-fw fa-minus",
            pending: "fa fa-fw fa-exclamation-triangle",
            fetching: "fa fa-fw fa-spinner fa-pulse",
            failed: "fa fa-fw fa-times-circle",
            complete: "fa fa-fw fa-check-circle"
        };
    } else {
        throw new Error(
            "SiteTableView instantiated without a <table>"
        );
    }
}

var _p = SiteTableView.prototype;

_p.update = function(withData) {
    if (
        !!withData &&
        !!withData.hasOwnProperty &&
        withData.hasOwnProperty("name") &&
        withData.name.replace(" ", "").length > 1 &&
        withData.hasOwnProperty("terminal") &&
        withData.name.replace(" ", "").length > 1 &&
        withData.hasOwnProperty("location") &&
        withData.location.replace(" ", "").length > 1
    ) {
        var row = this.rowExists(withData);

        if (!row) {
            this.createRow(withData);
        } else {
            return this.modifyRowData(row, withData);
        }

        return true;
    } else {
        return false;
    }
};

_p.rowExists = function(withData) {
    var id = (withData.terminal + "_" + withData.name).replace(" ", "");
    var row = this.tableNode.querySelector("tbody").querySelector("#" + id);
    return row;
};

_p.createRow = function(rowData) {
    var row = this.tableNode.querySelector("tbody").insertRow();
    row.id = (rowData.terminal + "_" + rowData.name).replace(" ", "");

    var name = row.insertCell();
    var location = row.insertCell();
    var terminal = row.insertCell();
    var status = row.insertCell();

    name.innerHTML = rowData.name;
    location.innerHTML = rowData.location;
    terminal.innerHTML = rowData.terminal;
    status.innerHTML =
        "<i class='" +
        this.statusIconClasses.default +
        "fa fa-fw fa-minus'></i>";

    name.className = "td-name";
    location.className = "td-location";
    terminal.className = "td-terminal";
    status.className = "td-status";
};

_p.isValidStatus = function(statusStr) {
    return (
        ["pending", "failed", "fetching", "complete"].indexOf(statusStr) !== -1
    );
};

_p.modifyRowData = function(row, rowData) {
    if (
        rowData.hasOwnProperty("status") &&
        this.isValidStatus(rowData.status)
    ) {
        row.className = "td-status td-status-" + rowData.status;
        var icon = row.querySelector("i.fa");
        icon.className = this.statusIconClasses[rowData.status];

        return true;
    } else {
        return false;
    }
};

module.exports = SiteTableView;

},{}]},{},[1]);
