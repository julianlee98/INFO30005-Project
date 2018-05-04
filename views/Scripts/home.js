function n_post_ob()
{
    this.value = 0;
}

n_post_ob.prototype.add = function()
{
    this.value++;
}

n_post_ob.prototype.set = function(val)
{
    this.value = val;
}


function postData (callback, status, n_posts){
    console.log("aaaaMM");
    // $.post('/newPost', {'title' : "test", "Body": status, "likes" : 0 }, function(data){
    //     console.log("HJMMMM");
    //     callback(n_posts);
    // }, "json");

    $.ajax({
        type:    "POST",
        url:     "/newPost",
        data:    {"Body": status, "likes" : 0 },
        success: function(data, textStatus, xhr) {
            console.log(xhr.status);
            callback(n_posts);
        },
        // vvv---- This is the new bit
        error:   function(jqXHR, textStatus, errorThrown) {
            alert("Error, status = " + textStatus + ", " +
                "error thrown: " + errorThrown
            );
        }
    });

}

function postData2(n_posts){
    console.log("before this");
    console.log(n_posts);
    $.get('/email', function(data){
        var request = "https://api.mlab.com/api/1/databases/webtech_project/collections/users?q={%27email%27:%27{1}%27}&apiKey=8UH049mkHoClUyTCFpDiNNKp8BuoGWR5";
        var requestWithEmail = JQUERY4U.UTIL.formatVarString(request, data);
        $.get(requestWithEmail, function(p){
            var test = [];
            console.log(n_posts);
            test.push(p[0].posts[n_posts.value]);
            generatePosts(test);
            n_posts.add();
        });
    });
};

function newPost(to_set, callback){
    $.get('/email', function(data){
        var request = "https://api.mlab.com/api/1/databases/webtech_project/collections/users?q={%27email%27:%27{1}%27}&apiKey=8UH049mkHoClUyTCFpDiNNKp8BuoGWR5";
        var requestWithEmail = JQUERY4U.UTIL.formatVarString(request, data);
        $.get(requestWithEmail, function(p){
            var len = p[0].posts.length;
            callback(to_set,len);
        });
    });
}


function set_n_post(to_set,n_posts){
    to_set.set(n_posts);
};

function t(){
    $(".like").click(function(){
        if( $(this).hasClass("liked")) {
            console.log("decrease");
            $.ajax({
                type: "POST",
                url: "/likePost",
                data: {"email": $(this).data("content"), "index": $(this).data("index"), "add": "false"},
                success: function (data, textStatus, xhr) {
                    console.log("ok");
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert("Error, status = " + textStatus + ", " +
                        "error thrown: " + errorThrown
                    );
                }
            });
        }
        else{
            console.log("increase");
            $.ajax({
                type: "POST",
                url: "/likePost",
                data: {"email": $(this).data("content"), "index": $(this).data("index"), "add": "true"},
                success: function (data, textStatus, xhr) {
                    console.log("ok");
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert("Error, status = " + textStatus + ", " +
                        "error thrown: " + errorThrown
                    );
                }
            });
        }
        $(this).toggleClass("liked");
    });
};


$(document).ready(function(){
    refreshPosts();
    var n_posts = new n_post_ob();
    newPost(n_posts,set_n_post);
    $("#sub_make_post").click(function(){
        console.log("Heres the num of posts");
        console.log(n_posts);
        //var request = "https://api.mlab.com/api/1/databases/webtech_project/collections/users?q={%27email%27:%27{1}%27}&apiKey=8UH049mkHoClUyTCFpDiNNKp8BuoGWR5";
        var status = $("#user_input").val();
        console.log(n_posts.value);
        postData(postData2, status, n_posts);
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


function refreshPosts(){
    var request = "https://api.mlab.com/api/1/databases/webtech_project/collections/users?q={%27email%27:%27{1}%27}&apiKey=8UH049mkHoClUyTCFpDiNNKp8BuoGWR5";
    $.get('/email', function(data){
        console.log(data);
        var requestWithEmail = JQUERY4U.UTIL.formatVarString(request, data);
        console.log(requestWithEmail);
        $.get(requestWithEmail, function(p){
            generatePosts(p[0].posts, data);
        });
    });
}

function generatePosts(input, email){
    input.forEach(function(post){
        console.log(post.index);
        html_to_add = JQUERY4U.UTIL.formatVarString("<div class='container-fluid cardcontainer dropdown_newitem norm_posts row-eq-height'><div class='col-sm-2 no_pad'>\n" +
            " <div class='col-sm-12 container_card center_text'><img class='profile-picture' src='/link_images/user.png'><div>Jeff Tong</div>\n" +
            " </div>\n" +
            " </div>\n" +
            " <div class='col-sm-10 no_pad'>\n" +
            " <div class='col-sm-12 container_card template_padding'><p>\n" +
            " {1}" +
            " </p>\n" +
            " <div class='post-meta'>\n" +
            " <p>Liked by {2} people</p>\n" +
            " <p><time datetime='2018-4-15 08:00'>4 February 2018 8:00AM</time></p></div>\n" +
            " <div class='post-interaction'>\n" +
            " <div class='btn-group btn-group-justified'> <a href='javascript:void(0)' class='btn btn-default like' data-content = '{3}' data-index = '{4}'>Like</a> <a href='#' class='btn btn-default'>Comment</a> <a href='#' class='btn btn-default'>Share</a> <a href='#' class='btn btn-default'>View Comments</a> </div>" +
            " </div>\n" +
            " </div>\n" +
            " </div>", post.Body, post.Likes, email, post.index);
        $("#post_creation").after(html_to_add);
    });
    t();
};
