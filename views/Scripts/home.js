function postEmailOb(post, email)
{
    this.post = post;
    this.email = email;
}



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
    var d = new Date($.now());
    $.ajax({
        type:    "POST",
        url:     "/newPost",
        data:    {"Body": status, "likes" : 0, "date": d.toString() },
        success: function(data, textStatus, xhr) {
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
    $.get('/email', function(data){
        var request = "https://api.mlab.com/api/1/databases/webtech_project/collections/users?q={%27email%27:%27{1}%27}&apiKey=8UH049mkHoClUyTCFpDiNNKp8BuoGWR5";
        var requestWithEmail = JQUERY4U.UTIL.formatVarString(request, data);
        $.get(requestWithEmail, function(p){
            var test = [];
            var item = new postEmailOb(p[0].posts[n_posts.value], data);
            test.push(item);
            generatePosts(test, data);
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
        var onScreen = $(this).parent().parent().parent().find("p").find("span").text();
        var value = parseInt(onScreen);
        if( $(this).hasClass("liked")) {
            value -= 1;
            $(this).parent().parent().parent().find("p").find("span").text(value);
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
            value += 1;
            $(this).parent().parent().parent().find("p").find("span").text(value);
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
    // refreshPosts();
    loopThroughFriends();
    var n_posts = new n_post_ob();
    newPost(n_posts,set_n_post);
    $("#sub_make_post").click(function(){
        //var request = "https://api.mlab.com/api/1/databases/webtech_project/collections/users?q={%27email%27:%27{1}%27}&apiKey=8UH049mkHoClUyTCFpDiNNKp8BuoGWR5";
        var status = $("#user_input").val();
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
            console.log("wat");
            generateMyPosts(p[0].posts, data);
        });
    });
}


function loopThroughFriends(){
    $.ajax({
        type:    "GET",
        url:     "/friends",
        success: function(data) {
            console.log(data);
            a(data);
        },
        error:   function(jqXHR, textStatus, errorThrown) {
            alert("Error, status = " + textStatus + ", " +
                "error thrown: " + errorThrown
            );
        }
    });
}

function a(list){
    var array = [];
    var request = "https://api.mlab.com/api/1/databases/webtech_project/collections/users?q={%27email%27:%27{1}%27}&apiKey=8UH049mkHoClUyTCFpDiNNKp8BuoGWR5";
    console.log(list);
    list.forEach(function(friend){
        var requestWithEmail = JQUERY4U.UTIL.formatVarString(request, friend);
        $.get(requestWithEmail, function(p){
            (p[0].posts).forEach(function(post){
                var item = new postEmailOb(post, friend);
                array.push(item);
            });
            $.get("/email", function(data){
                b(array, data);
            })
        });
    });
}

function b(array, curruser){
    array.sort(function(a, b) {
        var dateA = moment(a.post.date); // ignore upper and lowercase
        var dateB = moment(b.post.date) ; // ignore upper and lowercase
        if (dateA.isBefore(dateB)) {
            return -1;
        }
        if (dateB.isBefore(dateA)) {
            return 1;
        }

        // names must be equal
        return 0;
    });
    generatePosts(array, curruser);
}



function generateMyPosts(input, email){
    console.log("ge e n r a t e ");
    input.forEach(function(post){
        var found = 0;
        //Unpack datetime
        var d = new moment(post.date);
        post.likes.forEach(function(like){
            if(like == email){
                found = 1;
            }
        });
        if(found ==  1){
            html_to_add = JQUERY4U.UTIL.formatVarString("<div class='container-fluid cardcontainer dropdown_newitem norm_posts row-eq-height'><div class='col-sm-2 no_pad'>\n" +
                " <div class='col-sm-12 container_card center_text'><img class='profile-picture' src='/link_images/user.png'><div>Jeff Tong</div>\n" +
                " </div>\n" +
                " </div>\n" +
                " <div class='col-sm-10 no_pad'>\n" +
                " <div class='col-sm-12 container_card template_padding'><p>\n" +
                " {1}" +
                " </p>\n" +
                " <div class='post-meta'>\n" +
                " <p>Liked by <span>{2}</span> people</p>\n" +
                " <p><time>{5}</time></p></div>\n" +
                " <div class='post-interaction'>\n" +
                " <div class='btn-group btn-group-justified'> <a href='javascript:void(0)' class='btn btn-default like liked' data-content = '{3}' data-index = '{4}'>Like</a> <a href='#' class='btn btn-default'>Comment</a> <a href='#' class='btn btn-default'>Share</a> <a href='#' class='btn btn-default'>View Comments</a> </div>" +
                " </div>\n" +
                " </div>\n" +
                " </div>", post.Body, post.likes.length, email, post.index, d.format('Do MMMM YYYY h:m a'));
            $("#post_creation").after(html_to_add);
        }
        else{

            html_to_add = JQUERY4U.UTIL.formatVarString("<div class='container-fluid cardcontainer dropdown_newitem norm_posts row-eq-height'><div class='col-sm-2 no_pad'>\n" +
                " <div class='col-sm-12 container_card center_text'><img class='profile-picture' src='/link_images/user.png'><div>Jeff Tong</div>\n" +
                " </div>\n" +
                " </div>\n" +
                " <div class='col-sm-10 no_pad'>\n" +
                " <div class='col-sm-12 container_card template_padding'><p>\n" +
                " {1}" +
                " </p>\n" +
                " <div class='post-meta'>\n" +
                " <p>Liked by <span>{2}</span> people</p>\n" +
                " <p><time>{5}</time></p></div>\n" +
                " <div class='post-interaction'>\n" +
                " <div class='btn-group btn-group-justified'> <a href='javascript:void(0)' class='btn btn-default like' data-content = '{3}' data-index = '{4}'>Like</a> <a href='#' class='btn btn-default'>Comment</a> <a href='#' class='btn btn-default'>Share</a> <a href='#' class='btn btn-default'>View Comments</a> </div>" +
                " </div>\n" +
                " </div>\n" +
                " </div>", post.Body, post.likes.length, email, post.index, d.format('Do MMMM YYYY h:mm a'));
            $("#post_creation").after(html_to_add);
        }
    });
    t();
};

function generatePosts(input, curruser){
    console.log(input.date);
    input.forEach(function(postEmail){
        console.log("ge e n r a t e ");
        console.log(postEmail);
        var email = postEmail.email;
        var post = postEmail.post;
        var found = 0;
        //Unpack datetime
        var d = new moment(post.date);
        post.likes.forEach(function(like){
            if(like == curruser){
                found = 1;
            }
        });
        console.log(post.Body);
        console.log(post.likes);
        if(found ==  1){
            html_to_add = JQUERY4U.UTIL.formatVarString("<div class='container-fluid cardcontainer dropdown_newitem norm_posts row-eq-height'><div class='col-sm-2 no_pad'>\n" +
                " <div class='col-sm-12 container_card center_text'><img class='profile-picture' src='/link_images/user.png'><div>{6}</div>\n" +
                " </div>\n" +
                " </div>\n" +
                " <div class='col-sm-10 no_pad'>\n" +
                " <div class='col-sm-12 container_card template_padding'><p>\n" +
                " {1}" +
                " </p>\n" +
                " <div class='post-meta'>\n" +
                " <p>Liked by <span>{2}</span> people</p>\n" +
                " <p><time>{5}</time></p></div>\n" +
                " <div class='post-interaction'>\n" +
                " <div class='btn-group btn-group-justified'> <a href='javascript:void(0)' class='btn btn-default like liked' data-content = '{3}' data-index = '{4}'>Like</a> <a href='#' class='btn btn-default'>Comment</a> <a href='#' class='btn btn-default'>Share</a> <a href='#' class='btn btn-default'>View Comments</a> </div>" +
                " </div>\n" +
                " </div>\n" +
                " </div>", post.Body, post.likes.length, email, post.index, d.format('Do MMMM YYYY h:ss a'), (post.first_name + ' ' +  post.last_name));
            $("#post_creation").after(html_to_add);
        }
        else{

            html_to_add = JQUERY4U.UTIL.formatVarString("<div class='container-fluid cardcontainer dropdown_newitem norm_posts row-eq-height'><div class='col-sm-2 no_pad'>\n" +
                " <div class='col-sm-12 container_card center_text'><img class='profile-picture' src='/link_images/user.png'><div>{6}</div>\n" +
                " </div>\n" +
                " </div>\n" +
                " <div class='col-sm-10 no_pad'>\n" +
                " <div class='col-sm-12 container_card template_padding'><p>\n" +
                " {1}" +
                " </p>\n" +
                " <div class='post-meta'>\n" +
                " <p>Liked by <span>{2}</span> people</p>\n" +
                " <p><time>{5}</time></p></div>\n" +
                " <div class='post-interaction'>\n" +
                " <div class='btn-group btn-group-justified'> <a href='javascript:void(0)' class='btn btn-default like' data-content = '{3}' data-index = '{4}'>Like</a> <a href='#' class='btn btn-default'>Comment</a> <a href='#' class='btn btn-default'>Share</a> <a href='#' class='btn btn-default'>View Comments</a> </div>" +
                " </div>\n" +
                " </div>\n" +
                " </div>", post.Body, post.likes.length, email, post.index, d.format('Do MMMM YYYY h:ss a'), (post.first_name + ' ' +  post.last_name));
            $("#post_creation").after(html_to_add);
        }
    });
    t();
};
