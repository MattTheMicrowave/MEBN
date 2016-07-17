var express = require('express');
var router = express.Router();
var passport = require('passport');
var bcrypt = require('bcryptjs');
var UserModel = require('../models/UserModel');

/* GET home page. */
router.get('/', function(req, res, next) {
      // if(!req.isAuthenticated()) {
      //     res.redirect('/login');
      // } else {
            res.render('index', { title: 'Coding Skills',
            //when authenticated, all of our `req` in our routes will have the authenticated user attached
            // username: req.user.username
        });
      // }
});


router.get('/login', function(req, res, next) {
  if(req.isAuthenticated()) {
    res.redirect('/');
  } else {
    res.render('login');
  }
});

// Middleware is called such because it sits in the "middle" of the route and the callback
// In this case, `passport.authenticate('local')` is our middleware
router.post('/login', passport.authenticate('local'), function(req, res) {
  // If this function gets called, authentication was successful.
  // `req.user` contains the authenticated user.
  res.redirect('/'); //can only navigate to '/' if
});

router.get('/register', function(req, res, next) {
  if(req.isAuthenticated()) {
    res.redirect('/');
  } else {
    res.render('register');
  }
});

router.post('/register', function(req, res, next) {
  UserModel.findOne({ username : req.body.username.toLowerCase() }, function (err, user) {
    if (user) { // if the username is taken
      req.flash('error', 'The username has already been used');
      return res.redirect('/register');
    }

    if (req.body.password.length <= 5) {
      req.flash('error', 'Password must be at least 6 characters');
      return res.redirect('/register');
    }

    // the cost in processing the data. If hackers' computers get faster, we salt
    // it harder on a logarithmic scale, staying ahead
    var saltRounds = 10;
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {

      user = new UserModel({
        username: req.body.username.toLowerCase(),
        password: hash,
      });

      user.save(function (error, user) {

        if (error) {
          req.flash('error', error.message);
          res.redirect('/register');
        }

        req.login(user, function(err) {
          if (err) { return res.redirect('/register'); }

          // If the users has been created successfully, log them in with
          // passport to start their session and redirect to the '/' route
          return res.redirect('/');
        });
      });
    });
  });
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/login');
});

module.exports = router;
