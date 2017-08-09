
/* Mock Objects:

MockBatchGeocoder


*/


describe("CSV Data File Loading", function(){

    it("Does not initiate batch geocoding if parsing failed",function(){

    })

    it("Does not initiate batch geocoding if file does not contain any entries",function(){

    })

    it("Initiates the Site Table View with the parsed CSV data", function(){

    })

    it("Initiates batch geocoding if csv parsing successfull",function(){
        
    })

    it("displays an error if the wrong file type is provided", function(){

    })
})


describe("Batch Geocoding responses", function(){

    it("Responds to the UPDATE event from the batch geocoder", function()
    {

    })

    it("Responds to the COMPLETE event from the batch geocoder", function()
    {

    })

    it("Responds to the COMPLETE event and retrys all rate limited failures", function()
    {

    })

    it("Responds to the COMPLETE event and shows success/fail summary once all geocides have been attempted", function()
    {
        
    })

    it("Updates the sita data table with every individual geocode", function()
    {
        
    })

    it("displays a summary of success/failed gecodes once all gecodes have been attempted", function()
    {
        
    })
})

describe("Table view updates", function()
{
    it("Is updated once for every attempted geocode", function()
    {
        
    })
})