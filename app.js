var express = require('express'),
    bodyParser = require('body-parser');
const User = require('./models/Register');
const routes = require('./routes/index');
const path = require("path");

//Declare the app
const app = express();
//tell the app to include files from public folder
app.use(express.static("public"));
//Set template directory to pug
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: true }));
//set the app to use routes folder
app.use('/', routes);

module.exports = app;