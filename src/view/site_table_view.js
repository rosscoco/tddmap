


//addSiteData(array)
//receives an array and creates a table row for each one
    //deletes previous entries before adding

//updateSite( id, siteData, status )
    //
    
//getValidSiteData()
    //returns an array of sites with name, location, terminal, geodata properties set.

//getInvalidSiteData()
    //returns an array of sites without any of name, location, terminal, geodata properties set.

function SiteTableView( tableNode) {
    if ( tableNode && tableNode.nodeType && tableNode.nodeType === 1 && tableNode.nodeName === "TABLE" ){
        this.tableElement = tableNode;
    } else {
        throw new IllegalArgumentError("SiteTableView instantaited without a <table>");
    }
}

var _p = SiteTableView.prototype;

_p.initView = function( table_node ){
    this.html = table_node;
}

_p.update = function( withData ) {
    if ( !!withData && 
        !!withData.hasOwnProperty && 
        withData.hasOwnProperty('name')     && withData.name.replace(" ","").length > 1 &&
        withData.hasOwnProperty('terminal') && withData.name.replace(" ","").length > 1 &&
        withData.hasOwnProperty('location') && withData.location.replace(" ","").length > 1 ) {
            
         return true;

    } else {
        return false;
    }
}

module.exports = SiteTableView;

