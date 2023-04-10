var express = require('express'),
    bodyParser = require('body-parser');
const User = require('./models/Register');
const routes = require('./routes/index');
const path = require("path");



const app = express();

//Set template directory
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: true }));

//set the app to use routes folder
app.use('/', routes);

module.exports = app;