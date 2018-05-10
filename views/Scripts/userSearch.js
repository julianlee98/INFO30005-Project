$(document).ready(function(){
    generateResults();
});


function generateResults(){
    var request = 'https://api.mlab.com/api/1/databases/webtech_project/collections/users?apiKey=8UH049mkHoClUyTCFpDiNNKp8BuoGWR5'
    $.get(request, function(data){
        console.log(data);
        callback(data);
    });
}

function callback(data){
    var options = {
        shouldSort: true,
        threshold: 0.6,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [
            "first_name",
            "last_name"
        ]
    };
    var fuse = new Fuse(data, options); // "list" is the item array
    $.get("/searchInfo", function(data){
        var result = fuse.search(data);
        a(result);
    });
}

function a(result){
    console.log(result);
    var x = 0;
    var string = "";
    if(result.length % 2 == 0){
        result.forEach(function(user){
            if(x%2 == 0){
                string += JQUERY4U.UTIL.formatVarString(templateEven, user.first_name + " " + user.last_name, user.email, user.about );
            }
            else{
                string += JQUERY4U.UTIL.formatVarString(templateOdd, user.first_name + " " + user.last_name, user.email, user.about );
            }
            x+=1;
        });
        $(".insertAfter").after(string);
        string = "";
    }
    else{
        var lastuser = result.pop();
        result.forEach(function(user){
            if(x%2 == 0){
                string += JQUERY4U.UTIL.formatVarString(templateEven, user.first_name + " " + user.last_name, user.email, user.about );
            }
            else{
                string += JQUERY4U.UTIL.formatVarString(templateOdd, user.first_name + " " + user.last_name, user.email, user.about );
            }
            x+=1;
        });

        string += JQUERY4U.UTIL.formatVarString(templateSingle, lastuser.first_name + " " + lastuser.last_name, lastuser.email, lastuser.about );

        $(".insertAfter").after(string);
        string = "";
    }
    clickedOnName();
}

function clickedOnName(){
    $(".userLink").click(function(){
        var request = "https://api.mlab.com/api/1/databases/webtech_project/collections/users?q={%27email%27:%27{1}%27}&apiKey=8UH049mkHoClUyTCFpDiNNKp8BuoGWR5";
        var email = $(this).data("content");
        var requestWithEmail = JQUERY4U.UTIL.formatVarString(request, email);
        $.get(requestWithEmail, function(user){
            b(user);
        })
    })

}

function  b(user) {
    $.ajax({
        type:    "POST",
        url:     "/otherProfile",
        data:    {"user" : user},
        success: function(data, textStatus, xhr) {
            window.location.replace("/otherProfile");
        },
        // vvv---- This is the new bit
        error:   function(jqXHR, textStatus, errorThrown) {
            alert("Error, status = " + textStatus + ", " +
                "error thrown: " + errorThrown
            );
        }
    });
}




var templateEven =
    "        <div class=\"container-fluid cardcontainer dropdown norm_posts row-eq-height\">\n" +
    "            <!--User Search Result-->\n" +
    "            <div class=\"col-sm-2 no_pad\">\n" +
    "                <div class=\"col-sm-12 container_card center_text\">\n" +
    "                    <img class=\"profile-picture\" src=\"/link_images/user.png\">\n" +
    "                    <div><a href='javascript:void(0)' class = 'userLink' data-content = '{2}'> {1} </a></div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"col-sm-4 no_pad\">\n" +
    "                <div class=\"col-sm-12 container_card template_padding\">\n" +
    "                    <p>{3}</p>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <!--User Search Result-->\n";

var templateOdd = " <div class=\"col-sm-2 no_pad\">\n" +
"                <div class=\"col-sm-12 container_card center_text\">\n" +
"                    <img class=\"profile-picture\" src=\"/link_images/user.png\">\n" +
"                    <div><a href='javascript:void(0)' class = 'userLink' data-content = '{2}'> {1} </a></div>\n" +
"                </div>\n" +
"            </div>\n" +
"            <div class=\"col-sm-4 no_pad\">\n" +
"                <div class=\"col-sm-12 container_card template_padding\">\n" +
"                    <p>{3}</p>\n" +
"                </div>\n" +
"            </div>\n" +
"        </div>";

var templateSingle =     "        <div class=\"container-fluid cardcontainer dropdown norm_posts row-eq-height\">\n" +
    "            <!--User Search Result-->\n" +
    "            <div class=\"col-sm-2 no_pad\">\n" +
    "                <div class=\"col-sm-12 container_card center_text\">\n" +
    "                    <img class=\"profile-picture\" src=\"/link_images/user.png\">\n" +
    "                    <div><a href='javascript:void(0)' class = 'userLink' data-content = '{2}'> {1} </a></div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"col-sm-4 no_pad\">\n" +
    "                <div class=\"col-sm-12 container_card template_padding\">\n" +
    "                    <p>{3}</p>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <!--User Search Result-->\n" +
    "        </div>";





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