var assert = require('assert');
var sinon = require('sinon');
var LocationFinder = require('../models/batch_geocoder');
var helpers = require('./helpers');


describe('Batch Location Finder', function(){

    describe("Geocoding Events....", function(){
        function GeocoderStub(){
            this.geocode = function(){};
        }        

        var geocoder;
        var batchGeocoder;

        describe("Are Successful if...", function(){

            describe('On receiving a status of OK...', function(){

                beforeEach( function(){
                    geocoder = new GeocoderStub();
                    batchGeocoder   = new LocationFinder( 'CM1 4QS', geocoder, function(){} );                
                })

                it("should call onGeocodeResponse with the found location", function(){
                    batchGeocoder   = new LocationFinder( 'CM1 4QS', geocoder, function(){} );   
                    sinon.spy( batchGeocoder,'onGeocodeResponse' );
                    sinon.stub(geocoder,'geocode').yields( helpers.singleValidGeocodeResponse,"OK");

                   batchGeocoder.start();

                    assert( batchGeocoder.onGeocodeResponse.called );
                })

                it('should add the location to the success array if a single valid location is returned', function(){
                     
                    sinon.spy( batchGeocoder,'onLocationFound' );
                    sinon.stub( geocoder,'geocode').yields( helpers.singleValidGeocodeResponse,"OK");

                    batchGeocoder.start();

                    var calledWith = batchGeocoder.onLocationFound.getCall(0).args[ 0 ];

                    assert.deepEqual( calledWith, helpers.parsedValidResponse );

                    assert( batchGeocoder.onLocationFound.called );
                    assert( batchGeocoder.success.length === 1 );
                })
            })
        })

        describe("Are not successful if...", function(){

            beforeEach( function(){
                geocoder = new GeocoderStub();     
                sinon.stub(geocoder,'geocode').yields( helpers.singleValidGeocodeResponse,"OK");
            });


            it("does not receive a response for every provided location", function()
            {
                var locations = [];
                for (var i = 0; i < 10 ; i++) {
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

        
        describe('Error handling', function () {
            
            before( function(){
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
        });
    })
})

