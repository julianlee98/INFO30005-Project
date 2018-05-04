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

   User.create({first_name: firstname, last_name: lastname, email:email, password: password, posts : []} , function(err,user){
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
    res.render("home", {user: req.session.user});
});

router.get('/posts', function(req, res){
    res.send(req.session.user.posts);
});

router.get('/email', function(req, res){
    res.send(req.session.user.email);
});



router.post("/newPost", function(req, res){
    if(!req.session.user){
        return res.status(401).send();
    }
    var Body = req.body.Body;
    var likes = req.body.likes;

    // User.findOneAndUpdate({email : req.session.user.email}, {"$push" : { "title" : "test title", "body" : "testbody", "likes" : 5}});
    User.findOne({email : req.session.user.email}).then(
        function(user) {
            user.posts.push({'Body': Body, 'Likes' : likes, "index" : user.posts.length});
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

   console.log(email);
   console.log("???!!");

   User.findOne({email : email}).then(
       function(user){
           if(add == "true") {
               user.posts[index].Likes += 1;
               console.log(user.posts[index].Likes);
               res.status(200).send();
           }
           else{
               user.posts[index].Likes -= 1;
               console.log(user.posts[index].Likes);
               res.status(200).send()
           }
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

    res.render("profile", {user: req.session.user} );

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


module.exports = router;