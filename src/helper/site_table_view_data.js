module.exports.getTableHTML = getTableHTML;

function getTableHTML()  
{
   var html= `<html>
                    <body>
                        <div id="table-holder">
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
                        </div>
                    </body>
                </html>`
    return html;
}


var table_html = ``