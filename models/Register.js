const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

//Set schema for login page
var UserSchema = new Schema({
    username: {
        type: String,
        trim: true,
    },
    password: {
        type: String, 
        trim: true,
    },
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);