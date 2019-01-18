//Adapted from https://codepen.io/wallaceerick/pen/fEdrz
(function ($) {
    $.fn.customFile = function () {
        var isIE = /msie/i.test(navigator.userAgent);
        return this.each(function () {

            var $file = $(this).addClass('file-upload-hidden'), // the original file input
                $wrap = $('<div class="file-upload-wrapper">'),
            // Button that will be used in non-IE browsers
                $button = $('<button type="button" class="file-upload-button">Choose file</button>'),
            // Hack for IE
                $label = $('<label class="file-upload-button" for="' + $file[0].id + '">Choose file</label>'),

                $input = $('<span class="file-upload-input hidden"></span><br/>'),

                $image = $('<img src="/public/images/certificatePage1.jpg" /><br/>');

            $wrap.insertAfter($file) 
                .append($file, ( isIE ? $label : $button ), $input); //append now moves $file into the newly created div just insertedAfter it
            var $actionsCell = $wrap.parent().next(); //get a reference to the cell which will contain the image link.
            // Prevent focus
            $file.attr('tabIndex', -1);

            $button.click(function () {
                $file.focus().click(); // Open dialog
            });

            $file.change(function () {

                var $removeLink = $('<a tabindex="0" class="link">Remove</a>');

                $removeLink.click(function () {
                    $file.val('');
                    $input.empty();
                    $actionsCell.empty();
                    $input.addClass('hidden');
                    $button.show();
                    $image.remove();
                });

                var filename = $file.val().split('\\').pop();
                var $addNewFileTemplate = $('<tr id="test"><td><input type="file" id="certificate-upload' + 'test' + ' name="certificateUpload" multiple/></td><td></td></tr>');

                $input.empty();

                if(filename) {
                    $input.removeClass('hidden');
                    $input.append(filename + ' ');
                    $button.hide();
                    $actionsCell.append($removeLink);
                    $wrap.prepend($image);
                    $('.form-label').hide();
                    $('#docsTable').append($addNewFileTemplate);

                   $('#docsTable #test input[type=file] ').customFile();
                }
            });

        });

    };
}(jQuery));

$('input[type=file]').customFile();
