var LocationLoader = require("./location_csv_loader");
var parseHelper = require("../helper/csv_parsing_responses");
var StubParser = require("../helper/csv_parsing_responses").StubParser;
var sinon = require("sinon");
var chai = require("chai");
var expect = chai.expect;
chai.should();

/*Location Loader:
    -Loads a CSV file
        -completes with an error if file not found/loaded
    -Checks the required headers are present
    -parses a name, location and terminal for each entry    
        -lines with these non-blank fields added to the data array
        -lines without these fields added to an error array
        -lines with these fields defined but empty to an invalid array

Errors on:
    

*/

var fileSelectedEvent, loader, result;

beforeEach(function() {
    fileSelectedEvent = { target: { files: ["file.txt"] } };
    result = parseHelper.getGoodParseWithHeaders();
});

describe("Checking CSV field names", function() {
    function detectErrorCB(err, results) {
        expect(err).to.not.be.null;
    }

    beforeEach(function() {
        result = parseHelper.getGoodParseWithHeaders();
    });

    it("completes with error if not three headers present", function() {
        result.meta.fields.pop();

        var loader = new LocationLoader(new StubParser(result), detectErrorCB);
        loader.onFileSelected(fileSelectedEvent);
    });

    it("expects name, location, and terminal to be defined as header fields", function() {
        function onComplete(err, results) {
            expect(err).to.be.null;
            expect(result.meta.fields).to.include(
                "name",
                "location",
                "terminal"
            );
        }

        //result = Helpers.getGoodParseWithHeaders();
        var loader = new LocationLoader(new StubParser(result), onComplete);
        loader.onFileSelected(fileSelectedEvent);
    });

    it("returns an error if name is not defined", function() {
        result.meta.fields = ["notname", "location", "terminal"];

        var loader = new LocationLoader(new StubParser(result), detectErrorCB);
        loader.onFileSelected(fileSelectedEvent);
    });

    it("returns an error if teminal is not defined", function() {
        result.meta.fields = ["name", " location", "terminal"];

        var loader = new LocationLoader(new StubParser(result), detectErrorCB);
        loader.onFileSelected(fileSelectedEvent);
    });

    it("returns an error if address is not defined", function() {
        result.meta.fields = ["name", " address", " terminal "];

        var loader = new LocationLoader(new StubParser(result), detectErrorCB);
        loader.onFileSelected(fileSelectedEvent);
    });
});

describe("Extracts a location from the data: ", function() {
    var dataToCompare;

    beforeEach(function() {
        dataToCompare = parseHelper.getSingleLocationData().data[0];
        result = parseHelper.getGoodParseWithHeaders();
    });

    it("expects an entry to have name, location and terminal fields", function() {
        function onComplete(err, result) {
            expect(err).to.be.null;
            expect(result.data[0]).to.contain.all.keys(
                "name",
                "location",
                "terminal"
            );
        }

        var loader = new LocationLoader(new StubParser(result), onComplete);
        loader.onFileSelected(fileSelectedEvent);
    });

    it("adds an entry to the invalid array if no name data", function() {
        result = parseHelper.getGoodParseWithHeaders();
        result.data[0].name = "";
        dataToCompare.name = "";

        function onComplete(err, res) {
            expect(res.invalid).to.include(dataToCompare);
        }

        var loader = new LocationLoader(new StubParser(result), onComplete);
        loader.onFileSelected(fileSelectedEvent);
    });

    it("adds the entry to the invalid array if no location data", function() {
        result = parseHelper.getSingleLocationData();
        result.data[0].location = "";
        dataToCompare.location = "";

        function onComplete(err, result) {
            expect(result.invalid).to.include(dataToCompare);
        }

        var loader = new LocationLoader(new StubParser(result), onComplete);
        loader.onFileSelected(fileSelectedEvent);
    });

    it("adds the entry to the invalid array if no terminal data", function() {
        result = parseHelper.getSingleLocationData();
        result.data[0].terminal = "";
        dataToCompare.terminal = "";

        function onComplete(err, result) {
            expect(result.invalid).to.include(dataToCompare);
        }

        var loader = new LocationLoader(new StubParser(result), onComplete);
        loader.onFileSelected(fileSelectedEvent);
    });

    it("will not parse an entry if the terminal is not on the accepted list", function() {
        result = parseHelper.getSingleLocationData();
        result.data[0].terminal = "NotBramhall";
        dataToCompare.terminal = "NotBramhall";

        function onComplete(err, res) {
            expect(res.invalid).to.include(dataToCompare);
        }

        var loader = new LocationLoader(new StubParser(result), onComplete);
        loader.onFileSelected(fileSelectedEvent);
    });
});
