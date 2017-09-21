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
    var batchGeocoder;
    var fileInput   = pageDOM.querySelector( "#file-input-btn" );
    var view        = new SiteTableView( pageDOM.querySelector("#site-table-view"));
    var csvLoader   = new CSVLoader( Papa.parse, _onParseComplete );
    var siteData    = {};
    
    fileInput.addEventListener("change", function(evt) {
       csvLoader.onFileSelected( evt );
    });

    function _onParseComplete(err, results) {
        if (err) {
            _showError(err);
        } else {
            _getLocationData(results);
        }
    }

    function _getLocationData(csvData) {
        var locationsArr = [];
        
        csvData.data.forEach(function(element) {
            locationsArr.push( element.address );
            siteData[ element.address ] = {name:element.name, location:element.address, terminal:element.terminal, lat:0, lng:0, status:"pending" };
            view.update(siteData[ element.address ]);
        });

        batchGeocoder = new GeoCoder( locationsArr, new google.maps.Geocoder(),_onAllLocationsEncoded,{ onUpdate:_onGeoLocationDataUpdated } );
        batchGeocoder.start();
    }

    function _showError( err, data ){
        console.log(err,data)
    }

    function _onGeoLocationDataUpdated(err, result ){
        //result = { locationId: locationId, status: status, msg: "", lat:"",lng:"",full_address:"" };
        var site;
        
        if (err){
            _showError(err, result);
        }
        else{
            try {
                site = siteData[result.locationId];
                site.status = result.status;
                site.lat = result.lat;
                site.lng = result.lng;
                site.full_address = result.full_address;
                view.update(site);
            } catch( e ) {
                _showError(new Error("Invalid location data received"), result );
            }
        }
    }

    function _onAllLocationsEncoded( results ){
        console.log("Done");
    }
}