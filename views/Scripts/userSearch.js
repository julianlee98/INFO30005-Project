$(document).ready(function(){
    generateResults();
    clickedOnName();
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
    result.forEach(function(user){
        $(".insertAfter").after(template);
    });
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
        },
        // vvv---- This is the new bit
        error:   function(jqXHR, textStatus, errorThrown) {
            alert("Error, status = " + textStatus + ", " +
                "error thrown: " + errorThrown
            );
        }
    });

}


var template = " <div class=\"container-fluid cardcontainer dropdown norm_posts row-eq-height\">\n" +
    "            <!--User Search Result-->\n" +
    "            <div class=\"col-sm-2 no_pad\">\n" +
    "                <div class=\"col-sm-12 container_card center_text\">\n" +
    "                    <img class=\"profile-picture\" src=\"/link_images/user.png\">\n" +
    "                    <div>Jeff Tong</div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"col-sm-4 no_pad\">\n" +
    "                <div class=\"col-sm-12 container_card template_padding\">\n" +
    "                    <p>Trying to lose enough weight to fit into a latex bodysuit, Join me on my journey!</p>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <!--User Search Result-->\n" +
    "            <div class=\"col-sm-2 no_pad\">\n" +
    "                <div class=\"col-sm-12 container_card center_text\">\n" +
    "                    <img class=\"profile-picture\" src=\"/link_images/user.png\">\n" +
    "                    <div>Julian Lee</div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"col-sm-4 no_pad\">\n" +
    "                <div class=\"col-sm-12 container_card template_padding\">\n" +
    "                    <p>Trying to lose enough weight to fit into a latex bodysuit, Join me on my journey!</p>\n" +
    "                </div>\n" +
    "            </div>\n" +
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