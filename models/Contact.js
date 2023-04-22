const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

//Set schema for login page
var ContactSchema = new Schema({
  email: {
    type: String,
    trim: true,
  },
  message: {
    type: String,
    trim: true,
  },
});

ContactSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Contact", ContactSchema);
