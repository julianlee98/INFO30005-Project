var mongoose = require('mongoose');

var Posts = mongoose.Schema({
    "title" : String,
    "Body" : String,
    "Likes" : Number
});

var userSchema = mongoose.Schema(
    {
        "email": String,
        "password": String,
        "first_name": String,
        "last_name": String,
        "posts" : Posts
    }
);

var User = mongoose.model('users', userSchema);
module.exports = User;
