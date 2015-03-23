$.extend({
    keys: function (obj) {
        var a = [];
        $.each(obj, function (k) { a.push(k) });
        return a;
    }
});
(function (window, undefined) {

    var mngr = {
        "op": ["show", "clk", "category","ctgry_show"],
        "CountryCodes": {}, "CountryToCode": {}, "allCategories": [], "products": {},
        "data": {}, "CountryByCategory": {}, "deletedBanners": {},
        //#region init
        "init": function (categories) {
            $('[data-toggle="tooltip"]').tooltip();
            $(".dpicker").datepicker();
            $(".dpicker").datepicker("option", "dateFormat", "yy-mm-dd");
            $(".dpicker").datepicker("setDate", new Date(new Date().setDate(new Date().getDate() - 1)));
            this.popProductSelect();
            this.popCountrySelect();
            this.SetMultiSelect("#cntry", $.keys(mngr.CountryToCode));
            this.SetMultiSelect("#ctgry", mngr.allCategories);
            this.getDeleted(function () {
                $("#refresh").click(function () {
                    $("#tblcntnr").empty();
                    $("#tblcntnr2").empty();
                    mngr.getStats();

                });
                $("#rmv").click(function () {
                    var rmvBnrsArr = $("input:checked").parent().text().match(/t[0-9]+/g);
                    if (rmvBnrsArr) {
                        $("#status").text("removing...");
                        $("#loader").addClass("loader");
                        Services.deleteBanner(rmvBnrsArr.join(),"ddls", function () {
                            //remove from table
                            $("#status").text("");
                            $("#loader").removeClass("loader");
                            $("input:checked").parent().parent().remove();
                        });
                    }

                });

            });

            //$("#preview").click(function () {
            //    try {
            //        $("#bnr-disp").attr("src", $("#source").val());
            //        $("#disp-container").click(function () {
            //            if ($("#lnk").val()) {
            //                window.open($("#lnk").val());
            //            }
            //            return false;
            //        });
            //        return false;
            //    } catch (e) { }
            //});
            //this.Validate();

        },
        "popProductSelect": function () {
            try {
                $(this.products).each(function (idx, val) {
                    $("#prdct").append("<option value='{val}'>{val}</option>".replace(/{val}/gi, val.prdcts));
                });
                $("#prdct").select2({ closeOnSelect: false });
            } catch (e) {

            }

        },
        "popCountrySelect": function () {
            try {
                superGeoCountries.sort(function (a, b) {
                    if (a.label == b.label) { return 0; }
                    if (a.label > b.label) { return 1; }
                    else { return -1; }
                });
                $(superGeoCountries).each(function (idx, val) {
                    mngr.CountryCodes[val.value.toLowerCase()] = val.label;
                    mngr.CountryToCode[val.label] = val.value.toLowerCase();
                    $("#cntryList").append("<option value='{val}' >{text}</option>".replace(/{val}/i, val.value).replace(/{text}/i, val.label));

                });
                $("#cntryList").select2({ closeOnSelect: false });
            } catch (e) {

            }

        },
        "DisplayBanner": function (url) {

            if (url.indexOf("trnd") > -1) {
                var bnr = url.match(/\d+/g);
                var id = Number(bnr);
                if (id > 0) {
                    url = "http://cdn.montiera.com/coms/bnr/trnd/t" + id + ".swf";
                    $("#bnr-disp").attr("src", url);
                }

            }
            else {
                $("#bnr-disp").attr("src", "../../images/notav.jpg");
            }


        },
        "getDeleted": function (callback) {
            $("#status").text("getting config...");
            $("#loader").addClass("loader");

            Services.getDeleted(function(data) {
                mngr.deletedBanners = $.extend(true, {}, data);
                $("#status").text("");
                $("#loader").removeClass("loader");
                callback();
            });

            /*$.ajax({
                url: 'coms.asmx/GetDeletedBanners',
                dataType: "json",
                success: function (data) {
                    mngr.deletedBanners = $.extend(true, {}, data);
                    $("#status").text("");
                    $("#loader").removeClass("loader");
                    callback();
                },
                fail: function () {
                    $("#status").text("");
                    $("#loader").removeClass("loader");
                    callback();
                }
            });*/
        },
        "SetMultiSelect": function (selector, FeedArr) {
            function split(val) {
                return val.split(/,\s*/);
            }
            function extractLast(term) {
                return split(term).pop();
            }
            $(selector)
              // don't navigate away from the field on tab when selecting an item
              .bind("keydown", function (event) {
                  if (event.keyCode === $.ui.keyCode.TAB &&
                      $(this).autocomplete("instance").menu.active) {
                      event.preventDefault();
                  }
              })
              .autocomplete({
                  minLength: 0,
                  source: function (request, response) {
                      // delegate back to autocomplete, but extract the last term
                      response($.ui.autocomplete.filter(
                        FeedArr, extractLast(request.term)));
                  },
                  focus: function () {
                      // prevent value inserted on focus
                      return false;
                  },
                  select: function (event, ui) {
                      var terms = split(this.value);
                      // remove the current input
                      terms.pop();
                      // add the selected item
                      terms.push(ui.item.value);
                      // add placeholder to get the comma-and-space at the end
                      terms.push("");
                      this.value = terms.join(", ");
                      return false;
                  }
              });
        },
        "getPrdcts": function (callback) {
            try {
                Services.GetProducts(function (prdcts) {
                    callback(prdcts);
                });
            }
            catch (e) {
            }
        },
        //#endregion

        

        //#region statistics

        "ShowTable": function (cntnr, data, isCntry) {

            var $table = $('<table id="dt" class="table" style="width:100%;"><thead></thead>' +
                '<tfoot>' +
                    '<tr>' +
                        '<th>Total</th>' +
                        '<th></th>' +//impressions
                        '<th></th>' +//clicks
                        '<th></th>' +//ctr
                    '</tr>' +
                '</tfoot></table>');
            var $trHead = $("<tr/>"), $trFoot = $("<tr/>"), columns = [];
               // columns = [{ "width": "40%" }, { "width": "20%" }, { "width": "20%" }, { "width": "20%" }];
            $.each(data["Columns"], function (prp) {
                $trHead.append("<th>" + prp + "</th>");
                $trFoot.append("<th>" + prp + "</th>");
                columns.length == 0 ? columns.push({ "data": prp, "width": "70%" }) : columns.push({ "data": prp, "width": "10%" });

            });
            
            var rows;
            //$table.find("thead").append($trHead.clone());
            $table.find("thead").append($trHead.clone());
            $table.find("tfoot").append($trFoot);
            $(cntnr).html($table);
            var oTable = $table.DataTable({
                "data": data["Rows"],
               
                aoColumns: [
                      { "mDataProp": isCntry ? "cntry" : $("#measure").val(),"width":"60%" },
                      { "mDataProp": "impressions" },
                      { "mDataProp": "clicks" },
                      { "mDataProp": "ctr" }
                ],
                "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                    try {
                        $('td', nRow).on('click', function () {
                            if ($("#measure").val() == "bnr") {
                                var str = /<.+>/g.exec(aData[$("#measure").val()]);
                                str = aData[$("#measure").val()].replace(str, "");
                                mngr.buildCountryByCategoryTable(str);

                                mngr.DisplayBanner(str);

                            }
                            else {
                                mngr.buildCountryByCategoryTable(aData[$("#measure").val()]);
                            }

                        });

                    } catch (e) {
                    }
                },
                "fnFooterCallback": function (nRow, aaData, iStart, iEnd, aiDisplay) {
                    try {
                        var iTotalImp = 0, iTotalClicks = 0, iTotalCTR = 0;
                        for (var i = 0 ; i < aaData.length ; i++) {
                            iTotalImp += aaData[i]["impressions"] || 0;
                            iTotalClicks += aaData[i]["clicks"] || 0;
                        }
                        if (iTotalImp) {
                            iTotalCTR = iTotalClicks / iTotalImp * 100;
                            iTotalCTR = iTotalCTR.toFixed(2);
                        }

                        var filteredCtr = 0, filteredImp = 0, filteredClicks = 0;
                        
                        if (rows && rows.length) {
                            for (var i = 0; i < rows.length; i++) {
                                filteredImp += rows[i].impressions;
                                filteredClicks += rows[i].clicks;
                            }

                            if (filteredImp) {
                                filteredCtr = filteredClicks / filteredImp * 100;
                                filteredCtr = filteredCtr.toFixed(2);
                            }
                        }
                        

                        var nCells = nRow.getElementsByTagName('th');
                        nCells[1].innerHTML = ' ' + filteredImp + ' (' + iTotalImp + ')';
                        nCells[2].innerHTML = ' ' + filteredClicks + ' (' + iTotalClicks + ')';
                        nCells[3].innerHTML = ' ' + filteredCtr + '% (' + iTotalCTR + '%)';
                    
                    }
                    catch (e) {
                    }
                }
            });
            $table.on('search.dt', function (e,settings) {
                try {
                    rows = oTable.rows({ filter: 'applied' });
                    rows = rows.data();
                   
                }
                catch (a) {}
            });

            $table.on('click', 'tr', function () {
                if ($(this).hasClass('selected')) {
                    $(this).removeClass('selected');
                }
                else {
                    $table.find("tr.selected").removeClass('selected');
                    $(this).addClass('selected');
                }
            });
        },
        "buildCountryByCategoryTable": function (category) {

            try {
                var data = mngr.CountryByCategory[category];
                mngr.ShowTable("#tblcntnr2", data, true);
            }
            catch (e) {
            }

        },
        "getCTR": function (data) {
            /*{"op":"clk","bnr":"300x250","info":"ddls-b.html-ddl10003","cntry":"ca","cnt":5.0}"*/
            var catVar, countAgg = {}, newData = { "Columns": {}, "Rows": [] },countVar = $("#measure").val();
            newData.Columns[countVar] = "String";
            //if ($("#rtype").val() == "300x250" && countVar == "bnr") {
            //    $.extend(newData.Columns, { "info":"String", "impressions": "String", "clicks": "String", "ctr": "String" });
            //}
            //else {
            //    $.extend(newData.Columns, { "impressions": "String", "clicks": "String", "ctr": "String" });
            //}
            $.extend(newData.Columns, { "impressions": "String", "clicks": "String", "ctr": "String" });
            $.each(data["Rows"], function (idx, val) {
                catVar = val[countVar];
                if (countVar == "bnr") {
                        catVar += "_" + val.info;
                }
                if (!mngr.IsDeleted(val.info)) {
                    countAgg[catVar] = countAgg[catVar] || {};
                    countAgg[catVar][val.cntry] = countAgg[catVar][val.cntry] || {};
                    countAgg[catVar][val.cntry][val.op || catVar] = val.cnt;
                }
            });
            mngr.CountryByCategory = {};
            $.each(countAgg, function (cat, catVal) {
                try {
                    var ctrVal = 0, imp = 0, clicks = 0;
                    //if (cat == "trnd-b.html_25.swf") {
                    //    debugger;
                    //}
                    $.each(catVal, function (cntry, val) {
                        imp += val.show || val[catVar] || 0;
                        clicks += val.clk || 0;
                        if (!$.isPlainObject(mngr.CountryByCategory[cat])) {
                            mngr.CountryByCategory[cat] = {};
                            mngr.CountryByCategory[cat].Rows = [];
                            mngr.CountryByCategory[cat].Columns = { "cntry": "String", "impressions": "String", "clicks": "String", "ctr": "String" };
                        }
                        var oClicks = val.clk || 0, oImps = val.show || val[catVar] || 0, oCtr = 0;
                        if (oImps) {
                            oCtr = (oClicks / oImps) * 100;
                            oCtr = oCtr.toFixed(2) + "%";
                        }

                        var obj = {
                            cntry: mngr.CountryCodes[cntry] || cntry,
                            impressions: parseInt(oImps),
                            clicks: parseInt(oClicks),
                            ctr: oCtr
                        };
                        mngr.CountryByCategory[cat].Rows.push(obj);

                    });




                    if (imp) {
                        ctrVal = (clicks / imp) * 100;
                        ctrVal = ctrVal.toFixed(2) + "%";
                    }

                    var obj = {
                        impressions: parseInt(imp),
                        clicks: parseInt(clicks),
                        ctr: ctrVal
                    };
                    obj[countVar] = cat;
                    if (countVar == "bnr") {
                        obj[countVar] = "<input class='isrmv' type='checkbox' />" + cat;
                    }
                    newData.Rows.push(obj);

                }
                catch (e) {
                    console.log(e);
                }

            });

            mngr.ShowTable("#tblcntnr", newData);

        },
        "IsDeleted": function (tid) {
            if (tid) {
                var p = tid.match(/^t[0-9]+$/gi);
                if (p && p[0]) {
                    return mngr.deletedBanners[p[0]] !== undefined;
                }
            }
            return false;
        },
        "getStats": function () {


            Services.GetStats({
                    in_StartDate: $("#dfrom").val(),
                    in_EndDate: $("#dto").val(),
                    in_Cntry: ($("#cntryList").val() && $("#cntryList").val().join()) || "",
                    in_Prdct: ($("#prdct").val() && $("#prdct").val().join()) || "",
                    in_Op: $("#measure").val(),
                    rtype: $("#rtype").val(),
                    sFormat:""
                },function (data) {
                    mngr.data = $.extend(true, {}, data);
                    mngr.getCTR(mngr.data);
                    $("#loader").removeClass("loader");
            });

            /*$.ajax({
                url: 'coms.asmx/GetStats',
                dataType: "json",
                data: {
                    in_StartDate: $("#dfrom").val(),
                    in_EndDate: $("#dto").val(),
                    in_Cntry: ($("#cntryList").val() && $("#cntryList").val().join()) || "",
                    in_Prdct: ($("#prdct").val() && $("#prdct").val().join()) || "",
                    in_Op: $("#measure").val(),
                    rtype: $("#rtype").val(),
                    sFormat:""
                },
                success: function (data) {
                    mngr.data = $.extend(true, {}, data);
                    mngr.getCTR(mngr.data);
                    $("#loader").removeClass("loader");
                }
            });*/
        }

        //#endregion

    };
    
    window.monitorMngr = mngr;



    $(document).ready(function () {

        Services.GetCategories(function (tree) {
            var arr = [], traverse = function (root, callback) {
                function traverse(root, nodeName) {
                    $.each(root.children, function (idx, node) {
                        callback(node);
                        if (node.children && node.children.length) {
                            traverse(node, nodeName);
                        }
                    });

                }
                traverse(root, callback);
            }
            traverse(tree[0], function (node) {
                if (node && node.name) {
                    arr.push(node.name);
                }
            });
            monitorMngr.allCategories = arr;
            Services.GetProducts(function (prdcts) {
                monitorMngr.products = prdcts && prdcts["Rows"];
                monitorMngr.init();
            });
        });

    });



})(window);