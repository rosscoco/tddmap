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

    var headers = results.meta.fields.join("");
    var allHeadersPresent = ["name", "location", "terminal"].every( function( header ){
        return results.meta.fields.indexOf( header ) !== -1;
    })

    if ( allHeadersPresent && results.meta.fields.length >= 3 ){
         this.onComplete( null, results );
    } else {
        this.onFieldNameError( results );
    }
}

_p.onParseError = function( results ){
    
}

_p.onFieldNameError = function( results ) {
    this.onComplete("name/location/terminal are not defined as headers", results );
}

module.exports = LocationLoader;


