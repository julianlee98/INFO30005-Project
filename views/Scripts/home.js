$(document).ready(function(){
    //generatePosts();
    $("#sub_make_post").click(function(){
        var status = $("#user_input").val();

        $.post('/newPost', {'title' : "test", "Body": status, "likes" : 0 });
    });

    $(document).on('change', '.btn-file :file', function() {
        var input = $(this),
            label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
        input.trigger('fileselect', [label]);
    });

    $('.btn-file :file').on('fileselect', function(event, label) {

        var input = $(this).parents('.input-group').find(':text'),
            log = label;

        if( input.length ) {
            input.val(log);
        } else {
            if( log ) alert(log);
        }

    });
    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#img-upload').attr('src', e.target.result);
            }

            reader.readAsDataURL(input.files[0]);
        }
    }

    $("#imgInp").change(function(){
        readURL(this);
    });

    $("#sub_post_photo").click(function(){
        var status = $("#photo_description").val();
        var html_to_add;
        html_to_add = JQUERY4U.UTIL.formatVarString("<div class='container-fluid cardcontainer dropdown_newitem norm_posts row-eq-height'><div class='col-sm-2 no_pad'>\n" +
            " <div class='col-sm-12 container_card center_text'><img class='profile-picture' src='/link_images/user.png'><div>Jeff Tong</div>\n" +
            " </div>\n" +
            " </div>\n" +
            " <div class='col-sm-10 no_pad'>\n" +
            " <div class='col-sm-12 container_card template_padding'><p>\n" +
            " {1}" +
            " </p>\n" +
            " <div class='post-meta'>\n" +
            " <p>Liked by 3 people</p>\n" +
            " <p><time datetime='2018-4-15 08:00'>4 February 2018 8:00AM</time></p></div>\n" +
            " <div class='post-interaction'>\n" +
            " <div class='btn-group btn-group-justified'> <a href='#' class='btn btn-default like'>Like</a> <a href='#' class='btn btn-default'>Comment</a> <a href='#' class='btn btn-default'>Share</a> <a href='#' class='btn btn-default'>View Comments</a> </div>" +
            " </div>\n" +
            " </div>\n" +
            " </div>", status);
        $("#post_creation").after(html_to_add)  ;
    });

    $("#friend").click(function(){
        $(".follow-request").hide();
    });
    $("#friend2").click(function(){
        $(".follow-request").hide();
    });
});

//https://www.sitepoint.com/jquery-string-template-format-function/

var JQUERY4U = {};
JQUERY4U.UTIL = {
    formatVarString: function()
    {
        var args = [].slice.call(arguments);
        if(this.toString() != '[object Object]')
        {
            args.unshift(this.toString());
        }

        var pattern = new RegExp('{([1-' + args.length + '])}','g');
        return String(args[0]).replace(pattern, function(match, index) { return args[index]; });
    }
}
JQUERY4U.UTIL.formatVarString('{1} is a {2} aimed to help you learn {3}.', 'jQuery4u', 'blog', 'jQuery');
//output: "jQuery4u is a blog aimed to help you learn jQuery.

