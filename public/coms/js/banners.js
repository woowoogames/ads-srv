$.extend({
    keys: function (obj) {
        var a = [];
        $.each(obj, function (k) { a.push(k) });
        return a;
    }
});



(function (window, undefined) {

            window.mngr = {
                "allCategories": [], products: [], banners: [], CodeToCountry: {},CountryToCode:{},
                "currentId" : 0,
                "Init": function () {
                    try {
                        this.Events();
                        this.Table();
                        $("#prdct").select2({
                            removeOnSelect : true
                        });
                        $("#cntry").select2({
                            removeOnSelect : true
                        });
                        $("#ctgry").select2({
                            removeOnSelect : true
                        });
                        $.ajax({
                            url:"http://204.145.74.4/tools/GetProducts",
                            dataType: 'json',
                            success : function(prdcts){
                                for(var prdctIndex in prdcts.Rows){
                                    $("#prdct").append("<option value=" + prdcts.Rows[prdctIndex].prdcts + ">" +prdcts.Rows[prdctIndex].mont_prdcts +"</option>");
                                }
                            },
                            error: function(a,b,c){
                                alert(a);
                                alert(b);
                                alert(c);
                            }   
                        });
                    } catch (e) {

                    }

                },

                "RenderBanner" : function(banner){
                    $("#ctgry").select2('val',banner.ctgry);
                    $("#desc").val(banner.desc);
                    $("#domains").val(banner.domains);
                    $("#feed").val(banner.feed);
                    $("#prdct").select2('val',banner.prdct);
                    $("#rndrTyp").val(banner.rndrTyp);
                    $("#size").val(banner.size);
                    $("#source").val(banner.source);
                    $('#standalone').prop('checked', banner.standalone);
                    $("#subidkey").val(banner.subidkey);
                    $("#subidval").val(banner.subidval);
                    $("#type").val(banner.type);
                },

                "Table": function () {

                    Services.GetBanners(function (banners) {
                        mngr.banners = banners;
                        $.each(mngr.banners.columns,function(idx,elem){
                            if(!/size|id|description|source|product/i.test(elem.title)){
                                elem.visible  =false;
                             }  
                        });
                        $('#table').bootstrapTable("destroy");
                        $('#table').bootstrapTable(mngr.banners).on('click-row.bs.table', function (e, row, $element) {
                            var result = $.grep(mngr.banners.data, function(e){ return e.id == row.id; });
                            mngr.RenderBanner(result[0]);
                            mngr.currentId = row.id;
                        });

                        $("button[name='refresh'").click(function () {
                            mngr.Table();
                        });
                        /*$table.bootstrapTable('refresh', {
                            silent: true,
                            contentType: "application/json",
                            dataType: "json",
                            url: 'coms.asmx/GetBanners',
                            ajaxOptions: {
                                dataFilter: function (data) {
                                    return data.d;
                                }
                            }
                        });*/
                        //$('#table').bootstrapTable({
                        //    method: 'get',
                        //    url: 'coms.asmx/GetBanners',
                        //    contentType: "text/html",
                        //    dataType: "json",
                        //    columns: [
                        //        { field: 'id', title: 'ID' }, { field: 'desc', title: 'Description' }, { field: 'size', title: 'Size' }, { field: 'source', title: 'Source' }
                        //    ]
                        //});

        });



        },

        "Events":function(){
            $(superGeoCountries).each(function (idx, val) {
                mngr.CodeToCountry[val.value.toLowerCase()] = val.label;
                mngr.CountryToCode[val.label] = val.value.toLowerCase();
            });
            for(var geoIndex in mngr.CountryToCode){
                $("#cntry").append("<option value=" + mngr.CountryToCode[geoIndex] + ">" + geoIndex +"</option>");
            }
            for(var catIndex in mngr.allCategories){
                $("#ctgry").append("<option value=" + mngr.allCategories[catIndex] + ">" + mngr.allCategories[catIndex] +"</option>");
            }
            $("#preview").click(function () {
                try {
                    $("#bnr-disp").attr("src", $("#source").val());
                    $("#disp-container").click(function () {
                        if ($("#lnk").val()) {
                            window.open($("#lnk").val());
                        }
                        return false;
                    });
                    return false;
                } catch (e) { }
            });


            this.Validate();
        },

        "setSelect2" : function(values){

        },

        //#region Add Banner

        "AddBanner": function () { 
            try {
                var banner = {
                    id : mngr.currentId
                };
                $.each($("#addForm").find("input,select").not(':input[type=button], :input[type=submit], :input[type=reset]'), function (idx, elem) {
                    if ($(elem).attr("id") == "cntry") {
                        var theVal = $(elem).val() || $(elem).text();
                        theVal = $.trim(theVal).replace(/,+/g, ",").replace(/^,|,$/g, "").replace(/\s*,\s*/g, ",").split(",");
                        var countries = [];
                        $.each(theVal, function (idx, val) {
                            var cc = mngr.CountryToCode[val];
                            if (cc) { countries.push(cc); }
                        });
                        banner[$(elem).attr("id")] = countries;
                        return true;
                    }
                    if ($(elem).attr("id") == "source" || $(elem).attr("id") == "ctgry" || $(elem).attr("id") == "lnk" || $(elem).attr("id") == "domains") {
                        var theVal = $(elem).val() || $(elem).text();
                        banner[$(elem).attr("id")] = [];
                        if (theVal)
                            banner[$(elem).attr("id")] = $.trim(theVal).replace(/,+/g, ",").replace(/^,|,$/g, "").replace(/\s*,\s*/g, ",").split(",");
                        return true;
                    }
                    if ($(elem).attr("type") == "checkbox") {
                        banner[$(elem).attr("id")] = $(elem).is(":checked");
                    }
                    if ($(elem).attr("id") == "prdct") {
                        banner[$(elem).attr("id")] = $(elem).val() == null ? [] : $(elem).val();
                    }
                    else {
                        banner[$(elem).attr("id")] = $(elem).val() || $(elem).text();
                    }
                });
                console.log(JSON.stringify(banner, null, "\t"));
                $("#status").text("adding banner...");
                $("#loader").addClass("loader");
                Services.addBanner(banner, $("#type").val(), function (data) {
                    $("#status").text(data && data.response);
                    setTimeout(function () {
                        $("#status").text("");
                        $("#loader").removeClass("loader");
                    }, 4000);

                });
                return false;
            }
            catch (e) {

            }
        },
        //#endregion
        "Validate": function () {
            var validate = true;
            $('#addForm').bootstrapValidator({
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    desc: { validators: { notEmpty: { message: 'The description field is required' } } },
                    src: {
                        validators: {
                            uri: { message: 'The address is not valid' },
                            notEmpty: { message: 'The source field is required' }
                        }
                    },
                    lnk: { validators: { uri: { message: 'The link address is not valid' } } }
                }
            }).on('success.form.bv', function (e) {
                mngr.AddBanner();
                e.preventDefault();
                return false;
            });

            return validate;
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
          }


      }



  })(window);


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
        traverse(tree[0], function (node) { if (node && node.name) { arr.push(node.name); } });
        mngr.allCategories = arr;
        mngr.Init();
    });


});

