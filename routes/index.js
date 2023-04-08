const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const router = express.Router();

//ROUTES
//Home Page
router.get('/', (req,res) => {
    res.render('index', { title:'Home Page' });
});

//Sign-up
router.get('/register', (req,res) => {
    res.render('register', { title: 'Register/Sigin-in' });
});
router.post('/register', async (req,res) => {
    const user= await user.create({
        username: req.body.username,
        password: req.body.password
    });
    return res.status(200).json(user);
});

//Log-in
router.get('/login', (req,res) => {
    res.render('login');
});
router.post('/login', async (req,res) => {
    try {
      //check if user exists
      const user = await user.findOne({ username: req.body.username });
      if (user) {
        //check if password matches
        const result = req.body.password === user.password;
        if (result) {
          res.render("secret");
        } else {
          res.status(400).json({ error: "password doesn't match" });
        }
      } else {
        res.status(400).json({ error: "User doesn't exist" });
      }
    } catch (error) {
      res.status(400).json({ error });
    }
});

//Log-out
router.get('/logout', (req,res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

//Check if user is authenticated
isLoggedIn = (req,res,next)=> {
    if (req.isauthenticated()) return next();
    res.redirect('/login');
}


module.exports = router;