var mongoose = require('mongoose');

var Posts = mongoose.Schema({
    "Body" : String,
    "Likes" : Number,
    "index" : Number
});

var userSchema = mongoose.Schema(
    {
        "email": String,
        "password": String,
        "first_name": String,
        "last_name": String,
        "posts" : [Posts],
        "friends" : [String]
    }
);

var User = mongoose.model('users', userSchema);
module.exports = User;
