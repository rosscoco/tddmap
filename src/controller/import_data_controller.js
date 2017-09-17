//globals Papa
module.exports = ImportDataController

var CSVLoader = require('../model/location_csv_loader');
var SiteTableView = require('../view/site_table_view');
var GeoCoder = require('../model/batch_geocoder');

function ImportDataController( pageDOM ){
    this.initView( pageDom );
}

var _p = ImportDataController.prototype;


_p.initView = function( withDOM ) {
    this.fileInput = pageDOM.querySelector("#file-input-btn");
    this.view = new SiteTableView( withDom.querySelector('table-holder'));
    fileInput.addEventListener('change', this.onFileSelected );
}

_p.onFileSelected = function( evt ) {
    this.csvLoader = new CSVLoader( Papa, this.onParseComplete )
}

_p.onParseComplete = function( err, results ) {
    if (err) this.showError( err )
    else     this.showCSVData( results );
}

_p.showCSVData = function( csvData )
{
    console.log( csvData );
}





