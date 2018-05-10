var request = "https://api.mlab.com/api/1/databases/webtech_project/collections/users?q={%27email%27:%27{1}%27}&apiKey=8UH049mkHoClUyTCFpDiNNKp8BuoGWR5";

$(document).ready(function(){
    generateWorkouts();
});



function generateWorkouts(){
    var email = $(".wrapper").data("content");
    var nameOfWorkout = $("#workoutName").text().trim();
    var workoutToProcess;
    var requestWithEmail = JQUERY4U.UTIL.formatVarString(request, email);
    $.ajax({
        type:    "GET",
        url:     requestWithEmail,
        success: function(data) {
            var workouts = data[0].workouts;
            // loop through workouts to find the one we want to list posts for
            workouts.forEach(function(workout){
                if(workout.workoutName == nameOfWorkout){
                    workoutToProcess = workout;
                }
            });
            var exercises = JSON.parse(workoutToProcess.exercises);
            console.log(exercises);
            // loop through exercise array to add each exercise to the html
            exercises.forEach(function(currExercise){
                var exerciseName = currExercise.exercise;
                var sets = currExercise.sets;
                var reps = currExercise.reps;
                var rest = currExercise.rest;
                var htmlToAdd = JQUERY4U.UTIL.formatVarString(template,exerciseName, sets, reps, rest);
                $(".insert_after").after(htmlToAdd);
            });
        },
        error:   function(jqXHR, textStatus, errorThrown) {
        }
    });
}

var template =  "<div class = \"a col-xs-4\">\n" +
    "                    <div class=\"col-sm-12 center_text\">\n" +
    "                        <div class = \"title_text\"><b>{1}</b> </div>\n" +
    "                        <p> Sets: {2}</p>\n" +
    "                        <p> Repetitions: {3} </p>\n" +
    "                        <p> Rest: {4} minutes </p>\n" +
    "                    </div>\n" +
    "                </div>"





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

