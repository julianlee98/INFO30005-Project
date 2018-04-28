var mongoose = require('mongoose');
var userSchema = mongoose.Schema(
    {
        "email": String,
        "password": String,
        "first_name": String,
        "last_name": String
    }
);

var User = mongoose.model('users', userSchema);
module.exports = User;
