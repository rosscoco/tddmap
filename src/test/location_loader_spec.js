var LocationParser = require('../models/location_data_loader');
var sinon = require("sinon");
var chai = require('chai');
chai.should();

describe("Should load a list of locations from a local csv or txt file", function(){

    function FileReaderStub()
    {
        this.readyState = 0;
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

            var siteLoader, fileReader, fileSelectedEvent;            

            beforeEach( function(){
                fileReader          = new FileReaderStub();              
                fileSelectedEvent   = { target: { files:["file.txt"] } };
            });

            it("cannot open the file", function(){
               
               siteLoader = new LocationParser( fileReader, function( err, res ){
                    expect( err ).to.not.be.null;
                    expect( res ).to.be.empty;
                });
                
                sinon.stub( fileReader,"readAsText", fileReader.onerror );
                siteLoader.onFileSelected( fileSelectedEvent );
            })

            xit("the file is empty", function(){
                siteLoader = new LocationParser( fileReader, function( err, res ){
                    expect(err).to.not.be.null;
                    expect(res).to.be.empty;
                });

                reader.result = "";
                sinon.stub( fileReader,"readAsText", fileReader.onload );
            })

            it("cannot extract any locations from the data", function(){
                siteLoader = new LocationParser( fileReader, function( err, res ){
                    expect( err ).to.not.be.null;
                    expect( res ).to.be.empty;
                });

                reader.result = "vcneowecvf niowenm iowegwe oigwempoi gewpog";
                sinon.stub( fileReader,"readAsText", fileReader.onload );
            });

            it("finds a malformed data structure", function(){

            });            
        });
    })

    describe("Extraction Functions", function()
    {
        it("Is Successful if", function()
        {
            it("Can extract name, location and terminal from an input string", function()
            {

            });
        })

        it("is Unsuccessful if", function()
        {
            it("cannot find a site name", function(){

            })

            it("cannot find a valid location", function(){

            })

            it("cannot find an associated terminal", function(){

            })
        })
    })
})