const express = require('express');
const router = express.Router();
const controller = require("../controllers/testDb Controller");

var User = require("../models/user.js")

router.get('/', controller.loginPage);
router.get('/login', controller.loginPage);


router.get('/comingSoon', controller.comingSoon);

router.post('/submitLogin', function(req, res){
    var email = req.body.email;
    var password = req.body.password;
    User.findOne({email: email, password: password}, function (err, user) {
        if(err){
            console.log(err);
            return res.status(500).send();
        }
        if(!user) {
            res.redirect("/loginIncorrect");
            return res.status(404).send();
        }
        req.session.user = user;
        res.redirect("/home");
        return res.status(202).send();
    })
});

router.post("/submitSignup", function(req, res){

   var firstname = req.body.fname;
   var lastname = req.body.lname;
   var email = req.body.email;
   var password = req.body.password;
   var about = req.body.about;

   User.create({first_name: firstname, last_name: lastname, email:email, password: password, posts : [], friends : [email], about : about, workouts : []} , function(err,user){
       if(err){
           console.log(err);
           return res.status(500).send();
       }
       req.session.user = user;
       res.redirect("/home");
       return res.status(202).send();
   });
});

router.get('/home', function (req, res) {
    if(!req.session.user){
        return res.status(401).send();
    }
    User.findOne({email : req.session.user.email}).then(
        function(user) {
            res.render("home", {user: user});
            return res.status(200).send();
        }
    ).catch(function (err) {

    })
});




router.get('/posts', function(req, res){
    res.send(req.session.user.posts);
});

router.get('/email', function(req, res){
    res.send(req.session.user.email);
});

router.get('/friends', function(req, res){
   res.send(req.session.user.friends);
});



router.post("/newPost", function(req, res){
    if(!req.session.user){
        return res.status(401).send();
    }
    var Body = req.body.Body;
    var likes = req.body.likes;
    var date = req.body.date;
    var fname = req.session.user.first_name;
    var lname = req.session.user.last_name;

    User.findOne({email : req.session.user.email}).then(
        function(user) {
            user.posts.push({'Body': Body, 'Likes' : likes, "index" : user.posts.length, 'date' : date, 'first_name' : fname, 'last_name' : lname} );
            res.status(200).send();
            return user.save();
        }
    ).then(function() {
    })
        .catch(function (err) {

        })
});

router.post("/likePost", function(req, res){
   if(!req.session.user){
       return res.status(401).send();
   }

   var email = req.body.email;
   var index = req.body.index;
   var add = req.body.add;

   User.findOne({email : email}).then(
       function(user){
           if(add == "true") {
               user.posts[index].likes.push(req.session.user.email);
               console.log("oh");
               console.log(user.posts[index].likes);
           }
           else{
               var x = 0;
               user.posts[index].likes.forEach(function(users){
                   if(users == req.session.user.email){
                       user.posts[index].likes.splice(x,1);
                   }
                   x+=1;
               });
               console.log("oh");
               console.log(user.posts[index].likes);
           }
           res.status(200).send();
           return user.save();
       }
   ).then(function() {
   })
       .catch(function (err) {

       })

});


router.post("/followPerson", function(req, res) {
    if (!req.session.user) {
        return res.status(401).send();
    }

    var email = req.body.email;
    var follow = req.body.follow;

    User.findOne({email : req.session.user.email}).then(
        function(user) {
            if (follow == "true") {
                user.friends.push(email);
                console.log(user.friends);
                console.log("UHH");
            }
            else {
                var x = 0;
                (user.friends).forEach(function(friend){
                    if(friend == email){
                        user.friends.splice(x,1);
                    }
                    x+=1;
                });
                console.log("UHH");
                console.log(user.friends);
            }
            res.status(200).send();
            return user.save();
        }
    ).then(function() {
    })
        .catch(function (err) {

        })



});

