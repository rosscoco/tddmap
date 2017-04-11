var LocationLoader = require('../models/location_data_loader');
var Helpers = require('./helpers/csvparsing.js');
var sinon = require("sinon");
var chai = require('chai');
var expect = chai.expect;
chai.should();

describe("Should load a list of locations from a local csv or txt file", function(){

    function FileParserStub()
    {
        this.readyState = 0;
        this.onComplete
    }

    describe("Loading functions", function(){

        var fileReader, stub, fileSelectedEvent      
        it("Is Successful if....", function(){
            
            beforeEach( function(){

            });
        
            it("parses a valid input for each line in the file", function( done ){

            });
        })

        it("Is unsuccessful if...", function(){

  
        });
    })

    describe("Extraction Functions", function()
    {
        describe("Is Successful if", function()
        {
            it("the header fields have been defined correctly", function(){
                console.log("running test")
                var fileSelectedEvent   = { target: { files:["file.txt"] } };

                function StubParser()
                {
                    this.parse = function( file,args )
                    {
                        args.complete( Helpers.successfulParseWithHeaders );
                    }
                }

                function onComplete( err, results ) {
             
                    expect( results.meta.fields[0].should.equal('name') );
                    expect( results.meta.fields[1].should.equal('location') );
                    expect( results.meta.fields[2].should.equal('terminal') );
                }

                var loader = new LocationLoader( new StubParser, onComplete );
                loader.onFileSelected( fileSelectedEvent );
            })


            it("Can extract name, location and terminal from an input string", function()
            {

            });
        })

        it("is Unsuccessful if", function()
        {
            it("3 header fields have not been defined", function(){

            })

            it("cannot find a valid location", function(){

            })

            it("cannot find an associated terminal", function(){

            })
        })
    })
})