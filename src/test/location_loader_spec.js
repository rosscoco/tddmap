var LocationLoader = require('../models/location_data_loader');
var GoodParseWithHeaders = require('./helpers/csvparsing.js').getGoodParseWithHeaders;
var GoodParseWithMissingData = require('./helpers/csvparsing.js').getGoodParseWithMissingData;
var StubParser  = require('./helpers/csvparsing.js').StubParser;
var sinon = require("sinon");
var chai = require('chai');
var expect = chai.expect;
chai.should();

/*Location Loader:
    -Loads a CSV file
        -completes with an error if file not found/loaded
    -Checks the required headers are present
    -parses a name, location and terminal for each entry
        -lines with these non-blank fields added to a complete array
        -lines without these fields added to an incomplete array        

*/

var fileSelectedEvent, loader, result;


beforeEach(function(){
    fileSelectedEvent   = { target: { files:["file.txt"] } };
    result = GoodParseWithHeaders();
})

xdescribe("Chai test Functions", function(){

    it ("checks an array for the presence of an object", function(){
    var result = {
        "name": "site name",
        "location": "",
        "terminal": "Bramhall"
        }

        var arr = [];
        arr.push(result)

        expect(arr).to.include({
        "name": "site name",
        "location": "",
        "terminal": "Bramhall"
        });
    })
})

describe("Checking CSV field names", function(){
        
    function detectErrorCB ( err, results ) {
        expect( err ).to.not.be.null;
    }


    beforeEach( function() {
        result = GoodParseWithHeaders();
    })

    it("completes with error if not three headers present", function(){

        result.meta.fields.pop();
        
        var loader = new LocationLoader( new StubParser( result ), detectErrorCB );
        loader.onFileSelected( fileSelectedEvent );
    })

    it("expects name, location, and terminal to be defined as header fields", function(){
        function onComplete( err, results ) {
            expect( err ).to.be.null;
            expect( result.meta.fields ).to.include("name","location","terminal");
        }

        //result = Helpers.getGoodParseWithHeaders();
        var loader = new LocationLoader( new StubParser( result ), onComplete );
        loader.onFileSelected( fileSelectedEvent );
    })

    it("returns an error if name is not defined", function(){            
        
        result.meta.fields = ["notname", "location","terminal"];
        
        var loader = new LocationLoader( new StubParser( result ), detectErrorCB );
        loader.onFileSelected( fileSelectedEvent );
    })

    it("returns an error if teminal is not defined", function(){
        result.meta.fields = ["name", " location","terminal"];
        
        var loader = new LocationLoader( new StubParser( result ), detectErrorCB );
        loader.onFileSelected( fileSelectedEvent );
    })

    it("returns an error if location is not defined", function(){
        result.meta.fields = ["name", " location"," terminal "];
        
        var loader = new LocationLoader( new StubParser( result ), detectErrorCB );
        loader.onFileSelected( fileSelectedEvent );
    })
})

describe.only("Extracts a location from the data: ", function()
{
    var dataToCompare;

    beforeEach( function() {
        dataToCompare = {
            "name": "rossco",
            "location": "cm1",
            "terminal": " Bramhall"
        }

        result = GoodParseWithHeaders();
    })

    it("expects an entry to have name, location and terminal fields", function(){
        
        function onComplete( err, result ){
            expect( err ).to.be.null;     
            expect( result.data[ 0 ] ).to.contain.all.keys("name","location","terminal");
        }

        var loader = new LocationLoader( new StubParser( result ), onComplete );
        loader.onFileSelected( fileSelectedEvent );
    })

    it("adds an entry to the errors array if no name data", function(){
        
        dataToCompare.name = "";

        result = GoodParseWithMissingData();

        function onComplete( err, result ){            
            expect( result.errors ).to.include( dataToCompare )
        }

        var loader = new LocationLoader( new StubParser( result ), onComplete );
        loader.onFileSelected( fileSelectedEvent );
    })

    it("adds the entry to the errors array if no location data", function(){
        
        dataToCompare.location = "";

        result = GoodParseWithMissingData();

        function onComplete( err, result ){            
            expect( result.errors ).to.include( dataToCompare )
        }

        var loader = new LocationLoader( new StubParser( result ), onComplete );
        loader.onFileSelected( fileSelectedEvent );
    })

    
    it("adds the entry to the errors array if no terminal data", function(){
        
        dataToCompare.terminal = " ";

        result = GoodParseWithMissingData();

        function onComplete( err, result ){            
            expect( result.errors ).to.include( dataToCompare )
        }

        var loader = new LocationLoader( new StubParser( result ), completeCb );
        loader.onFileSelected( fileSelectedEvent );
    })

    it("will not parse an entry if the terminal is not on the accepted list", function(){
        
        dataToCompare.name = "";

        result = GoodParseWithMissingData();

        function onComplete( err, result ){            
            expect( result.errors ).to.include( dataToCompare )
        }

        var loader = new LocationLoader( new StubParser( result ), completeCb );
        loader.onFileSelected( fileSelectedEvent );
    })
})

describe("Returns multiple entries", function(){

    it("Completes with a list of successful loads", function(){

    })

    it("Completes with a list of unsuccessful loads", function(){

    })
})

