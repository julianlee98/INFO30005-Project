//Having a structure like this allows for each post to effectively have an account tied to it
function postEmailOb(post, email)
{
    this.post = post;
    this.email = email;
}

//Used as a workaround so that the number of posts in the array can be kept track of internally
//This is used in post data to get the last post in the users post array
function n_post_ob()
{
    this.value = 0;
}

//Increment value
n_post_ob.prototype.add = function()
{
    this.value++;
};

//Set value
n_post_ob.prototype.set = function(val)
{
    this.value = val;
};

$(document).ready(function(){
    // refreshPosts();
    loopThroughFriends();
    newPostBehaviour();
    fileBehaviour();
    playListBehaviour();
    searchBehaviour();
    logoutBehaviour();

});

// Post logic ----------------------------------------

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

function postData (callback, status, n_posts){
    var d = new Date($.now());
    $.ajax({
        type:    "POST",
        url:     "/newPost",
        data:    {"Body": status, "likes" : 0, "date": d.toString() },
        success: function(data, textStatus, xhr) {
            callback(n_posts);
        },
        error:   function(jqXHR, textStatus, errorThrown) {
        }
    });

}

function postData2(n_posts){
    $.get('/email', function(data){
        var request = "https://api.mlab.com/api/1/databases/webtech_project/collections/users?q={%27email%27:%27{1}%27}&apiKey=8UH049mkHoClUyTCFpDiNNKp8BuoGWR5";
        var requestWithEmail = JQUERY4U.UTIL.formatVarString(request, data);
        $.get(requestWithEmail, function(user){
            var test = [];
            //Gets the item we just added from the database
            var item = new postEmailOb(user[0].posts[n_posts.value], data);
            //Always a one elem array
            test.push(item);
            $("#user_input").val("");
            generatePosts(test, data);
            n_posts.add();
        });
    });
};


function set_n_post(to_set,n_posts){
    to_set.set(n_posts);
};

//End of post logic ---------------------------------------


//I am real proud of the fact that the code below actually works please read this ---------

function likeBehaviour(){
    $(".like").click(function(){
        var onScreen = $(this).parent().parent().parent().find("p").find("span").text();
        var value = parseInt(onScreen);
        if( $(this).hasClass("liked")) {
            value -= 1;
            $(this).parent().parent().parent().find("p").find("span").text(value);
            $.ajax({
                type: "POST",
                url: "/likePost",
                data: {"email": $(this).data("content"), "index": $(this).data("index"), "add": "false"},
                success: function (data, textStatus, xhr) {
                },
                error: function (jqXHR, textStatus, errorThrown) {
                }
            });
        }
        else{
            value += 1;
            $(this).parent().parent().parent().find("p").find("span").text(value);
            $.ajax({
                type: "POST",
                url: "/likePost",
                data: {"email": $(this).data("content"), "index": $(this).data("index"), "add": "true"},
                success: function (data, textStatus, xhr) {
                },
                error: function (jqXHR, textStatus, errorThrown) {
                }
            });
        }
        $(this).toggleClass("liked");
    });

}


function newPostBehaviour(){
    var n_posts = new n_post_ob();
    newPost(n_posts,set_n_post);
    $("#sub_make_post").click(function(){
        //var request = "https://api.mlab.com/api/1/databases/webtech_project/collections/users?q={%27email%27:%27{1}%27}&apiKey=8UH049mkHoClUyTCFpDiNNKp8BuoGWR5";
        var status = $("#user_input").val();
        postData(postData2, status, n_posts);
    });
}



function fileBehaviour(){
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

    $("#imgInp").change(function(){
        readURL(this);
    });
}

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            console.log(e.target.result);
            $('#img-upload').attr('src', e.target.result);
        }

        //console.log(input.files[0]);

        reader.readAsDataURL(input.files[0]);
    }
}





function loopThroughFriends(){
    var request = "https://api.mlab.com/api/1/databases/webtech_project/collections/users?q={%27email%27:%27{1}%27}&apiKey=8UH049mkHoClUyTCFpDiNNKp8BuoGWR5";

    $.get('/email', function(data){
        var requestWithEmail = JQUERY4U.UTIL.formatVarString(request, data);
        $.ajax({
            type:    "GET",
            url:     requestWithEmail,
            success: function(data) {
                createPostListAndGenerate(data[0].friends);
            },
            error:   function(jqXHR, textStatus, errorThrown) {
            }
        });
    });
}

function createPostListAndGenerate(list){
    var request = "https://api.mlab.com/api/1/databases/webtech_project/collections/users?q={%27email%27:%27{1}%27}&apiKey=8UH049mkHoClUyTCFpDiNNKp8BuoGWR5";
    var resolveArray = [];
    list.forEach(function(friend) {
        var requestWithEmail = JQUERY4U.UTIL.formatVarString(request, friend);
                $.get(requestWithEmail, function(p){
                    if(p[0].posts.length == 0){
                        var item = new postEmailOb({"Body" : "test"}, "never getting rendered");
                        resolveArray.push(item);
                    }
                    (p[0].posts).forEach(function(post){
                        var item = new postEmailOb(post, friend);
                        resolveArray.push(item);
                    });
                });
    });
    //I had no choice but to do this
    setTimeout(function() {
        x(resolveArray);
    }, 1500)

}

function x(array){
        $.get("/email", function(data){
            b(array, data);
        });
}



