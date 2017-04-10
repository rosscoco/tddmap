function LocationLoader( fileReader, dataparser, onComplete ){

    var result;
    this.fileReader         = fileReader;
    this.file               = "No File Selected";
    this.parser             = dataparser;
    this.onComplete         = onComplete;
    
    fileReader.onloadstart  = this.onFileReadStart;
    fileReader.onprogress   = this.onFileReadProgress;    
    fileReader.onload       = this.onFileLoaded;
    fileReader.onloadend    = this.onFileReadLoadEnd;
    fileReader.onabort      = this.onFileReadError;
    fileReader.onerror      = this.onFileReadError;
}

var _p = LocationLoader.prototype;

_p.cancelLoad = function()
{
    switch ( this.reader.readyState )
    {
        case 0:                         
        case 1:     reader.abort();
                    this.onComplete(new Error("Load was cancelled before completing"));
                    break;
        case 2:     
                    break;
        default:
    }
}

_p.onFileSelected = function( event ){
    var input = event.target;
    this.file = input.files[ 0 ];
    reader.readAsText( this.file );
}

_p.onLocationFileLoaded = function(event){
    result = reader.result;
    onComplete(null, "Loaded!");
}

_p.onFileReadStart = function(event){

}

_p.onFileReadProgress = function(event){
    
}

_p.onFileLoaded = function(event){
    
}

_p.onFileReadLoadEnd = function(event){
    
}

_p.onFileReadError = function(event){
    this.onComplete( new Error("File Could Not Be Loaded"), null );
}

module.exports = LocationParser;

