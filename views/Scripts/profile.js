$(document).ready(function(){
    // $.get('/friends', function (user) {
    //     console.log("Here");
    //     console.log(user);
    //     user.forEach(function(friend){
    //         console.log($(".btn_follow").data("content"));
    //         console.log(friend);
    //        if($(".btn_follow").data("content") == friend){
    //            $(".btn_follow").addClass("followed");
    //        }
    //     });
    // });

    var request = "https://api.mlab.com/api/1/databases/webtech_project/collections/users?q={%27email%27:%27{1}%27}&apiKey=8UH049mkHoClUyTCFpDiNNKp8BuoGWR5";
    $.get('/email', function(data){
        var requestWithEmail = JQUERY4U.UTIL.formatVarString(request, data);
        $.ajax({
            type:    "GET",
            url:     requestWithEmail,
            success: function(data) {
                var flist= data[0].friends;
                console.log(flist);
                flist.forEach(function(friend){
                    console.log($(".btn_follow").data("content"));
                    console.log(friend);
                    if($(".btn_follow").data("content") == friend){
                        $(".btn_follow").addClass("followed");
                    }
                });
            },
            error:   function(jqXHR, textStatus, errorThrown) {
                alert("Error, status = " + textStatus + ", " +
                    "error thrown: " + errorThrown
                );
            }
        });
    });

    a();
});

function a(){
    $(".btn_follow").click(function () {
        //Button will either have the followed tag or won't
        if($(this).hasClass("followed")){
            $.ajax({
                type: "POST",
                url: "/followPerson",
                data: {"email": $(this).data("content"), "follow": "false"},
                success: function (data, textStatus, xhr) {
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert("Error, status = " + textStatus + ", " +
                        "error thrown: " + errorThrown
                    );
                }
            });
        }
        else{
            $.ajax({
                type: "POST",
                url: "/followPerson",
                data: {"email": $(this).data("content"), "follow": "true"},
                success: function (data, textStatus, xhr) {
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert("Error, status = " + textStatus + ", " +
                        "error thrown: " + errorThrown
                    );
                }
            });
        }
        $(this).toggleClass("followed");
    });
}
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
