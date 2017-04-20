module.exports.getGoodParseWithHeaders = function(){

  return {
    "data": [
      {
        "name": "site name",
        "location": "cm1 4qs",
        "terminal": "Bramhall"
      },
      {
        "name": "site1 name1",
        "location": "cm2 4q2",
        "terminal": "Bramhall"
      },
      {
        "name": "site 2 name",
        "location": "dscm2 4q2",
        "terminal": "Bramhall"
      }
    ],
    "errors": [],
    "meta": {
      "delimiter": ",",
      "linebreak": "\r\n",
      "aborted": false,
      "truncated": false,
      "cursor": 121,
      "fields": [
        "name",
        "location",
        "terminal"
      ]
    }
  }
}

module.exports.getGoodParseWithMissingData = function(){

  return {
    "data": [
      {
        "name": " ",
        "location": "cm1 4qs",
        "terminal": "Bramhall"
      },
      {
        "name": "site1 name1",
        "location": "",
        "terminal": "Bramhall"
      },
      {
        "name": "site 2 name",
        "location": "dscm2 4q2",
        "terminal": ""
      }
    ],
    "errors": [],
    "meta": {
      "delimiter": ",",
      "linebreak": "\r\n",
      "aborted": false,
      "truncated": false,
      "cursor": 121,
      "fields": [
        "name",
        "location",
        "terminal"
      ]
    }
  }
}

module.exports.StubParser = function StubParser( resultData )
{
    var result = resultData;
    this.parse = function( file, args )
    {
        args.complete( result );
    }
}