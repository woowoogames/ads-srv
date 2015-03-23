
(function (window, bank, undefined) {

    window.tree = {
        allCats: [],
        nevigationArray: [],
        words_object: {},
        create_words_object: function (tree) {//ok
            if (typeof tree.keywords !== 'undefined') {
                for (var i = 0; i < tree.keywords.length ; i++) {
                    if (tree.keywords[i].indexOf('4x') != -1)
                        console.log("stop");
                    tree.keywords[i] = tree.keywords[i].replace(/\n/g, '');
                    tree.keywords[i] = tree.keywords[i].replace(/\r/g, '');
                    if (typeof this.words_object[tree.keywords[i]] === 'undefined') {
                        this.words_object[tree.keywords[i]] = [];
                        this.words_object[tree.keywords[i]].push(this.nevigationArray.indexOf(tree.name));
                    }
                    else {
                        this.words_object[tree.keywords[i]].push(this.nevigationArray.indexOf(tree.name));
                    }
                }
            }
            for (var i = 0 ; i < tree.children.length; i++) {
                this.create_words_object(tree.children[i]);
            }
        },
        getCategories: function (tree) {
            if (tree.name != "Root") {
                this.allCats.push(tree);
                this.nevigationArray.push(tree.name);
            }
            for (var i = 0 ; i < tree.children.length; i++) {
                this.getCategories(tree.children[i]);
            }
        },
        getCategoryArray: function () {
            var answer = [];
            for (var i = 0; i < this.allCats.length; i++) {
                var parent_id = this.findCategoryIndexByName(this.allCats[i].parent.name);
                answer.push({ name: this.allCats[i].name, cid: i, pid: parent_id });
            }
            return answer;
        },
        findCategoryIndexByName: function (catname) {
            for (var i = 0; i < this.allCats.length; i++) {
                if (this.allCats[i].name == catname)
                    return i;
            }
            return -1;
        },
        createPublishJson: function () {
            $.each(this.words_object, function (k, v) {
                mngr.publishJSON[k] = v;
            });
        },
        ConvertToJSON: function (t) {
            tree.getCategories(t);
            var categories = tree.getCategoryArray();
            tree.allCats = categories;
            tree.create_words_object(t);
            tree.createPublishJson();
            console.log("tree finished");
        }
    }

    window.mngr = {
        compare:function compare(a,b) {
            if (a.name.toLowerCase() < b.name.toLowerCase())
                return -1;
            if (a.name.toLowerCase() > b.name.toLowerCase())
                return 1;
            return 0;
        },
        SortTree: function (tree) {
            if (typeof tree.children !== 'undefined') {
                if(typeof tree.keywords !== 'undefined')
                    tree.keywords.sort();
                tree.children.sort(this.compare);
                for (var i = 0 ; i < tree.children.length; i++) {
                    this.SortTree(tree.children[i]);
                }
            }
        },
        bank:null,currKeyWords: null, currCategory: null,currNode:null, currParent: null, publishJSON: {},
        init: function (tree) {
            try {


                mngr.bank = tree;
                $(parent).scroll(function () {
                    try {
                        $("#kwContainer").stop().animate({ "marginTop": ($(parent).scrollTop()-100) + "px", "marginLeft": ($(parent).scrollLeft()) + "px" }, "fast");
                    }
                    catch (e) { }
                });
                var $tree1 = $('#tree1');
                $tree1.tree({
                    data: tree,
                    usecontextmenu: true,
                    autoOpen: 0,
                    dragAndDrop: true
                });
                var api = $tree1.jqTreeContextMenu($('#myMenu'), {
                    "add_parent": function (node) {
                        var newNode = $("#add_parent").val();
                        if (newNode) {
                            $('#tree1').tree(
                                'addParentNode',
                                {
                                    "label": newNode
                                },
                                node
                            );
                        }
                        $("#add_parent").val("");
                    },
                    "add": function (node) {
                        var newNode = $("#add_node").val();
                        if (newNode) {
                            $('#tree1').tree(
                                    'addNodeAfter',
                                    {
                                        label: newNode
                                    },
                                    node
                                );
                        }
                        $("#add_node").val("");
                    },
                    "delete": function (node) {
                        $('#tree1').tree('removeNode', node);
                    },
                    "update": function (node) {
                        var newValue = $("#update").val();
                        $('#tree1').tree('updateNode', node, newValue);
                        $("#update").val(newValue);
                    },
                });
                $("#add_parent,#add_node,#update").click(function () {
                    return false;
                });

                mngr.Events();
                parent.master.setMyHeight($(".container").height() + 500);
            } catch (e) {

            }
        },

        Events: function () {
            $('#tree1').bind('tree.click', function (event) {
                try {
                    $("#kwtext").focus();
                    var node = event.node;
                    mngr.currNode = node;
                    $("#kwtext").val("");
                    $("#kwtext").val(node.keywords);
                }
                
                catch (e) {}
            });
            $('#tree1').bind('tree.open', function (e) {
                parent.master.setMyHeight($(".container").height()+500);
            });
            $("#kwtext").keyup(function () {
                try {
                    //var kw = $("#kwtext").val().replace(/\s+/gi, ",");
                    var kw = $("#kwtext").val();
                    mngr.currNode.keywords = [];
                    if (kw != "") {
                        kw = kw.split(",");
                        kw = mngr.UniqueKeywords();
                        mngr.currNode.keywords = [].concat(kw);
                        $('#tree1').tree("reload");
                    }
                        
                }
                catch (e) { }
            });
            $('textarea').autosize();
            $("#btn_publish").click(function () {
                mngr.publishJSON = {};
                var t = $("#tree1").tree("getTree");
                tree.ConvertToJSON(t.children[0]);
                if (!$.isEmptyObject(mngr.publishJSON)) {
                    Services.PublishCategories(mngr.publishJSON,tree.allCats, function (res) {
                        //alert(res);
                    });
                }
                
            });

            $("#btn_save").click(function () {
                var sJS = $("#tree1").tree("toJson");
                sJS = JSON.parse(sJS);
                Services.SaveCategories(sJS, function (res) {
                    alert(res);
                });
            });
            mngr.SaveKey();
        },

        UniqueKeywords:function() {
            //var kw = $("#kwtext").val().replace(/\s+/gi, ",");
            var kw = $("#kwtext").val();
            var kwArr = kw.split(",");
            var arr = $.grep(kwArr, function (v, k) {
                return $.inArray(v, kwArr) === k;
            });
            return arr.filter(function (e) { return e });
        },

        SaveKey: function () {
            var ctrl_down = false;
            var ctrl_key = 17;
            var s_key = 83;
            $(document).keydown(function (e) {
                if (e.keyCode == ctrl_key) ctrl_down = true;
            }).keyup(function (e) {
                if (e.keyCode == ctrl_key) ctrl_down = false;
            });
            $(document).keydown(function (e) {
                if (ctrl_down && (e.keyCode == s_key)) {
                    $("#btn_save").click();
                    return false;
                }
            });
        }
    }
    
    $(document).ready(function () {

        Services.GetCategories(function (tree) {
            mngr.SortTree(tree[0]);
            mngr.init(tree);
        });

    });

   

})(window);
