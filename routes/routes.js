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

   User.create({first_name: firstname, last_name: lastname, email:email, password: password, posts : [], friends : ["julianlee98@gmail.com", "test@test.com", "aaaa@aaaa.com"]} , function(err,user){
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
               res.status(200).send();
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

router.post('/otherProfile', function (req, res) {
    if(!req.session.user){
        return res.status(401).send();
    }

    var user = req.body.user;
    res.render("profile", {user: user} );
    window.location.href = "/otherProfile";
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
});

module.exports = router;