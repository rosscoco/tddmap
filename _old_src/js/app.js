var map;
var sites		= [];
var names;
var terminals;

var colors = {
	"Bramhall":"19BD9B",
	"Grangemouth":"2ECD71",
	"Aberdeen Caledonian":"2ECD71",
	"Inverness":"2ECD71",
	"IPC":"E84C3D",
	"Kingsbury":"9A59B5",
	"Birmingham":"9A59B5",
	"North Tees":"F2C40F",
	"Teesside Vopak":"F2C40F",
	"Thames":"304cd5",
	"Grays":"304cd5",
	"West London":"304cd5" }

$( init )


function init()
{
	loadSites();
	
	showMap();
	initUI();
}

function sortSitesByName( a, b)
{
	if ( a.name.toLowerCase() < b.name.toLowerCase() ) return -1
	else if ( a.name.toLowerCase() > b.name.toLowerCase() ) return 1
	else return 0;
}

function loadSites()
{
	var results = parseSiteData( all_site_locations );
	sites 		= results.locations.sort( sortSitesByName );	
	terminals 	= results.terminals;
	names 		= results.names;
}

function initUI()
{
	var lastHovered;

	updateSiteList( sites );

	$('.terminal-list :checkbox').change( function()
	{
		console.log( this.id );
		toggleVisibleSites( this );
		updateSiteList();
	});

	$("#select-all-terminals").click( function()
	{
		console.log(this)
		$('.terminal-list :checkbox').each( function()
		{
			$(this).attr("checked","");
			this.checked = true;
			
			toggleVisibleSites( this );
		})

		updateSiteList();
	});

	$("#deselect-all-terminals").click( function()
	{
		console.log(this)
		$('.terminal-list :checkbox').each( function()
		{
			$(this).removeAttr("checked");
			this.checked = false;
			
			toggleVisibleSites( this );
		});

		updateSiteList();
	});

	$(".site-list").on('mouseenter','li', function()
	{
		var site = names[ this.textContent ];
		site.marker.setIcon( site.bigIcon )		
	});

	$(".site-list").on('mouseleave','li', function()
	{
		var site = names[ this.textContent ];
		site.marker.setIcon( site.littleIcon );
	});

	$("#check-labels").change(function()
	{
		if ( this.checked )	sites.forEach( function( site ) { site.showLabel() });
		else 				sites.forEach( function( site ) { site.hideLabel() });
	});
}

function highlightMarker( name, lastHighlight )
{
	var site = sitesByName[ name ];
	var oldSite = sitesByName[ lastHighlight ]

	if ( oldSite ) oldSite.setIcon( oldSite.littleIcon );
}

function getVisibleSites()
{
	var isVisible = [];
	$('.terminal-list :checkbox').each( function()
	{
		if ( this.checked )
		{
			isVisible = isVisible.concat( terminals[ this.id.split("-")[ 1 ] ] );
		}
	})

	return isVisible.sort( sortSitesByName );
}



function toggleVisibleSites( terminal_cb )
{
	var visibleSites = [];
	var terminalName = terminal_cb.id.split("-")[1];
	var terminal = terminals[ terminalName ];

	terminal.forEach( function( site )
	{
		if ( terminal_cb.checked ) 	site.showMarker();
		else						site.hideMarker();
	});
}

function updateSiteList( withSites )
{
	if ( !withSites ) withSites = getVisibleSites();

	var $siteList = $(".site-list ul");
	$siteList.empty();
	
	var $li;

	withSites.forEach( function( site )
	{
		 $li = $('<li>' + site.name + '</li>');
		 
		 $siteList.append( $li );
	});
}

function showMap()
{
	var mapOpts 	= {}
	mapOpts.center 	= { lat:53.701441, lng:-1.662306 };
	mapOpts.zoom 	= 7;
	map 			= new google.maps.Map( document.getElementById('map'), mapOpts );

	sites.forEach( function( site )
	{
		site.makeMarker( map, colors[ site.terminal ], true );
	});
}


function parseSiteData( locationsObj )
{
	var sitesByTerminal = {};
	var sitesByLocation	= [];
	var sitesByName		= {};
	var terminalName 	='';

	for ( var postcode in locationsObj )
	{
		var location = new Location( locationsObj[ postcode ] );

		terminalName = location.terminal.split(" ").join("").toLowerCase()

		if ( !sitesByTerminal.hasOwnProperty( terminalName) )
		{
			sitesByTerminal[ terminalName] = [];
		}

		sitesByTerminal[ terminalName ].push( location );
		sitesByLocation.push( location );
		sitesByName[ location.name ] = location;
	}

	return { terminals:sitesByTerminal, locations:sitesByLocation, names:sitesByName };
}

function Location( data )
{
	this.data = data;
	this.terminal = this.data.terminal;
	this.selectName();
}

Location.prototype.makeMarker= function( map, pinColor, show ) 
{
	this.map = map;
	this.bigIcon = new google.maps.MarkerImage(
        "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
        null,
        null,
        null);

	this.littleIcon = new google.maps.MarkerImage(
        "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
        null,
        null,
        null,
        new google.maps.Size(10,15));
	
	var markerOpts = {};
	markerOpts.position = new google.maps.LatLng( this.data.lat, this.data.lng )
	markerOpts.labelContent = this.getName();	
	//this.marker = new google.maps.Marker( { position:new google.maps.LatLng( this.data.lat, this.data.lng )});
	this.marker = new MarkerWithLabel( markerOpts );
	this.marker.setIcon( this.littleIcon );
	if ( show ) this.showMarker();
	this.hideLabel();
}

Location.prototype.selectName = function()
{
	var bunkeringNames = [];
	var retailName = '';
	var searchFor = ["KEYFUELS D","UK FUELS D","KEY FUELS D"];

	outer:for ( var i = 0; i < this.data.allNames.length; i++ )
	{
		for ( var j = 0; j < searchFor.length; j++ )
		{
			if( this.data.allNames[i].indexOf(searchFor[j]) > -1 )
			{
				bunkeringNames.push( this.data.allNames[i].substring( searchFor[j].length ));
				continue outer;
			}
		}

		retailName = this.data.allNames[ i ]
	}

	if ( retailName == '' ) this.name = bunkeringNames[0];
	else
	{
		this.name = retailName
		var remove = [' D ', ' S STN',' SERVICE STATION',' S/STN',' F/STN',' STN',' FILLING STATION',' GARAGE','S/STATION'];

		for ( var i = 0; i < remove.length; i++)
		{
			this.name = this.name.split(remove[i])[0];	
		}
	} 					
}

Location.prototype.showMarker= function() 
{
	this.marker.setMap( this.map );
}

Location.prototype.hideMarker= function() 
{
	this.marker.setMap( null );
}

Location.prototype.showLabel= function() 
{
	this.marker.showLabel()//.setMap( this.map );
}

Location.prototype.hideLabel= function() 
{
	this.marker.hideLabel();
}


Location.prototype.getName = function()
{
	return this.name;
	//return this.data.allNames[ 0 ];
}
