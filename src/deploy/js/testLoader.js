var reader = new FileReader()

    reader.onloadstart = printEventType;
    reader.onprogress = printEventType;
    reader.onload = this.onLocationFileLoaded;
    reader.onloadend = printEventType;
    reader.onabort = printEventType;
    reader.onerror = printEventType;

console.log("opened")

function printEventType(event)
{
    console.log( event.type );
}    
