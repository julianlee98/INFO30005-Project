var mongoose = require('mongoose');

var Posts = mongoose.Schema({
    "Body" : String,
    "likes" : [String],
    "index" : Number,
    "date" : String,
    "first_name" : String,
    "last_name" : String
});

var userSchema = mongoose.Schema(
    {
        "email": String,
        "password": String,
        "first_name": String,
        "last_name": String,
        "posts" : [Posts],
        "friends" : [String],
        "about" : String
    }
);

var User = mongoose.model('users', userSchema);
module.exports = User;
