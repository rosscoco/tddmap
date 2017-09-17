/* Mock Objects:

MockBatchGeocoder
MockSiteTableView
MockCSVParser

*/

describe("CSV Data File Loading", function() {
    it("responds to the change event of the file selector and sends the file to the CSV loader", function() {});

    it("Does not initiate batch geocoding if parsing failed");

    it("Does not initiate batch geocoding if file does not contain any entries"
    );

    it("Initiates the Site Table View with the parsed CSV data");

    it("Initiates batch geocoding if csv parsing successfull");

    it("displays an error if the wrong file type is provided");
});

describe("Batch Geocoding responses", function() {
    it("Responds to the UPDATE event from the batch geocoder", function() {});

    it("Responds to the COMPLETE event from the batch geocoder", function() {});

    it("Responds to the COMPLETE event and retrys all rate limited failures", function() {});

    it("Responds to the COMPLETE event and shows success/fail summary once all geocides have been attempted", function() {});

    it("Updates the sita data table with every individual geocode", function() {});

    it("displays a summary of success/failed gecodes once all gecodes have been attempted", function() {});
});

describe("Table view updates", function() {
    it("Is updated once for every attempted geocode", function() {});
});
