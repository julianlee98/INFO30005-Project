var workoutName;
var gender;
var duration;
var muscleGroups;
var equipment;
var intensity;
var difficulty;
var workoutDescription;


function exerciseObject(exercise, sets, reps, rest)
{
    this.exercise = exercise;
    this.sets = sets;
    this.reps = reps;
    this.rest = rest;
}

var exercises = [];


$(document).ready(function(){
    $(".save_workout").click(function(){
        workoutSave();
    });
    $(".add-to-workout").click(function(){
        addWorkout();
    });
    logoutBehaviour();
});

function workoutSave(){
    // name
    workoutName = $("#workoutName").val();
    // gender
    $('#genderToggle .active').each(function(){
        gender = $(this).text();
    });
    // duration
    duration = $("#duration").val();
    // muscles
    muscleGroups = $("#muscle-group").val();
    // equipment
    equipment = $('#equipment').val();
    // intensity
    $('#intensityToggle .active').each(function(){
        intensity = $(this).text();
    });
    // difficulty
    $('#difficultyToggle .active').each(function(){
        difficulty = $(this).text();
    });
    // workoutDescription
    workoutDescription = $("#aboutText").val();

    $.ajax({
        type:    "POST",
        url:     "/newWorkout",
        data:    {"workoutName" : workoutName , "gender" : gender, "duration" : duration, "muscles" : muscleGroups, "equipment" : equipment,
        "intensity" : intensity, "difficulty" : difficulty, "workoutDescription" : workoutDescription,
            "exercises" : JSON.stringify(exercises)},
        success: function(data) {
            window.location.replace("/workout_builder");
        }
        ,
        // vvv---- This is the new bit
        error:   function(jqXHR, textStatus, errorThrown) {
        }
    });


}


function addWorkout(){
    var exercise = $("#exercise").val();
    var sets = $("#set").val();
    var reps = $("#repetition").val();
    var rest = $("#rest").val();

    var newExercise = new exerciseObject(exercise, sets, reps, rest);
    exercises.push(newExercise);

    // Clear fields
    $("#exercise").val("");
    $("#set").val("");
    $("#repetition").val("");
    $("#rest").val("");
    // $("#workoutName").val("");
    // $("#duration").val("");
    // $("#muscle-group").val("");
    // $('#equipment').val("");
    // $('#aboutText').val("");

    html_to_add = JQUERY4U.UTIL.formatVarString(template, exercise, sets, reps);
    $(".add_exercises_after").after(html_to_add);
}


var template = "<div class=\" basic_smoll container\">\n" +
    "                            <div class=\"row\">\n" +
    "                                <div class = \"col-sm-6\"> <b> {1} </b> </div>\n" +
    "                                <div class = \"col-sm-3 e\"> Sets {2} </div>\n" +
    "                                <div class = \"col-sm-3 e\"> Reps {3} </div>\n" +
    "                            </div>\n" +
    "                    </div> ";



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