var LocationLoader = require('../models/location_data_loader');
var GoodParseWithHeaders = require('./helpers/csvparsing.js').getGoodParseWithHeaders;
var StubParser  = require('./helpers/csvparsing.js').StubParser;
var sinon = require("sinon");
var chai = require('chai');
var expect = chai.expect;
chai.should();


describe("Checking CSV field names", function(){
    
    var fileSelectedEvent, loader, result;


    beforeEach(function(){
        result = GoodParseWithHeaders();
        fileSelectedEvent   = { target: { files:["file.txt"] } };
    })

    it("needs a minimum of three headers", function(){
        function onComplete( err, results ) {
            expect( err ).to.not.be.null;
        }

        result.meta.fields.pop();
        
        var loader = new LocationLoader( new StubParser( result ), onComplete );
        loader.onFileSelected( fileSelectedEvent );
    })

    it("expects name, location, and terminal to be defined as header fields", function(){
        function onComplete( err, results ) {
            expect( err ).to.be.null;
            expect( results.meta.fields.indexOf("name")).to.be.gte(0);
            expect( results.meta.fields.indexOf("terminal")).to.be.gte(0);
            expect( results.meta.fields.indexOf("location")).to.be.gte(0);
        }
        //result = Helpers.getGoodParseWithHeaders();
        var loader = new LocationLoader( new StubParser( result ), onComplete );
        loader.onFileSelected( fileSelectedEvent );
    })
})

describe("Checking for valid header field definitions...",function(){
    
    var completeCb, result, fileSelectedEvent;
    
    beforeEach( function(){
        completeCb = function ( err, results ) {
            expect( err ).to.not.be.null;
        }

        result = GoodParseWithHeaders();
        fileSelectedEvent   = { target: { files:["file.txt"] } };        
    })

    it("returns an error if name is not defined", function(){            
        
        result.meta.fields = ["notname", "location","terminal"];
        
        var loader = new LocationLoader( new StubParser( result ), completeCb );
        loader.onFileSelected( fileSelectedEvent );
    })

    it("returns an error if teminal is not defined", function(){
        result.meta.fields = ["name", " location","terminal"];
        
        var loader = new LocationLoader( new StubParser( result ), completeCb );
        loader.onFileSelected( fileSelectedEvent );
    })

    it("returns an error if location is not defined", function(){
        result.meta.fields = ["name", "location"," terminal "];
        
        var loader = new LocationLoader( new StubParser( result ), completeCb );
        loader.onFileSelected( fileSelectedEvent );
    })
})

