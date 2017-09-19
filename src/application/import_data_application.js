(function() {
    var ImportDataController = require("../controller/import_data_controller.js");
    window.onload = function() {

        var body = document.querySelector("body");
        console.log(body.querySelector("#file-input-btn"));
        var app = new ImportDataController(body);
    };
})();
