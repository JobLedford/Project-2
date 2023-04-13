const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require("../models/Register");
const flash = require('connect-flash');
const { check, validationResult } = require("express-validator");
const bodyParser = require("body-parser");
const expressSession = require('express-session');
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");

//initialize router
const router = express.Router();
//Create app with parsed info from app.js
router.use(express.urlencoded({ extended: true }));
//initialize express session
router.use(require('express-session')({
    secret: "So Secretive",
    resave: false,
    saveUninitialized: false,
}));
//Call flash to enable error messages
router.use(flash());
//Start Passport
router.use(passport.initialize());
router.use(passport.session());
//Serialize & Desrialize User
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//ROUTES
//Showing Home Page
router.get('/', (req,res) => {
    res.render('home', { title:'Home Page' });
});
//Showing Contact Page
router.get('/contact', (req,res) => {
    res.render('contact', { title: 'Contact Us' });
});
//Showing LogIn Page
router.get('/login', (req,res) => {
    res.render('login', { title: 'Log-In', message: req.flash('error') });
})
//LogIn Logic
router.post('/login', passport.authenticate('local',{
    successRedirect: '/secret',
    failureRedirect: '/login',
    failureFlash: true,
}));

passport.use(
  new LocalStrategy(async function (username, password, done) {
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return done(null, false, { message: "Incorrect username." });
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return done(null, false, { message: "Incorrect password." });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);
//Showing SignUp Page
router.get("/register", (req, res) => {
  res.render("register", { title: 'Sign-Up' });
});
//SignUp Logic
router.post(
  "/",
  [
    check("username")
      .isLength({ min: 1 })
      .withMessage("Please enter a username"),
    check("password")
      .isLength({ min: 1 })
      .withMessage("Please enter a password"),
  ],
  async (req, res) => {
    //console.log(req.body);
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const registration = new User(req.body);
      //generate salt to hash password
      const salt = await bcrypt.genSalt(10);
      //set user passwrod to hashed password
      registration.password = await bcrypt.hash(registration.password, salt);
      registration
        .save()
        .then(() => {
          res.render("Login", { title: "Log-In" });
        })
        .catch((err) => {
          console.log(err);
          res.send("Sorry! Something went wrong.");
        });
    } else {
      res.render("register", {
        title: "Registration Form",
        errors: errors.array(),
        data: req.body,
      });
    }
  }
);
//Showing LogOut Page
/*router.get('/logout', (req,res) => {
    req.logout();
    res.redirect("/");
})
*/
//Authenticated Logic
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}
//Showing Secret Page
router.get("/secret", isAuthenticated, (req, res) => {
  res.render("secret", { url: req.url });
});

module.exports = router;