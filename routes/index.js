const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { check, validationResult } = require("express-validator");
const User = require('../models/Register');
const bodyParser = require("body-parser");
const expressSession = require('express-session');
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");


const router = express.Router();

router.use(express.urlencoded({ extended: true }));

router.use(require('express-session')({
    secret: "So Secretive",
    resave: false,
    saveUninitialized: false,
}));

router.use(passport.initialize());
router.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//ROUTES
//Showing Home Page
router.get('/', (req,res) => {
    res.render('home', { title:'Home Page' });
});

//Showing Secret Page
router.get('/secret', isLoggedIn, (req,res) => {
    res.render('secret');
})

//Showing Contact Page
router.get('/contact', (req,res) => {
    res.render('contact', { title: 'Contact Us' });
});

//Showing Register Page
router.get("/register", (req, res) => {
  res.render("register");
});
//Handeling User Sign Up
router.post('/register', (req,res) => {
    User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            return res.render('register');
        }
        passport.authenticate('local')(req,res,() => {
            res.redirect('/secret');
        });
    });
});

//Showing LogIn Page
router.get('/login', (req,res) => {
    res.render('login');
})

//LogIn Logic
router.post('/login', passport.authenticate('local',{
    successRedirect: '/secret',
    failureRedirect: '/login'
}), (req,res) => {

});

//Showing LogOut Page
router.get('/logout', (req,res) => {
    req.logout();
    res.redirect("/");
})

//check isLoggedIn
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}





//Sign-up
/*router.get('/register', (req,res) => {
    res.render('register');
})

router.post(
  "/",
  [
    check("username").isLength({ min: 1 }).withMessage("Please enter your username"),
    check("password").isLength({ min: 1 }).withMessage("Please enter your password"),
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
          res.render("secret", { title: "Blog" });
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
*/


module.exports = router;