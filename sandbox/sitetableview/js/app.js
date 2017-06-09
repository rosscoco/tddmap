var PapaParse = require("../../../src/lib/papaparse.js");
var LocationLoader = require("../../../src/models/location_data_loader.js/");

(function(){

    var csvParser, geocoder,locationLoader;
    var locationData;

    window.onload = function(){
        
        var fileInput = document.getElementById("file-input");
        var locationLoader = new LocationLoader( PapaParse.parse, onLocationsLoaded );
        
        console.log( "ready", fileInput );

        fileInput.onchange = function( event ){
            locationLoader.onFileSelected( event );
        }

        function onLocationsGeocoded(err, results){
            
        }
    }

    function onLocationsLoaded(err, results){
        console.log("Locations Loaded " + results );

        locationData = results.data;
        debugger
        var postcodes = results.data.map( function( location ){
            return location.postcode;
        })

        var tableView = document.getElementById("site-table-view");
    
        if ( tableView.rows.length > 0 ) 
        {
            for ( var i = 0 ; i <  tableView.rows.length - 1; i++ )
            {
                tableView.deleteRow(-1);
            }
        }

        results.data.forEach( function( data )
        {
            makeRow(data);
        });

        function makeRow( rowData )
        {
            var row = tableView.insertRow(-1);
            row.insertCell(0).appendChild( document.createTextNode( rowData.name ));
            row.insertCell(1).appendChild( document.createTextNode( rowData.address ));
            row.insertCell(2).appendChild( document.createTextNode( rowData.terminal ));
            row.insertCell(3).appendChild( document.createTextNode( "Pending" ));
        }
    }
}())