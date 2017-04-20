var assert = require('assert');
var sinon = require('sinon');
var LocationFinder = require('../models/batch_geocoder');
var helpers = require('./helpers');

describe('Batch Location Finder', function(){

    describe("Geocoding....", function(){
       
       function GeocoderStub(){
            this.geocode = function(){};
        } 
        
        var geocoder;
        var batchGeocoder;

        describe("Is Successful if...", function(){

            describe('On receiving a status of OK...', function(){

                beforeEach( function(){
                    geocoder = new GeocoderStub();
                    batchGeocoder   = new LocationFinder( 'CM1 4QS', geocoder, function(){} );                
                })

                it("should async call onGeocodeResponse with the found location", function(done){
                    batchGeocoder   = new LocationFinder( 'CM1 4QS', geocoder, function(){
                        console.log("calling done");
                        assert( batchGeocoder.onGeocodeResponse.called );
                        done();
                    });

                    sinon.spy( batchGeocoder,'onGeocodeResponse' );
                    sinon.stub( geocoder,'geocode').yieldsAsync( helpers.singleValidGeocodeResponse,"OK");

                   batchGeocoder.start();
                })

                it('should add the location to the success array if a single valid location is returned', function(done){

                    var onComplete = function(){
                        
                        var calledWith = batchGeocoder.onLocationFound.getCall(0).args[ 0 ];
                        
                        assert.deepEqual( calledWith, helpers.parsedValidResponse );
                        assert( batchGeocoder.onLocationFound.called );
                        assert( batchGeocoder.success.length === 1 );
                        
                        done();
                    };

                    batchGeocoder   = new LocationFinder( 'CM1 4QS', geocoder, onComplete );

                    sinon.spy( batchGeocoder,'onLocationFound' );
                    sinon.stub( geocoder,'geocode').yields( helpers.singleValidGeocodeResponse,"OK");

                    batchGeocoder.start();

                  
                })
            })
        })

        describe("Is not successful if...", function(){

            beforeEach( function(){
                geocoder = new GeocoderStub();     
                sinon.stub(geocoder,'geocode').yields( helpers.singleValidGeocodeResponse,"OK");
            });


            it("does not receive a response for every provided location", function()
            {
                var locations = [];
                for ( var i = 0; i < 10 ; i++ ) {
                    locations.push( helpers.singleValidGeocodeResponse )
                }

                batchGeocoder = new LocationFinder( locations, geocoder, function(){} );

                sinon.spy(batchGeocoder, "onGeocodeResponse");
                sinon.spy(batchGeocoder, "getLocationData");

                batchGeocoder.start();
                
                assert( batchGeocoder.getLocationData.called )
                assert( batchGeocoder.onGeocodeResponse.callCount === 10 );
            })
        })

        describe('Error handling...', function () {
            
            beforeEach( function(){
                 geocoder = new GeocoderStub();  
            })

            it("returns an array of not found locations",function(){

                var location1 = {address:'abc'};
                var location2 = {address:'xyz'};
                sinon.stub( geocoder,'geocode').yields( [],"ZERO RESULTS" );

                function onComplete(results){
                    assert( results.errors.length === 2);
                    assert( results.errors[ 0 ].address === location1.address );
                    assert( results.errors[ 1 ].address === location1.address );
                }; 

                batchGeocoder   = new LocationFinder( [ location1.address,location2.address ], geocoder, onComplete );
            })

            describe("Should handle rate limited responses",function(){
                var stub, delay, rateIncrease, settings, startTime, geocoder;

                beforeEach( function(){
                    geocoder = new GeocoderStub();
                    stub = sinon.stub( geocoder,'geocode');
                    delay = 10;
                    rateIncrease = 1;
                    startTime = new Date().getTime();
                    settings = { geocodeInterval:delay, rateIncrease:rateIncrease };
                })

                it("delays the next if OVER_QUERY_LIMIT received", function(done){
                    
                    stub.onCall(0).yields( [],"OVER_QUERY_LIMIT" );
                    stub.onCall(1).yields(helpers.singleValidGeocodeResponse,"OK");                    

                    function onComplete( status, results ){
                        var endTime = new Date().getTime();
                        assert( endTime - startTime > 10, "Should delay after request limit reached before geocoding next item");
                        done();
                    }
                    
                    batchGeocoder   = new LocationFinder( [ "abc","def" ], geocoder, onComplete, settings );
                    batchGeocoder.start();
                })

                it("increments the geocode interval for each subsequent OVER_QUERY_LIMIT received", function(done){

                    stub.onCall(0).yields(helpers.singleValidGeocodeResponse,"OK");
                    stub.onCall(1).yields( [],"OVER_QUERY_LIMIT" );
                    stub.onCall(2).yields( [],"OVER_QUERY_LIMIT" );
                    stub.onCall(3).yields( [],"OVER_QUERY_LIMIT" );
                    stub.onCall(4).yields( [],"OVER_QUERY_LIMIT" );
                    
                    function onComplete( status, results ){
                        var endTime = new Date().getTime();
                        assert( endTime - startTime >= 40 , "Should delay after request limit reached before geocoding next item");
                        done();
                    }

                    var startTime   = new Date().getTime();
                    settings.geocodeInterval = 0;
                    settings.rateIncrease = 10;
                    batchGeocoder   = new LocationFinder( [ "abc","def","abc","def","abc" ], geocoder, onComplete, settings );
                    batchGeocoder.start();
                })
            })
        });
    })
})
