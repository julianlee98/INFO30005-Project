var request = "https://api.mlab.com/api/1/databases/webtech_project/collections/users?q={%27email%27:%27{1}%27}&apiKey=8UH049mkHoClUyTCFpDiNNKp8BuoGWR5";

$(document).ready(function(){
    followedOrNot();
    generateWorkouts();
    setFollowBehaviour();
});


function linkBehaviour(){
    $(".workoutLink").click(function(){
        var email = $(".wrapper").data("content");
        var workoutName = $(this).text();
        $.ajax({
            type:    "POST",
            url:     "/workoutDetails",
            data: {"workoutName" : workoutName, "email" :email},
            success: function(data) {
                window.location.replace("/workoutDetails");
            },
            error:   function(jqXHR, textStatus, errorThrown) {
                alert("Error, status = " + textStatus + ", " +
                    "error thrown: " + errorThrown
                );
            }
        });
    })
}

function generateWorkouts(){
    var email = $(".wrapper").data("content");
    var requestWithEmail = JQUERY4U.UTIL.formatVarString(request, email);
    $.ajax({
        type:    "GET",
        url:     requestWithEmail,
        success: function(data) {
            var workouts = data[0].workouts;
            workouts.forEach(function(workout){
                var workoutName = workout.workoutName;
                var duration = workout.duration;
                var muscles = workout.muscles;
                var intensity = workout.intensity;
                var difficulty = workout.difficulty;
                var htmlToAdd = JQUERY4U.UTIL.formatVarString(template, workoutName, duration, muscles, intensity, difficulty);
                $(".insert_after").after(htmlToAdd);
            });
            linkBehaviour();
        },
        error:   function(jqXHR, textStatus, errorThrown) {
            alert("Error, status = " + textStatus + ", " +
                "error thrown: " + errorThrown
            );
        }
    });
}

var template =  "<div class = \"a col-xs-4\">\n" +
    "                    <div class=\"col-sm-12 center_text\">\n" +
    "                        <div class = \"title_text\"><b><a href = 'javascript:void(0)' class = 'workoutLink'>{1} </a> </b> </div>\n" +
    "                        <p> Duration: {2} minutes</p>\n" +
    "                        <p> Body part: {3} </p>\n" +
    "                        <p> Intensity: {4} </p>\n" +
    "                        <p> Difficulty: {5} </p>\n" +
    "                    </div>\n" +
    "                </div>";




function followedOrNot(){
        $.get("/email", function(email) {
            var requestWithEmail = JQUERY4U.UTIL.formatVarString(request, email);
            $.ajax({
                type: "GET",
                url: requestWithEmail,
                success: function (data) {
                    var flist = data[0].friends;
                    console.log(flist);
                    flist.forEach(function (friend) {
                        console.log($(".btn_follow").data("content"));
                        console.log(friend);
                        if ($(".btn_follow").data("content") == friend) {
                            $(".btn_follow").addClass("followed");
                        }
                    });
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert("Error, status = " + textStatus + ", " +
                        "error thrown: " + errorThrown
                    );
                }
            });
        });
}

function setFollowBehaviour(){
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
