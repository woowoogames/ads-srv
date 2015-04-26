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
        "currentId" : null,
        "image" : null,
        "Init": function () {
            try {
                this.Events();
                this.Table();
                $.ajax({
                    url:"http://204.145.74.4/tools/GetProducts",
                    dataType: 'json',
                    success : function(prdcts){
                        mngr.prdcts = prdcts;
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
            $("#cntry").select2('val',banner.cntry);
            $("#desc").val(banner.desc);
            $("#domains").val(banner.domains);
            $("#feed").val(banner.feed);
            $("#prdct").select2('val',banner.prdct);
            $("#rndrTyp").val(banner.rndrTyp);
            $("#size").val(banner.size);
            $("#source").val($(banner.source).attr("src"));
            $('#standalone').prop('checked', banner.standalone);
            $("#subidkey").val(banner.subidkey);
            $("#subidval").val(banner.subidval);
            $("#type").val(banner.type);
        },
        "Table": function () {
            Services.GetBanners(function (banners) {
                mngr.banners = banners;
                $.each(mngr.banners.columns,function(idx,elem){
                    if(!/size|^id$|description|source|product/i.test(elem.title)){
                        elem.visible  =false;
                    }  
                });

                $('#table').bootstrapTable("destroy");
                $("#table").remove();
                var table = '<table id="table" data-show-refresh="true"'+
                'data-show-pagination-switch="true"'+
                'data-show-export="true" data-search="true"'+
                'data-pagination="true" data-page-size="5" data-page-list="[5, 10, 20, 50, 100, 200]">'+
                '</table>';

                $("#addBanner").append(table);


                        // var sourceImg = $('#source').val();
                        // var image = '<img src=' + sourceImg +' style=\'height: 160px;width: 200px;\'>';
                        // mngr.image = image;
                        $('#table').bootstrapTable(mngr.banners).on('click-row.bs.table', function (e, row, $element) {
                            var result = $.grep(mngr.banners.data, function(e){ return e.id == row.id; });
                            mngr.currentId = row.id;
                            var bootboxButtonObj ={
                                success : {
                                    label : "Save",
                                    className: "btn-success",
                                    callback : function(){
                                        if(mngr.currentId)
                                            return mngr.AddBanner(mngr.currentId);
                                        else
                                            return mngr.AddBanner(null);
                                    }
                                },
                                fail : {
                                    show : false,
                                    label : "delete banner",
                                    className: "btn-danger",
                                    callback : function(){
                                        bootbox.confirm("Are you sure you want to delete?", function(result) {
                                          if(result){
                                            Services.deleteBanner(mngr.currentId,function(data){
                                                mngr.currentId = null;
                                                return true;
                                            })
                                        }
                                        else{
                                            mngr.currentId = null;
                                            return true;
                                        }
                                    });
                                    }   
                                }
                            };
                            mngr.Dialog("Edit Banner:",bootboxButtonObj);
                            mngr.RenderBanner(result[0]);
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

                $("#addbanner_bt").click(function(){
                   var bootboxButtonObj ={
                    success : {
                        label : 'Add New Banner',
                        className: "btn-success",
                        callback : function(){
                            if(mngr.currentId)
                                return mngr.AddBanner(mngr.currentId);
                            else
                                return mngr.AddBanner(null);
                        }
                    }
                };
                mngr.currentId = null;
                mngr.Dialog("Add New Banner:",bootboxButtonObj);
                });

                },

                "Dialog": function(Text,buttons){
                    bootbox.dialog({
                        title:Text,
                        message :   '<script>$("#prdct").select2({'+
                            'removeOnSelect : true'+
                            '});'+
                '$("#cntry").select2({'+
                 'removeOnSelect : true'+
                 '});'+
                '$("#ctgry").select2({'+
                 'removeOnSelect : true'+
                 '});' +
                'for(var geoIndex in mngr.CountryToCode){' +
                '    $("#cntry").append("<option value=" + mngr.CountryToCode[geoIndex] + ">" + geoIndex +"</option>");' +
                '}' +
                'for(var catIndex in mngr.allCategories){' +
                '    $("#ctgry").append("<option value=" + mngr.allCategories[catIndex] + ">" + mngr.allCategories[catIndex] +"</option>");' +
                '}' +
                'for(var prdctIndex in mngr.prdcts.Rows){'+
                '$("#prdct").append("<option value=" + mngr.prdcts.Rows[prdctIndex].prdcts + ">" +mngr.prdcts.Rows[prdctIndex].mont_prdcts +"</option>");'+
                '}'+
                '</script>' +
                '<div><form id="addForm" class="col-md-12" >' +
                '<div class="col-md-12 has-feedback">' +
                '<label class="control-label" for="type">Banner Type:</label>'+
                '<select class="form-control" id="type" style="margin-bottom:10px;">'+
                '<option value="ddls">Direct Deal</option>'+
                '<option value="trnd">Trend Banner</option>'+
                '</select>'+
                '</div>' +
                '<div class="col-md-6 has-feedback">' +
                '<label class="control-label">Description:</label>' +
                '<input placeholder="Banner Description" type="text" class="form-control" id="desc" name="desc" />' +
                '</div>' +
                '<div class="col-md-6">' +
                '<label class="control-label" for="rndrTyp">Render Type:</label>' +
                '<select class="form-control" id="rndrTyp" style="margin-bottom:10px;">' +
                '<option value="img">Image</option>' +
                '<option value="iframe">Iframe</option>' +
                '<option value="flash">Flash</option>' +
                '<option value="html">HTML</option>' +
                '<option value="script">Script</option>' +
                '<option value="htmlpg">Html Page</option>' +
                '<option value="ntb">New Tab</option>' +
                '</select>' +
                '</div>' +
                '<div class="col-md-6">' +
                '<label>Categories:</label>' +
                '<select multiple="multiple" class="select" id="ctgry" style="width:90%"> </select>' +
                '</div>' +
                '<div class="col-md-6">' +
                '<label>Feed:</label>' +
                '<input placeholder="Feed" type="text" class="form-control" id="feed">' +
                '</div>' +
                '<div class="col-md-6">' +
                '<label class="control-label" for="size">Size:</label>' +
                '<select class="form-control" id="size">' +
                '<option value="300x250">300x250</option>' +
                '<option value="728x90">728x90</option>' +
                '<option value="160x600">160x600</option>' +
                '</select>' +
                '</div>' +
                '<div class="col-md-6">' +
                '<label>Domains:</label>'+
                '<input placeholder="Active Domains" type="text" class="form-control" id="domains" name="domains">'+
                '</div>'+
                '<div class="col-md-12">'+
                '<label>Countries:</label>'+
                '<select multiple="multiple" class="select" id="cntry" style="width:90%"> </select>'+
                '</div>'+
                '<div class="col-md-12">'+
                '<label data-toggle="tooltip" title="Could be img,html,flash,iframe,script">Source</label>'+
                '</div>' +
                '<div class="col-md-8">'+
                '<input placeholder="Source - the display link" type="text" class="form-control" id="source" name="src">'+
                '</div>' +
                '<div class="col-md-4">'+
                '<a id="popover" class="btn" rel="popover" data-content="" title="Banner Preview">View</a>' +
                '</div>'+
                '<div class="col-md-12">'+
                '<label data-toggle="tooltip" title="*Optional navigation link">Link</label>'+
                '<input placeholder="Banner Target Url (Click Url) - the navigation link" type="text" class="form-control" id="lnk" name="lnk">'+
                '</div>'+
                '<div class="col-md-12">'+
                '<div class="col-md-12">'+
                '<input type="checkbox" id="standalone">'+
                '<label>Stand Alone</label><p class="help-block">*No need to handle the click</p>'+
                '</div>'+
                '</div>'+
                '<div class="col-md-12">'+
                '<div class="col-md-6">'+
                '<label>Product:</label>'+
                '</div>'+
                '<div class="col-md-6">'+
                '<select multiple="multiple" class="select" id="prdct" style="width:100%"> </select>'+
                '</div>'+
                '</div>'+
                '<div class="col-md-12"> '+
                '<div class="col-md-6">'+
                '<label>subid key</label>'+
                '</div>'+
                '<div class="col-md-6">'+
                '<input style="width: 100%;" placeholder="name" type="text" class="form-control" id="subidkey" name="subidkey">'+
                '</div>'+
                '</div>'+
                '<div class="col-md-12">'+
                '<div class="col-md-6">'+
                '<label>subid value</label>'+
                '</div>'+
                '<div class="col-md-6">'+
                '<input style="width: 100%;" placeholder="value" type="text" class="form-control" id="subidval" name="subidval">'+
                '</div>'+
                '</div>'+
                '<div class="col-md-12">'+
                '<span id="status"></span>'+
                '</div>'+
                '</form></div>',
                buttons:buttons
                });
                },
                //#region Add Banner

                "AddBanner": function (id) {
                    try {
                        var banner = id ? {"id" : id} : {};
                        banner[$("#type").attr("id")] = $("#type").val();
                        banner[$("#desc").attr("id")] = $("#desc").val();
                        banner[$("#rndrTyp").attr("id")] = $("#rndrTyp").val();
                        banner[$("#ctgry").attr('id')] = $("#ctgry").select2('val')==null ? [] : $("#ctgry").select2('val');
                        banner[$("#feed").attr("id")] = $("#feed").val();
                        banner[$("#cntry").attr('id')] = $("#cntry").select2('val')==null ? [] : $("#cntry").select2('val');
                        banner[$("#source").attr("id")] = [$("#source").val()];
                        banner[$("#lnk").attr("id")] = $("#lnk").val();
                        banner[$("#size").attr("id")] = $("#size").val();
                        banner[$("#domains").attr("id")] = $("#domains").val().split(',');
                        banner[$("#standalone").attr('id')] = $("#standalone").prop('checked');
                        banner[$("#prdct").attr('id')] = $("#prdct").select2('val')==null ? [] : $("#prdct").select2('val');
                        banner[$("#subidkey").attr("id")] = $("#subidkey").val();
                        banner[$("#subidval").attr("id")] = $("#subidval").val();
                        console.log(banner);
                        mngr.currentId = null;

                        // $.each($("#addForm").find("input,select").not(':input[type=button], :input[type=submit], :input[type=reset]'), function (idx, elem) {
                        //     if ($(elem).attr("id") == "cntry") {
                        //         var theVal = $(elem).val() || $(elem).text();
                        //         theVal = $.trim(theVal).replace(/,+/g, ",").replace(/^,|,$/g, "").replace(/\s*,\s*/g, ",").split(",");
                        //         var countries = [];
                        //         $.each(theVal, function (idx, val) {
                        //             var cc = mngr.CountryToCode[val];
                        //             if (cc) { countries.push(cc); }
                        //         });
                        //         banner[$(elem).attr("id")] = countries;
                        //         return true;
                        //     }
                        //     if ($(elem).attr("id") == "source" || $(elem).attr("id") == "ctgry" || $(elem).attr("id") == "lnk" || $(elem).attr("id") == "domains") {
                        //         var theVal = $(elem).val() || $(elem).text();
                        //         banner[$(elem).attr("id")] = [];
                        //         if (theVal)
                        //             banner[$(elem).attr("id")] = $.trim(theVal).replace(/,+/g, ",").replace(/^,|,$/g, "").replace(/\s*,\s*/g, ",").split(",");
                        //         return true;
                        //     }
                        //     if ($(elem).attr("type") == "checkbox") {
                        //         banner[$(elem).attr("id")] = $(elem).is(":checked");
                        //     }
                        //     if ($(elem).attr("id") == "prdct") {
                        //         banner[$(elem).attr("id")] = $(elem).val() == null ? [] : $(elem).val();
                        //     }
                        //     else {
                        //         banner[$(elem).attr("id")] = $(elem).val() || $(elem).text();
                        //     }
                        // });
                        // console.log(JSON.stringify(banner, null, "\t"));
                        // // $("#status").text("adding banner...");
                        // $("#loader").addClass("loader");z
                        Services.addBanner(banner, "ddls", function (data) {
                            mngr.currentId = null;
                            return false;
                            // $("#status").text(data && data.response);
                            // setTimeout(function () {
                            //     $("#status").text("");
                            //     $("#loader").removeClass("loader");
                            // }, 4000);
                    });
                        return true;
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
                        mngr.AddBanner(null);
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

