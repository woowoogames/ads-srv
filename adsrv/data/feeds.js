﻿[
    {
        "name": "matomy",
        "type" : "raw",
        "requireSearchTerm": false,
        "active": false,
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
        "active": false,
        "handler": "./feeds/kelkoo",
        "coverage": {
            "cntry": {
                "type": "white",
                "values" :["it", "es", "fr", "de", "nl", "be", "ru", "br", "dk", "no", "se", "uk"]
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
        "name": "ebay",
        "type": "feed",
        "requireSearchTerm": true,
        "active": true,
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
    "active": false,
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
    "handler":"./raw/buzzcity",
    "coverage":{  
           "cntry":{  
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