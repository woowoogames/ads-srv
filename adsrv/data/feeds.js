[
    {
        "name": "matomy",
        "type" : "raw",
        "requireSearchTerm": false,
        "active": true,
        "handler": "./raw/matomy",
        "coverage": {
            "geo": {
                "type": "white",
                "values" :["de","es","fr","in","pl","uk","us"]
            },
            "prdct": {
                "type": "white",
                "values": ["all"]
            }
        }
    },
    {
        "name": "kelkoo",
        "type" : "feed",
        "requireSearchTerm": true,
        "active": true,
        "handler": "./feeds/kelkoo",
        "coverage": {
            "geo": {
                "type": "white",
                "values" :["us", "gb", "it", "se", "no", "ru", "dk", "de", "nl", "es"]
            },
            "prdct": {
                "type": "white",
                "values": ["all"]
            }
        }
    },
    {
        "name": "shopzilla",
        "type": "feed",
        "requireSearchTerm": true,
        "active": true,
        "handler": "./feeds/shopzilla",
        "coverage": {
            "geo": {
                "type": "white",
                "values" :["us","br","de","fr","gb"]
            },
            "prdct": {
              
                "type" : "white",
                "values" : ["all"]
            }
        }
    },
    {
        "name": "pricegong",
        "type": "feed",
        "requireSearchTerm": true,
        "active": true,
        "handler": "./feeds/pricegong",
        "coverage": {
            "geo": {
                "type": "white",
                "values" : ["us", "br", "de", "fr", "gb"]
            },
            "prdct": {
                "type": "white",
                "values" : ["all"]
            }
        }
    },
    {
        "name": "firstoffer",
        "type": "feed",
        "requireSearchTerm": true,
        "active": true,
        "handler": "./feeds/firstoffer",
        "coverage": {
            "geo": {
                "type": "white",
                "values" :["us", "br", "de", "fr", "gb"]
            },
            "prdct" : {
                "type" : "white",
                "values" : ["all"]
            }
        }
    },
    {
    "name": "ddls",
    "type": "ddls",
    "requireSearchTerm": false,
    "active": true,
    "handler": "./ddls/ddlmngr",
    "coverage": {
            "geo": {
                "type": "white",
                "values": ["all"]
            },
            "prdct": {
                "type": "white",
                "values": ["all"]
            }
        }
    },
    {
    "name": "trnds",
    "type": "trnds",
    "requireSearchTerm": false,
    "active": true,
    "handler": "./trnds/trndmngr",
    "coverage": {
            "geo": {
                "type": "white",
                "values": ["all"]
            },
            "prdct": {
                "type": "white",
                "values": ["all"]
            }
        }
    },
    {  
        "name":"buscape",
        "type":"feed",
        "requireSearchTerm":true,
        "active":true,
        "handler":"./feeds/buscape",
        "coverage":{  
            "geo":{  
                "type":"white",
                "values":[  "br","ar","co","cl","mx","pe","ve"]
            },
            "prdct":{  
                "type":"white",
                "values":[  
                    "all"
                ]
            }
        }
    },
    {  
    "name":"buzzcity",
    "type":"raw",
    "requireSearchTerm":false,
    "active":true,
    "handler":"./raw/buzzcity",
    "coverage":{  
           "geo":{  
              "type":"white",
              "values":[  "id","my","in","za","th","br","uk","ng"]
           },
           "prdct":{  
              "type":"white",
              "values":[  
                 "all"
              ]
           }
        }
    }
]