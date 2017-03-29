var fs 				= require('fs');
var csv 			= require('csv-streamify');
var Transform 		= require('stream').Transform;
var JSONStream		= require('JSONStream');
var geocoder		= require('geocoder');
var allData 		= require('../done.json')
var sortedData 		= require('./sorted.json')
var Bottleneck		= require('bottleneck')

var csvToJSON 		= csv({objectMode:true,newline:'\r\n'});
var parser 			= new Transform({objectMode:true});
var JSONToStrings 	= JSONStream.stringify(false);


/*
0 Customer Name
1 Postcode
2 SAP Account
3 Delivery Terminal
*/

parser._transform = function(data, encoding, done) 
{
	if (!this._sites )
	{
		this._sites = [];
		this._terminals = {}
	}

	var terminals = {}
	var site = {}
	site.name 		= data[0];
	site.postcode 	= data[1];
	site.account 	= data[2];
	site.terminal 	= data[3];

	if ( !this._terminals.hasOwnProperty( data[3] ))
	{
		this._terminals[data[3]] = {}
	}

	this._terminals[site.terminal][data[0]] = site;


  	this._sites.push( site );
  	done();
};





parser._flush = function( done )
{
	var json = {}
	var site;

	this.push( this._terminals )
	done();
}

function parseCSVToJSON( )
{
	fs.createReadStream( "src/codes.csv" )
		.pipe( csvToJSON )
		.pipe( parser )
		.pipe( JSONToStrings )
		.pipe( fs.createWriteStream('done.js'));
}

function getPropsAsArray( object )
{
	var things = [];
	for ( var thing in object )
	{
		if ( object.hasOwnProperty( thing ))
		{
			things.push( object[ thing ]);
		}
	}

	return things
}


function convertToPostcodeSorted()
{
	var terminals = {};
	var sitesByPostcode


	for ( var terminalName in allData )
	{
		if ( !terminals.hasOwnProperty( terminalName ))
		{			
			sitesByPostcode = sortSitesByPostcode( allData[ terminalName ])
			terminals[terminalName] = sitesByPostcode
		}
	}

	fs.writeFileSync('sorted.json', JSON.stringify(terminals));
}



function sortSitesByPostcode( terminalData )
{
	var sites = {}

	for ( var siteName in terminalData )
	{
		if ( terminalData.hasOwnProperty(siteName ))
		{
			var siteData = terminalData[ siteName ];

			if ( !sites.hasOwnProperty( siteData.postcode ) )
			{
				sites[siteData.postcode] = new Site()
			}

			var currentSite = sites[siteData.postcode];
			currentSite.addName( siteData.name );
			currentSite.terminal = siteData.terminal;
		}
	}

	return sites;
}

function Site()
{
	this.names = []
	this.terminal = 'Not Set';
	this.isKeyFuels = false;
	this.isUKFuels = false;
}

Site.prototype.addName = function( name )
{
	this.names.push( name )
	if ( name.toLowerCase().includes('uk fuels') ) 			this.isUKFuels = true;
	else if ( name.toLowerCase().includes('keyfuels') ) 	this.isKeyFuels = true;
}

Site.prototype.toJSON = function()
{
	return { name:this.names[0], allNames:this.names, terminal:this.terminal, isUK:this.isUKFuels, isKey:this.isKeyFuels}
}

Site.prototype.getName = function()
{
	return this.names[0];
}



function getLocationData()
{
	var queue 			= new Bottleneck( 1,110 );
	
	


	for ( var terminalName in sortedData )
	{
		if ( !sortedData.hasOwnProperty( terminalName )) continue 
		
		var locations = sortedData[ terminalName ];

		for ( var postcode in locations )
		{
			if ( !locations.hasOwnProperty( postcode )) continue 

			var locationData = locations[postcode];
			var callback = assignCoords.bind( locationData )			

			var newFunc = function()
			{
				geocoder.geocode( postcode, callback )
			}

			queue.submit( newFunc, postcode, callback );
		}

		break
	}

	queue.on( 'empty', function ()
	{
  		console.log( 'Queue Has Finished' );
	});
}


function assignCoords( err, data )
{
	if ( err ) 
	{
		console.log( 'Error geocoding ' + this.name );
		console.log( err );
	}
	else
	{
		this.lat = data.geometry.lat;
		this.long = data.geometry.long;
	}
}


getLocationData();