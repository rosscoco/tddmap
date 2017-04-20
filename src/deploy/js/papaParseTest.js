
var result;
function onFileSelected( event )
{
    Papa.parse(event.target.files[0], {
        skipEmptyLines: true,
        header: true,
        complete: onParseComplete,
        error: onParseError,
    })
}

function onParseComplete( results ){
    result = results;
    console.log( results );
}

function onParseError( err ) {
    console.log( err )
}