const express = require('express');
const router = express.Router();
const controller = require("../controllers/testDb Controller");

var User = require("../models/user.js")

router.get('/', controller.loginPage);
router.get('/login', controller.loginPage);
// router.get('/home', controller.homePage);
router.get('/settings', controller.settingsPage);
router.get('/profile', controller.profilePage);
router.get('/workout_builder', controller.workoutBuilder);
router.get('/workout_search', controller.workoutSearch);


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
            res.redirect("/login");
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

   User.create({firstname: firstname, lastname: lastname, email:email, password: password}, function(err,user){
       if(err){
           console.log(err);
           return res.status(500).send();
       }
       res.redirect("/home");
       return res.status(202).send();
   });
});

router.get('/home', function (req, res) {
    if(!req.session.user){
        return res.status(401).send();
    }
    res.render("home")
    return res.status(200).send();
})



module.exports = router;