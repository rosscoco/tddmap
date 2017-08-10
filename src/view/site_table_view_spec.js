var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var SiteTableView = require('./site_table_view.js');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
var Helpers = require("../helper/site_table_view_data.js")
chai.should();

    describe("Initialisation...", function(){
        
        var mock_window;
        var table_node;
        var view;
        var DOM;
        
        beforeEach( function(){
            DOM = new JSDOM(Helpers.getTableHTML());
            table_node = DOM.window.document.getElementById("site-table-view");
            mock_window = DOM.window;
        });

        it("throws an error if nothing is provided", function(){

            expect( function(){
                new SiteTableView( null, { window:mock_window });
            }).to.throw();
        });

        it("throws an error if an html node is not provided", function(){

            expect( function(){
                new SiteTableView( {}, { window:mock_window, $:window.jQuery });
            }).to.throw();
        });

        it("throws an error if not provided a table", function(){

            var fake_node = mock_window.document.createElement("div");
            mock_window.document.body.appendChild(fake_node);

            expect( function(){
                new SiteTableView( fake_node, { window:mock_window  });
            }).to.throw();
        });

        it("instantiates if given <table> node", function(){
            var view = new SiteTableView(table_node);
            expect(view).to.be.instanceOf( SiteTableView );
        })
    })


   describe("Update site data..", function(){

        beforeEach( function(){
            DOM = new JSDOM( Helpers.getTableHTML() );
            table_node = DOM.window.document.getElementById("site-table-view");
            mock_window = DOM.window;
            view = new SiteTableView( table_node );
        });

        it("returns false if name/location/terminal are not present", function(){
            var data = {}
            expect( view.update( data ) ).to.be.false;
        })  

        it("returns false if name/location/terminal are not empty strings", function(){
            var data = { name:"Is Not Empty", location:"", terminal:"" }
            expect( view.update( data ) ).to.be.false;
        })  

        it("returns true if name/location/terminal are non-zero length strings", function(){
            var data = { name:"true", location:"location", terminal:"bramhall" }
            expect( view.update( data ) ).to.be.true;
        })  
        

        it("update() adds a row for every entry provided in an array")

        it("update() does not add a row if the data lacks name, site")

        it("update() adds a single row if not provided an array")

        it("update() does not add a new row if the site data exists")

        it("update() change")

        it("returns the updated row data when updating a single data row")

        it("returns null if attempting to update a site with an id that does not exist")

        it("if returns an array of elements lacking name, location, terminal data ")
    })