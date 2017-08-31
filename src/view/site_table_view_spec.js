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
                new SiteTableView( fake_node, { window:mock_window });
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
            var data = {};
            expect( view.update( data ) ).to.be.false;
        })  

        it("returns false if name/location/terminal are not empty strings", function(){
            var data = { name:"Is Not Empty", location:"", terminal:"" };
            expect( view.update( data ) ).to.be.false;
        })  

        it("returns true if name/location/terminal are non-zero length strings", function(){
            var data = { name:"true", location:"location", terminal:"bramhall" };
            expect( view.update( data ) ).to.be.true;
        })
        
        it("Adds a new row to the table if the row data does not exist", function(){
            var data = { name:"Site Name", location:"location", terminal:"bramhall" };
            view.update( data );
            var table_rows = table_node.querySelectorAll("tbody tr");
            expect(table_rows.length).to.equal(1);
        })

        it("Does not add a new row if an element of the Same name & terminal exists", function(){
            var data = { name:"Site Name", location:"location", terminal:"bramhall" };
            view.update( data );
            view.update( data );
            var table_rows = table_node.querySelectorAll("tbody tr");
            expect(table_rows.length).to.equal(1);
        })

        it("adds a td-status-xxxx class to the row html node", function(){
            var data = { name:"Site Name", location:"location", terminal:"bramhall" };            

            expect(view.update( data )).to.be.true;
            data.status = "complete";
            expect(view.update( data )).to.be.true;

            var tableRows = table_node.querySelectorAll("tbody tr");

            expect(tableRows.length).to.equal(1);
            expect(tableRows[0].className.indexOf("td-status-complete")).to.be.above(-1);
        })

        it("removes other status classes when updating", function(){
            var data = { name:"Site Name", location:"location", terminal:"bramhall" };
            
            expect(view.update( data )).to.be.true;
            data.status = "fetching";            
            expect(view.update( data )).to.be.true;
            data.status = "complete";
            expect(view.update( data )).to.be.true;

            var tableRows = table_node.querySelectorAll("tbody tr");    

            expect(tableRows[0].className.indexOf("status-fetching")).to.be.equal(-1);
        })

        it("changes the font-awesome <i> tag class when updating the status to pending, failed, fetching, complete", function(){
            var data = { name:"Site Name", location:"location", terminal:"bramhall"};
            view.update( data );

            var fontAwesomeTag = table_node.querySelectorAll("tbody tr i")[ 0 ];
            
            expect( fontAwesomeTag.className.indexOf("fa-minus"), "Missing fa-minus class on status icon").to.not.be.equal( -1 );
            //default is fa-minus for an inactive geocode

            data.status = "pending";
            view.update( data );
            expect( fontAwesomeTag.className.indexOf("fa-exclamation-triangle"), "Missing fa-exclamation-triangle class on status icon").to.not.be.equal(-1);
            
            data.status = "fetching";
            view.update( data );
            expect( fontAwesomeTag.className.indexOf("fa-spinner"), "Missing fa-spinner class on status icon").to.not.be.equal(-1);

            data.status = "failed";
            view.update( data );
            expect( fontAwesomeTag.className.indexOf("fa-times-circle"), "Missing fa-times-circle class on status icon").to.not.be.equal(-1);

            data.status = "complete";
            view.update( data );
            expect( fontAwesomeTag.className.indexOf("fa-check-circle"), "Missing fa-check-circle class on status icon").to.not.be.equal(-1);
        })
        

        it("only allows a status class of fetching/pending/complete/failed", function(){
            var data = { name:"Site Name", location:"location", terminal:"bramhall" };
              

            expect(view.update( data )).to.be.true;
            data.status = "invalidClassName";            
            expect(view.update( data )).to.be.false;
            
            var tableRows = table_node.querySelectorAll("tbody tr");

            expect(tableRows[0].className.indexOf("status-invalidClassName")).to.be.equal(-1);
        })
    })