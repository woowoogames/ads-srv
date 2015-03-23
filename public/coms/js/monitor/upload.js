(function (window) {
    var Upload = {
        "files": "",
        "init": function () {
            var self = this;
            function progressHandlingFunction(e) {
                if (e.lengthComputable) {
                    $('progress').attr({ value: e.loaded, max: e.total });
                }
            }
            $('input[type=file]').on('change', prepareUpload);
            // Grab the files and set them to our variable
            function prepareUpload(event) {

                var ext = this.value.match(/\.([^\.]+)$/)[1];
                switch (ext) {
                    case 'csv':
                        break;
                    case 'xls':
                        break;
                    case 'xlsx':
                        break;
                    default:
                        alert("only CSV file is allowed.");
                        this.value = '';
                }

                self.files = event.target.files;
            }
            $("#uploadBtn").click(function () {
                if (!self.formValidation())
                    return false;
                var formdata = new FormData();
                $.each(self.files, function (key, value) {
                    formdata.append(key, value);
                });
                var req = $.ajax({
                    url: 'coms.asmx/UploadBannersFile',
                    data: formdata,
                    dataType: 'json',
                    processData: false,
                    contentType: false,
                    type: 'POST',
                    xhr: function () { 
                        var myXhr = $.ajaxSettings.xhr();
                        if (myXhr.upload) {
                            $("#formContainer").append("<progress></progress>");
                            myXhr.upload.addEventListener('progress', progressHandlingFunction, false); 
                        }
                        return myXhr;
                    },
                    success: function (data) {
                        try {
                            if (data && data.error) {
                                alert(false, data.error);
                            }
                            else {
                                alert("Upload complete.");
                            }

                        }
                        catch (e) { }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        $("#formContainer").children("progress").remove();
                        alert(textStatus);
                    }
                });

            });

        },

        "formValidation": function () {
            var res = true, text = "", that = this;
            return res;
        }

    };

    Upload.init();

})(window);
