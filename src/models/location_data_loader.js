function LocationLoader( parser, onComplete, parseOptions ){

    var result;
    this.file           = "No File Selected";

    this.parseOptions                   = parseOptions || {};
    this.parseOptions.skipEmptyLines    =  true;
    this.parseOptions.header            =  true;
    this.parseOptions.complete          = this.onParseComplete.bind( this );
    this.parseOptions.error             = this.onParseError.bind( this );
    
    this.parser         = parser;
    this.onComplete     = onComplete;
}

var _p = LocationLoader.prototype;

_p.onFileSelected = function( event ){
    var input = event.target;
    this.file = input.files[ 0 ];
    this.parser.parse( this.file, this.parseOptions );
}

_p.onParseComplete = function( results ){
    console.log("onParseComplete")
    var headers = results.meta.fields.join("");
    var success = this.areHeadersPresent( results.meta.fields );
    results     = this.removeInvalidResults( results );

    if ( success ){
         this.onComplete( null, results );
    } else if (!this.areHeadersPresent( results.meta.fields)) {
        this.onFieldNameError( results );
    }
}

//check for empty strings and add to error array
_p.removeInvalidResults = function( resultsToCheck ){
    newResults = {data:[], error:[]}
    

    function isValidData( dataObj ){
        var isValid = true;
        var errors = [];
        for ( var property in dataObj ){
            if ( dataObj.hasOwnProperty(property)){
                if ( dataObj[property].replace(/\s/g," ").length === 0 ){
                    errors.push(property + "is not defined.");
                    isValid = false;
                }
            }
        }

        return { isValid:isValid, errors:errors.join(" ") };
    }


    var isValidResult;
    resultsToCheck.data.forEach( function( result ) {
        isValidResult = isValidData( result );
        if ( isValidResult.isValid ){
            data.push( result )
        }
    });
        
    })
}

_p.areHeadersPresent = function( parsedHeaders ){
    var headersExist = ["name", "location", "terminal"].every( function( header ){
        return parsedHeaders.indexOf( header ) !== -1;
    })

    var correctNumberofHeaders = parsedHeaders.length >=3;

    return headersExist && correctNumberofHeaders;
}


_p.onParseError = function( results ){
    console.log("onParseError")
}   

_p.onFieldNameError = function( results ) {
    this.onComplete("name/location/terminal are not defined as headers. Headers given were:" + results.meta.fields.join("/"), results );
}

module.exports = LocationLoader;