function b(array, curruser){
    array.sort(function(a, b) {
        var dateA = moment(new Date(a.post.date)); // ignore upper and lowercase
        var dateB = moment(new Date(b.post.date)) ; // ignore upper and lowercase
        if (dateA.isBefore(dateB)) {
            return -1;
        }
        if (dateB.isBefore(dateA)) {
            return 1;
        }

        // names must be equal
        return 0;
    });
    if(array.length ==1){
        $("#post_creation").after(noFriends);
        $(".loaderContainer").remove();
    }
    else {
        generatePosts(array, curruser);
    }
}


function generatePosts(input, curruser){
    input.forEach(function(postEmail){
        if(postEmail.email == "never getting rendered"){
            return;
        }
        var email = postEmail.email;
        var post = postEmail.post;
        var found = 0;
        //Unpack datetime
        var d = new moment(new Date(post.date));
        post.likes.forEach(function(like){
            if(like == curruser){
                found = 1;
            }
        });
        if(found ==  1){
            html_to_add = JQUERY4U.UTIL.formatVarString("<div class='container-fluid cardcontainer dropdown_newitem norm_posts row-eq-height'><div class='col-sm-2 no_pad'>\n" +
                " <div class='col-sm-12 container_card center_text'><img class='profile-picture' src='{7}'><div><a href = 'javascript:void(0)' class = 'userLink' data-content = '{3}'>{6}</a></div>\n" +
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
                " <div class='btn-group'> <a href='javascript:void(0)' class='btn btn-default like liked' data-content = '{3}' data-index = '{4}'>Like</a> </div>" +
                " </div>\n" +
                " </div>\n" +
                " </div>", post.Body, post.likes.length, email, post.index, d.format('Do MMMM YYYY h:ss a'), (post.first_name + ' ' +  post.last_name), post.pic);
            $("#post_creation").after(html_to_add);
        }
        else{
            html_to_add = JQUERY4U.UTIL.formatVarString("<div class='container-fluid cardcontainer dropdown_newitem norm_posts row-eq-height'><div class='col-sm-2 no_pad'>\n" +
                " <div class='col-sm-12 container_card center_text'><img class='profile-picture' src='{7}'><div><a href = 'javascript:void(0)' class = 'userLink' data-content = '{3}'>{6}</a></div>\n" +
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
                " <div class='btn-group '> <a href='javascript:void(0)' class='btn btn-default like' data-content = '{3}' data-index = '{4}'>Like</a> </div>" +
                " </div>\n" +
                " </div>\n" +
                " </div>", post.Body, post.likes.length, email, post.index, d.format('Do MMMM YYYY h:ss a'), (post.first_name + ' ' +  post.last_name), post.pic);
            $("#post_creation").after(html_to_add);
        }
    });
    clickedUser();
    likeBehaviour();
    //Remove loader when the data is loaded
    $(".loaderContainer").remove();
};


var noFriends = "<div class=\"container-fluid basic_card dropdown template_padding3 text-center\">\n" +
    "            <div class=\"template_padding\">\n" +
    "                <p>\n" +
    "                    You don't appear to be following anyone. Use the search bar on the top of the page to find people!\n" +
    "                </p>\n" +
    "            </div>\n" +
    "        </div>";


//Functionality for user profile links
function clickedUser(){
    $(".userLink").click(function(){
        var email = $(this).data("content");
        var request = "https://api.mlab.com/api/1/databases/webtech_project/collections/users?q={%27email%27:%27{1}%27}&apiKey=8UH049mkHoClUyTCFpDiNNKp8BuoGWR5";
        var requestWithEmail = JQUERY4U.UTIL.formatVarString(request, email);
        $.ajax({
            type: "GET",
            url: requestWithEmail,
            success: function (user) {
                $.ajax({
                    type: "POST",
                    url: "/otherProfile",
                    data: {"user" : user},
                    success: function (data) {
                        window.location.replace("/otherProfile");
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                    }
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
            }
        });
    });
}



function playListBehaviour() {
    $("#sub_post_playlist").click(function(){
        var inputString = $("#playlist_input").val();
        var n = inputString.lastIndexOf('/');
        var playListId = inputString.substring(n + 1);
        console.log(playListId);
        $.ajax({
            type: "POST",
            url: "/setPlaylist",
            data: {"playlist" : playListId},
            success: function (data) {
                $("#playlist_input").val("");
            },
            error: function (jqXHR, textStatus, errorThrown) {
            }
        });
    });
}

function logoutBehaviour(){
    $("#logout").click(function(){
        $.post("/logout", function(){
            window.location.replace("/login");
        });
    });
}

function searchBehaviour(){
    $(".search_btn").click(function(){
        var search = $(".search_field").val();
        $.ajax({
            type:    "POST",
            url:     "/newSearch",
            data:    {"toSearch" : search},
            success: function(data) {
                window.location.replace("/userSearch");
            }
            ,
            // vvv---- This is the new bit
            error:   function(jqXHR, textStatus, errorThrown) {
            }
        });
    });
}


//https://itunes.apple.com/au/playlist/ooft/pl.u-76jytNkvrl8

//<iframe src="https://tools.applemusic.com/embed/v1/playlist/pl.u-JPj3tWmLe4b?country=au" height="530px" width="100%" frameborder="0"></iframe>

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

