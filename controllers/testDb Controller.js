const dbContent = require("../models/db");

module.exports.mainContent = function(req, res){
  res.send(dbContent);
};

module.exports.loginPage  = function (req, res) {
    res.render('login');
};

module.exports.homePage = function (req,res) {
    res.render('home');
};

module.exports.comingSoon  = function (req, res) {
    res.render('comingsoon');
};

module.exports.profilePage  = function (req, res) {
    res.render('profile');
};

module.exports.settingsPage  = function (req, res) {
    res.render('settings');
};

module.exports.workoutBuilder  = function (req, res) {
    res.render('workout_builder');
};

module.exports.workoutSearch  = function (req, res) {
    res.render('workout_search');
};



var mongoose = require("mongoose");
var User = mongoose.model('users');

module.exports.createUserFunc = function(req,res) {
    console.log("CONNECTED WODIHASOIDNSAOIND");
    var user = new User({
        "email": req.body.email,
        "password": req.body.password,
        "first_name": req.body.first_name,
        "last_name": req.body.last_name
    });
    user.save(function(err, newUser){
        if(!err){
            res.send(newUser);
        }else{
            res.sendStatus(400);
        }
    });
};


module.exports.findAllUsers = function(req,res){
    console.log("CONNECTED WODIHASOIDNSAOIND");
    User.find(function(err,users){
        if(!err){
            res.send(users);
        }
        else{
            res.send(404);
        }
    })
};

module.exports.findUser = function(req, res){
    var found = 0;
     User.find(function(err,users){
         if(!err){
             for(var i in users){
                 if(users[i]["email"] == req.params.uemail){
                     found = 1;
                     res.send(users[i]);
                 }
             }
             if(found == 0) {
                 res.send(null);
             }
             return users;
         }
         else{
             return null;
         }
     });
};
