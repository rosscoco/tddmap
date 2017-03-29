exports.singleValidGeocodeResponse = [{  
   "address_components":[  
      {  
         "long_name":"CM1 4QS",
         "short_name":"CM1 4QS",
         "types":[  
            "postal_code"
         ]
      },
      {  
         "long_name":"High Easter",
         "short_name":"High Easter",
         "types":[  
            "locality",
            "political"
         ]
      },
      {  
         "long_name":"Chelmsford",
         "short_name":"Chelmsford",
         "types":[  
            "postal_town"
         ]
      },
      {  
         "long_name":"Essex",
         "short_name":"Essex",
         "types":[  
            "administrative_area_level_2",
            "political"
         ]
      },
      {  
         "long_name":"England",
         "short_name":"England",
         "types":[  
            "administrative_area_level_1",
            "political"
         ]
      },
      {  
         "long_name":"United Kingdom",
         "short_name":"GB",
         "types":[  
            "country",
            "political"
         ]
      }
   ],
   "formatted_address":"High Easter, Chelmsford CM1 4QS, UK",
   "geometry":{  
      "bounds":{  
         "south":51.8043305,
         "west":0.34950159999993957,
         "north":51.8093656,
         "east":0.3541748000000098
      },
      "location":{  
         "lat":function(){ return 51.80835159999999},
         "lon":function(){ return 0.35142659999996795 }
      },
      "location_type":"APPROXIMATE",
      "viewport":{  
         "south":51.8043305,
         "west":0.34950159999993957,
         "north":51.8093656,
         "east":0.3541748000000098
      }
   },
   "place_id":"ChIJudbxDB6T2EcReODHuMjOfgo",
   "types":[  
      "postal_code"
   ]
}]

exports.parsedValidResponse = {
    location:"CM1 4QS",
    full_address: "High Easter, Chelmsford CM1 4QS, UK",
    lat: 51.80835159999999,
    lon: 0.35142659999996795 
};