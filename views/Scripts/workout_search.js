$(document).ready(function() {
    searchBehaviour();
    generateResults();
    logoutBehaviour();
} );



function searchBehaviour(){
    $(".workoutSearchBtn").click(function(){
        var search = $(".workoutSearchField").val();
        $.ajax({
            type:    "POST",
            url:     "/workoutSearch",
            data:    {"searchInput": search},
            success: function(data) {
                window.location.replace("/workout_search");
            }
            ,
            // vvv---- This is the new bit
            error:   function(jqXHR, textStatus, errorThrown) {
            }
        });
    });
};


function generateResults(){
    var request = 'https://api.mlab.com/api/1/databases/webtech_project/collections/users?apiKey=8UH049mkHoClUyTCFpDiNNKp8BuoGWR5'
    $.get(request, function(data){
        callback(data);
    });
}

//Get all workouts in database
function callback(data){
    var allworkouts = [];
    data.forEach(function(user){
       user.workouts.forEach(function(workout){
           allworkouts.push({"workout" : workout, "email" : user.email, "first_name" : user.first_name, "last_name" : user.last_name,"workoutName" : workout.workoutName,
           "difficulty": workout.difficulty, "gender" : workout.gender});
       });
    });
    var options = {
        shouldSort: true,
        threshold: 0.4,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [
            "first_name",
            "last_name",
            "workoutName",
            "difficulty",
            "gender"
        ]
    };
    var fuse = new Fuse(allworkouts, options); // "list" is the item array
    console.log(allworkouts);
    $.get("/workoutSearch", function(data){
        if(data == ""){
            var result = [];
        }
        else{
            var result = fuse.search(data);
        }
        callback2(result);
    });
}

function callback2(search_results){
    search_results.forEach(function(result){
        console.log(result);
        var html_to_insert = JQUERY4U.UTIL.formatVarString(template, result.first_name + " " + result.last_name, result.workout.workoutName, result.workout.difficulty,
            result.workout.intensity, result.workout.muscles, result.workout.duration, result.workout.gender);
        $(".insert_after").after(html_to_insert);
    });
}

var template = "<div class=\"search-result\">\n" +
    "            <div class=\"container-fluid cardcontainer dropdown norm_posts row-eq-height\">\n" +
    "                <div class=\"col-sm-2 no_pad\">\n" +
    "                    <div class=\"col-sm-12 container_card center_text\">\n" +
    "                        <img class=\"profile-picture\" src=\"/link_images/user.png\">\n" +
    "                        <div>{1}</div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"col-sm-10 no_pad\">\n" +
    "                    <div class=\"col-sm-12 container_card template_padding\">\n" +
    "                        <h2 class=\"workout-name\">{2}</h2>\n" +
    "                        <p>A workout built to establish work-life balance.</p>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"container-fluid nomargin_cardcontainer dropdown norm_posts row-eq-height\">\n" +
    "                <div class=\"col-sm-12 container_card template_padding\">\n" +
    "                    <table id=\"example\" class=\"display table\" style=\"width:100%\">\n" +
    "                        <thead>\n" +
    "                        <tr>\n" +
    "                            <!--<th>User</th>-->\n" +
    "                            <!--<th>Workout name</th>-->\n" +
    "                            <th>Difficulty</th>\n" +
    "                            <th>Intensity</th>\n" +
    "                            <th>Muscle groups</th>\n" +
    "                            <th>Duration</th>\n" +
    "                            <th>Gender</th>\n" +
    "                        </tr>\n" +
    "                        </thead>\n" +
    "                        <tbody>\n" +
    "                        <tr>\n" +
    "                            <!--<td>Julian Lee</td>-->\n" +
    "                            <!--<td>After work arms</td>-->\n" +
    "                            <td>{3}</td>\n" +
    "                            <td>{4}</td>\n" +
    "                            <td>{5}</td>\n" +
    "                            <td>{6}</td>\n" +
    "                            <td>{7}</td>\n" +
    "                        </tr>\n" +
    "                        </tbody>\n" +
    "                    </table>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>";




function logoutBehaviour(){
    $("#logout").click(function(){
        $.post("/logout", function(){
            window.location.replace("/login");
        });
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