router.get('/profile', function (req, res) {
    if(!req.session.user){
        return res.status(401).send();
    }
    User.findOne({email : req.session.user.email}).then(
        function(user) {
            res.render("profile", {user: user} );
        }
    ).catch(function (err) {

    });

});

var user;

router.post('/otherProfile', function(req,res){
    user = req.body.user;
    return res.status(200).send();
});



router.get('/otherProfile', function (req, res) {
    if(!req.session.user){
        return res.status(401).send();
    }
    res.render("profile", {user: user[0]});
    return res.status(200).send();
});


router.get('/loginIncorrect', function (req, res){
   res.render("loginIncorrect");
});

router.get('/settings', function (req, res) {
    if(!req.session.user){
        return res.status(401).send();
    }
    res.render("settings");
});

router.get('/workout_builder', function (req, res) {
    if(!req.session.user){
        return res.status(401).send();
    }
    res.render("workout_builder");
});

router.get('/workout_search', function (req, res) {
    if(!req.session.user){
        return res.status(401).send();
    }
    res.render("workout_search");
});

var globalSearch;
var globalWorkoutSearch;

router.get('/userSearch', function (req, res){
    if(!req.session.user){
        return res.status(401).send();
    }
    res.render("userSearch");
});


router.post("/newSearch", function (req, res){
    if(!req.session.user){
        return res.status(401).send();
    }
    var search = req.body.toSearch;
    globalSearch = search;
    return res.status(200).send();
});


router.get("/searchInfo", function(req,res){
    res.send(globalSearch);
    globalSearch = "";
});


router.post("/workoutSearch", function(req,res){
    if(!req.session.user){
        return res.status(401).send();
    }
    var searchInput = req.body.searchInput;
    globalWorkoutSearch = searchInput;
    res.status(200).send();
});

router.get("/workoutSearch", function(req,res){
    res.send(globalWorkoutSearch);
});

router.post("/newWorkout", function(req, res){
    if(!req.session.user){
        return res.status(401).send();
    }

    var workoutName = req.body.workoutName;
    var gender = req.body.gender;
    var duration = req.body.duration;
    var muscles = req.body.muscles;
    var intensity = req.body.intensity;
    var difficulty = req.body.difficulty;
    var workoutDescription = req.body.workoutDescription;
    var exercises = req.body.exercises;
    var equipment = req.body.equipment;

    var workout = {'workoutName' : workoutName, 'gender' : gender, 'duration' : duration, 'muscles' : muscles, 'equipment' : equipment,
        'intensity' : intensity, 'difficulty' : difficulty, 'workoutDescription' : workoutDescription,
        'exercises' : exercises};

    User.findOne({email : req.session.user.email}).then(
        function(user) {
            console.log(user.workouts);
            user.workouts.push(workout);
            console.log("here:");
            console.log(user.workouts[0]);
            res.status(200).send();
            return user.save();
        }
    ).then(function() {
    })
        .catch(function (err) {

        })

});

var workoutToShow;
var userToShow;

router.post("/workoutDetails", function(req, res){
    workoutToShow = req.body.workoutName;
    userToShow = req.body.email;
    return res.status(200).send();
});

router.get("/workoutDetails", function(req, res){
    var clickedWorkout;
    User.findOne({email : userToShow}).then(
        function(user) {
           var workouts  = user.workouts;
           workouts.forEach(function(workout){
              if(workout.workoutName.trim() == workoutToShow.trim()){
                  clickedWorkout = workout;
              }
           });
           res.render("workoutDetails", {workout: clickedWorkout, user: user});
           return res.status(200).send();
        }
    ).then(function() {
    })
        .catch(function (err) {

        })
});

router.post("/newAbout", function (req, res) {
    var newAbout = req.body.newAbout;
    console.log(newAbout);
    User.findOne({email : req.session.user.email}).then(
        function(user) {
            user.about = newAbout;
            res.status(200).send();
            return user.save();
        }
    ).catch(function (err) {

        })


});



module.exports = router;