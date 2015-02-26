[
    {
        "name": "adworldmedia",
        "type" : "feed",
        "requireSearchTerm": true,
        "active": true,
        "isSerp": false,
        "handler": "./feeds/adworldmedia",
        "coverage": {
            "cntry": {
                "type": "white",
                "values" :["us","ca","uk","au","nz"]
            },
            "prdct": {
                "type": "white",
                "values": ["all"]
            }
        }
    },
    {
        "name": "admarketplace",
        "type" : "feed",
        "requireSearchTerm": true,
        "active": true,
        "isSerp": true,
        "handler": "./feeds/admarketplace",
        "coverage": {
            "cntry": {
                "type": "white",
                "values" :["us"]
            },
            "prdct": {
                "type": "white",
                "values": ["all"]
            }
        }
    },
    {
        "name": "matomy",
        "type" : "raw",
        "requireSearchTerm": false,
        "active": false,
        "isSerp": false,
        "handler": "./raw/matomy",
        "coverage": {
            "cntry": {
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
        "isSerp": false,
        "handler": "./feeds/kelkoo",
        "coverage": {
            "cntry": {
                "type": "white",
                "values" :["be", "br", "de", "dk", "es", "fr", "it", "nl", "no", "ru", "se"]
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
        "isSerp": false,
        "handler": "./feeds/shopzilla",
        "coverage": {
            "cntry": {
                "type": "white",
                "values" :["us"]
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
        "isSerp": false,
        "handler": "./feeds/pricegong",
        "coverage": {
            "cntry": {
                "type": "white",
                "values" : ["it", "es", "fr", "de", "nl", "be", "ru", "br", "dk", "no", "se", "ca"]
            },
            "prdct": {
                "type": "white",
                "values" : ["all"]
            }
        }
    },
     {
        "name": "shopping",
        "type": "feed",
        "requireSearchTerm": true,
        "active": true,
        "isSerp": false,
        "handler": "./feeds/shopping",
        "coverage": {
            "cntry": {
                "type": "white",
                "values" : ["uk"]
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
        "isSerp": false,
        "handler": "./feeds/firstoffer",
        "coverage": {
            "cntry": {
                "type": "white",
                "values" :["in"]
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
    "isSerp": false,
    "handler": "./ddls/ddlmngr",
    "coverage": {
            "cntry": {
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
    "isSerp": false,
    "handler": "./trnds/trndmngr",
    "coverage": {
            "cntry": {
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
    "isSerp": false,
    "handler":"./feeds/buscape",
    "coverage":{  
            "cntry":{  
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
    "isSerp": false,
    "handler":"./raw/buzzcity",
    "coverage":{  
           "cntry":{  
              "type":"white",
              "values":["id","my","in","za","th","br","uk","ng"]
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