var express = require("express");
var path  = require("path");
var open = require("open");

var app = express()


app.use(express.static(path.join(__dirname, '../src/deploy/')));

app.get('/', function( req,res){
    console.log(req.route)
    res.sendFile(path.join(__dirname, "../src/deploy/index.html"));
})

app.listen(8000, function(err){
    if ( err ){
        console.log(err)
    } else {
        open('http://localhost:8000');
    }
});