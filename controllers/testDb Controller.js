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

