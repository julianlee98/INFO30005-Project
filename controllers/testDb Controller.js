const dbContent = require("../models/db");

module.exports.mainContent = function(req, res){
  res.send(dbContent);
};

module.exports.homePage = function (req,res) {
    res.render('home', {content: dbContent[0]});
};

module.exports.comingSoon  = function (req, res) {
    res.render('comingsoon', {content: dbContent[0]});
};

module.exports.profilePage  = function (req, res) {
    res.render('profile', {content: dbContent[0]});
};

module.exports.settingsPage  = function (req, res) {
    res.render('settings', {content: dbContent[0]});
};

module.exports.workoutBuilder  = function (req, res) {
    res.render('workout_builder', {content: dbContent[0]});
};

module.exports.workoutSearch  = function (req, res) {
    res.render('workout_search', {content: dbContent[0]});
};

