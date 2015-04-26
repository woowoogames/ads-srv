
var Services = {

    PublishCategories: function (sJS, sCatJS, callback) {
        try {
            $("#ajaxloader").addClass("loader");
            $.ajax({
                url: "/tools/PublishCategories?",
                data: {
                    "sJS": JSON.stringify(sJS),
                    "sCatJS": JSON.stringify(sCatJS),
                    "callbackName": "window.ctx__.runGeo"
                },
                dataType: "json",
                type: "POST",
                success: function (res) {
                    $("#ajaxloader").removeClass("loader");
                    res = res.error || res.success;

                    typeof callback == "function" ? callback(res) : "";
                },
                fail: function (a) {
                    $("#ajaxloader").removeClass("loader");
                    typeof callback == "function" ? callback(res) : "";
                }
            });
        } catch (e) {
            callback(e);
        }
    },
    SaveCategories: function (sJS, callback) {
        try {
            $("#ajaxloader").addClass("loader");
            $.ajax({
                url: "/tools/SaveCategories?",
                data: {
                    "sJS": JSON.stringify(sJS)
                },
                dataType: "json",
                type: "POST",
                success: function (res) {
                    $("#ajaxloader").removeClass("loader");
                    res = res.error || res.success;

                    typeof callback == "function" ? callback(res) : "";
                },
                fail: function (a) {
                    $("#ajaxloader").removeClass("loader");
                    typeof callback == "function" ? callback(res) : "";
                }
            });
        } catch (e) {
            callback(e);
        }
    },
    GetCategories: function (callback) {
        try {
            $("#ajaxloader").addClass("loader");
            $.ajax({
                url: "/tools/GetCategories/",
                type: "GET",
                dataType:"text",
                success: function (res) {
                    $("#ajaxloader").removeClass("loader");
                    res = res.replace("var TreeBank = ", "");
                    var jsonTree = JSON.parse(res);
                    typeof callback == "function" ? callback(jsonTree) : "";
                },
                fail: function (a) {
                    $("#ajaxloader").removeClass("loader");
                    typeof callback == "function" ? callback(a) : "";
                },
                error: function (a) {
                    $("#ajaxloader").removeClass("loader");
                    typeof callback == "function" ? callback(a) : "";
                }
            });
        } catch (e) {
            callback(e);
        }
    },
    GetStats:function (data,callback) {
        $("#loader").addClass("loader");
        $.ajax({
                url: '/tools/GetStats',
                dataType: "json",
                data: data,
                success: function (data) {
                    $("#loader").removeClass("loader");
                    callback(data);
                    
                },
                error: function(a){
                    $("#ajaxloader").removeClass("loader");
                    typeof callback == "function" ? callback(a) : "";
                }
            });
    },
    getDeleted: function (callback) {
        try {
            $.ajax({
                url: '/tools/GetDeletedBanners',
                dataType: "json",
                success: function (data) {
                    callback(data);
                },
                fail: function () {
                    callback();
                }
            });
        } catch (e) {
            callback(e);
        }
    },
    "deleteBanner": function (bnrs, callback) {
        $.ajax({
            url: '/tools/DeleteBanner',
            data: { "bids": bnrs},
            dataType: "json",
            success: function (data) {
                callback(data);
            },
            fail: function () {
                callback();
            }
        });
    },

    "addBanner": function (banner,type,callback) {
        try {
            $.ajax({
                url: '/tools/AddBanner',
                data: { "sJS": JSON.stringify(banner), "type":type },
                dataType: "json",
                success: function (data) {
                    callback(data);
                },
                fail: function () {
                    callback(data);
                }
            });
        } catch (e) {
            callback(e);
        }
    },
    GetProducts: function (callback) {
        try {
            $("#ajaxloader").addClass("loader");
            $.ajax({
                url: "/tools/GetProducts",
                dataType: "json",
                type: "GET",
                success: function (prdcts) {
                    $("#ajaxloader").removeClass("loader");
                    typeof callback == "function" ? callback(prdcts) : "";
                },
                fail: function (a) {
                    $("#ajaxloader").removeClass("loader");
                    typeof callback == "function" ? callback(a) : "";
                }
            });
        } catch (e) {
            callback(e);
        }
    },
    GetBanners: function (callback) {
        try {
            $("#ajaxloader").addClass("loader");
            $.ajax({
                url: "/tools/GetBanners",
                dataType: "json",
                type: "GET",
                success: function (bnrs) {
                    $("#ajaxloader").removeClass("loader");
                    typeof callback == "function" ? callback(bnrs) : "";
                },
                fail: function (a) {
                    $("#ajaxloader").removeClass("loader");
                    typeof callback == "function" ? callback(a) : "";
                }
            });
        } catch (e) {
            callback(e);
        }
    }


}