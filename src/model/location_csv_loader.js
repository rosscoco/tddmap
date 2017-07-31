module.exports = LocationLoaderFromFile;

function LocationLoaderFromFile( parseFunction, onComplete, parseOptions ){

    var result;
    this.file           = "No File Selected";

    this.parseOptions                   = parseOptions || {};
    this.parseOptions.skipEmptyLines    =  true;
    this.parseOptions.header            =  true;
    this.parseOptions.complete          = this.onParseComplete.bind( this );
    this.parseOptions.error             = this.onParseError.bind( this );
    
    this.parse          = parseFunction;
    this.onComplete     = onComplete;
}

var _p = LocationLoaderFromFile.prototype;

_p.onFileSelected = function( event ){
    var input = event.target;
    this.file = input.files[ 0 ];
    this.parse( this.file, this.parseOptions );
}

_p.onParseComplete = function( results ){
    var headers         = results.meta.fields.join("");
    var areHeadersValid = Utils.areHeadersPresent( results.meta.fields );    
    results             = Utils.removeInvalidResults( results );

    var success         = areHeadersValid //&& other conditions TODO

    if ( success ){
         this.onComplete( null, results );
    } else if ( !areHeadersValid ) {
        this.onFieldNameError( results );
    }
}

_p.onParseError = function( results ){
    console.log("onParseError")
}   

_p.onFieldNameError = function( results ) {
    this.onComplete("name/address/terminal are not defined as headers. Headers given were:" + results.meta.fields.join("/"), results );
}

var Utils = function()
{
    this.isEmptyString = function( s )
    {
        return typeof(s) === "string" && s.replace(/\s/g," ").length === 0;
    }

    this.isValidData = function ( dataObj ){
        var isValid = true;
        var errors = [];
        for ( var property in dataObj ){
            if ( dataObj.hasOwnProperty( property ) && this.isEmptyString( dataObj[ property ] )){                
                errors.push( property + "is not defined.");
                isValid = false;
            }
        }

        return { isValid:isValid, errors:errors.join(" ") };
    }

    this.areHeadersPresent = function( parsedHeaders ){
        var headersExist = ["name", "location", "terminal"].every( function( header ){
            return parsedHeaders.indexOf( header ) !== -1;
        })

        return headersExist && parsedHeaders.length >=3;
    }
    
    this.isValidTerminal = function( t ){
        return ["Grangemouth",
                "Kingsbury",
                "Bramhall",
                "IPC",
                "Seal Sands",
                "North Tees",
                "Thames",
                "West London"].indexOf(t) >=0;
    }

    //check for empty strings and add to error array
    this.removeInvalidResults = function( resultsToCheck ){
        
        var validData = [];
        var invalidData = [];
        var isValidResult;

        resultsToCheck.data.forEach( function( result ) {
            isValidResult = this.isValidData( result );
            if ( isValidResult.isValid && this.isValidTerminal( result.terminal ) ){
                validData.push( result );
            } else {
                invalidData.push( result );
            }
        });

        resultsToCheck.data = validData;
        resultsToCheck.invalid = invalidData;

        return resultsToCheck;
    }
    
    return this;

}()


