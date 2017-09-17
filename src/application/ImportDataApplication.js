(function(){
    var ImportDataController = require('../controller/import_data_controller.js');
    window.onload = function(){
        var app = new ImportDataController( document.querySelector('body'));
    }
}());


