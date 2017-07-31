var assert = require('assert');
var sinon = require('sinon');
var SiteTableView = require('../view/site_table_view.js');
var jsdom = require("node-jsdom");
var tablehtml = `<div class="table-holder">
                    <table class="table table-striped table-inverse table-bordered table-hover" id="site-table-view">
                        <thead class="thead-inverse">
                            <tr>
                                <th>Name</th>
                                <th>Address</th>
                                <th>Terminal</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>

                        </tbody>
                    </table>
                </div>`

describe("SiteData Table View tests...", function(){

    before( function(){
        jsdom.env(  tablehtml,
                    function (errors, window) {
                        console.log("JSDOM init error:" + errors);
                     })
    });

    describe("Initialisation...", function(){
        
        describe("constructor creates table dom element if not present", function(){

        })

        describe("does not cause runtime error if not provided with DOM", function()
        {

        })
    })

    describe("Update site data..", function(){
        
        it(" addSites( arr ) adds a row to the table for every entry in an array", function(){

        })

        it("updateSite( siteData ) amends the site data for a given site", function(){

        })

        it("updateSite() does not error if site does not exist", function(){

        })
    })
})

jsdom.env(
  tablehtml,
  function (errors, window) {
    console.log("there have been", window.$("a").length, "nodejs releases!");
  }


/*
Initialisation
    creates a table DOM element if provided with HTML parent
    uses existing table element if provided with a <table>

Displaying Data
    


Update Tests
    throws an error if an attempt is made to update a site that does not exist

*/

//
