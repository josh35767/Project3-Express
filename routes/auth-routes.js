const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');

const UserModel = require('../models/user-model');
const router = express.Router();

// POST signup
router.post('/api/signup', (req, res, next) => {
  if (!req.body.signupUsername || !req.body.signupPassword) {
    res.status(400).json ({ message: 'Need both username and password' });
    return;
  }

  UserModel.findOne(
    { username: req.body.signupUsername },
    (err, userFromDb) => {
      if(err){
        res.status(500).json({ message: 'Username check went bad'});
        return;
      }

      if(userFromDb) {
        res.status(400).json({ message: 'Username already exists'});
        return;
      }

      const salt = bcrypt.genSaltSync(10);
      const scrambledPassword = bcrypt.hashSync(req.body.signupPassword, salt);

      const theUser = new UserModel({
        username: req.body.signupUsername,
        encryptedPassword: scrambledPassword
      });

      theUser.save((err) => {
        if (err) {
          res.status(500).json({ message: 'User save went wrong'});
          return;
        }

        req.login(theUser, (err) => { //optional to automatically login, defined by passport.
          // Removes the encryptedPassword before sending
          theUser.encryptedPassword = undefined;

          // Sends the user's information to the frontend
          res.status(200).json(theUser);
        });
      });
    }
  );
});

// POST loginEmail -------------------
router.post('/api/login', (req, res, next) => {
  const authenticateFunction =
    passport.authenticate('local', (err, theUser, extraInfo) => {
      if (err) {
        res.status(500).json({ message: 'Unknown login error' });
        return;
      }

      // Login Failed
      if (!theUser) {
        // extra info contains feedback messages from local strategy
        res.status(401).json(extraInfo);
        return;
      }
      // Login Successful
      req.login(theUser, (err) => {
        if (err) {
          console.log(err);
          res.status(500).json({ message: ' Session save error '});
          return;
        }

        theUser.encryptedPassword = undefined;

        res.status(200).json(theUser);
      });
    });

  authenticateFunction(req, res, next);
});
// POST logout
router.post('/api/logout', (req, res, next) => {
  req.logout();
  res.status(200).json({ message: 'Log out sucessful.' });
});
// Get checklogin

router.get('/api/checklogin', (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ message: 'Nobody logged in' });
    return;
  }

  req.user.encryptedPassword = undefined;
  res.status(200).json(req.user);
});

module.exports = router;
