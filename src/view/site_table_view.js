


//addSiteData(array)
//receives an array and creates a table row for each one
    //deletes previous entries before adding

//updateSite( id, siteData, status )
    //
    
//getValidSiteData()
    //returns an array of sites with name, location, terminal, geodata properties set.

//getInvalidSiteData()
    //returns an array of sites without any of name, location, terminal, geodata properties set.

function SiteTableView( tableNode ) {
    if ( tableNode && tableNode.nodeType && tableNode.nodeType === 1 && tableNode.nodeName === "TABLE" ){
        this.tableNode = tableNode;
    } else {
        throw new IllegalArgumentError("SiteTableView instantiated without a <table>");
    }
}

var _p = SiteTableView.prototype;

_p.update = function( withData ) {
    if ( !!withData && 
        !!withData.hasOwnProperty && 
        withData.hasOwnProperty('name')     && withData.name.replace(" ","").length > 1 &&
        withData.hasOwnProperty('terminal') && withData.name.replace(" ","").length > 1 &&
        withData.hasOwnProperty('location') && withData.location.replace(" ","").length > 1 ) {
        
        var row  = this.rowExists( withData );

        if ( !row ) this.createRow( withData );
        else        return this.modifyRowData( row, withData );
        
        return true;

    } else {        
        return false;
    }
}

_p.rowExists = function( withData ){
    var id = (withData.terminal +"_" + withData.name).replace(" ","");
    var row = this.tableNode.querySelector("tbody").querySelector("#" + id );
    return row;
}

_p.createRow = function( rowData ){
    var row = this.tableNode.querySelector("tbody").insertRow();
    row.id = (rowData.terminal + "_" + rowData.name).replace(" ","");

    var name = row.insertCell();
    var location = row.insertCell();
    var terminal = row.insertCell();
    var status = row.insertCell();

    name.innerHTML = rowData.name;
    location.innerHTML = rowData.location;
    terminal.innerHTML = rowData.terminal;
    status.innerHTML = "<span></span>"
}

_p.isValidStatus = function( statusStr ){
    return ["pending","failed","fetching","complete"].indexOf(statusStr) !== -1;
}

_p.modifyRowData = function( row, rowData ){
    if ( rowData.hasOwnProperty('status') && this.isValidStatus( rowData.status ) ){
        var classes = row.className;
        
        ["status-pending","status-failed","status-fetching","status-complete"].forEach( function( toRemove ){
            classes = classes.replace(toRemove, "");
        })

        classes +="status-" + rowData.status;
        row.className = classes;
        return true;
    } else {
        return false;
    }

}

module.exports = SiteTableView;

