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