var fs = require("fs");
var path = require("path")
var getSiteName = function(){
    var increment = 1;
    return function()
    {
        return "site " + increment++;
    }
}()


extractData();

function extractData( fromDataArr ){
    var maxEntries = Number(process.argv[2])

    var fileData = JSON.parse(fs.readFileSync(path.join(__dirname, "data","sites.json")));
    var newDataArr = fileData.postalCodes.map( objToCSV );    
    newDataArr.unshift("name,postcode,terminal");
    
    if ( typeof( maxEntries ) === 'number' && newDataArr.length > maxEntries + 1){
        newDataArr.splice( maxEntries + 1 );
    }

    fs.writeFileSync(path.join(__dirname,"data","parsedSites.csv"), newDataArr.join('\r\n'));

    function objToCSV( fromObj ) {
        return getSiteName() + ',' + fromObj.postalCode + ',' + getRandomTerminal();
    }
}

function getRandomTerminal()
{
    var terminals =  [  "Grangemouth",
                        "Kingsbury",
                        "Bramhall",
                        "IPC",
                        "Seal Sands",
                        "North Tees",
                        "Thames",
                        "West London"]

    return terminals[ Math.floor( Math.random()* terminals.length )];
}

