var mongoose = require('mongoose');
var userSchema = mongoose.Schema(
    {
        "email": String,
        "password": String,
        "first_name": String,
        "last_name": String
    }
);

mongoose.model('users', userSchema);