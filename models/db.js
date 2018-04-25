var mongoose = require('mongoose');

mongoose.connect('mongodb://julian_lee:123456789@ds247698.mlab.com:47698/webtech_project', function(err, db){
    if(!err){
        console.log("Connected");
    }
    else {
        console.log("Error");
    }
    });

require('./user.js');
