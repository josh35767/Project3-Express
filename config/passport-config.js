const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

const UserModel = require('../models/user-model');

// Save the user's Id in the 'bowl' (session)
passport.serializeUser((userFromDb, next) => {
  next(null, userFromDb._id);
});

// Retrieve the user's info from the DB with the ID inside the bowl (session)
passport.deserializeUser((idFromBowl, next) => {

  UserModel.findById(
    idFromBowl,
    (err, userFromDb) => {
      if (err) {
        console.log(err);
        next(err);
        return;
      }
      next(null, userFromDb);
    }
  );
});

passport.use(new LocalStrategy(
  {
    usernameField: 'loginUsername', // sent through AJAX from Angular
    passwordField: 'loginPassword' // sent through AJAX from Angular
  },
  (theUsername, thePassword, next) => {
    UserModel.findOne(
      { username: theUsername },
      (err, userFromDb) => {
        if (err) {
          next(err);
          return;
        }

        if (!userFromDb) {
          next(null, false, { message: 'Incorrect Username' });
          return;
        }

        if (!bcrypt.compareSync(thePassword, userFromDb.encryptedPassword)) {
          next(null, false, {message: 'Incorrect Password'});
          return;
        }

        next(null, userFromDb);
      }
    ); // Close usermodel. find one
  }
));
