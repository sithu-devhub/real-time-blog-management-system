const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/User');

module.exports = function (passport) {
  passport.use(new LocalStrategy(   
    { usernameField: 'email' }, // tell Passport to use 'email' instead of 'username'
    async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
      if (!user) return done(null, false, { message: 'User not found' });
      const isMatch = await bcrypt.compare(password, user.password);
      return isMatch ? done(null, user) : done(null, false, { message: 'Incorrect password' });
    } catch (err) {
      return done(err);
    }
  }));

  // Store the user's ID (which is in DB) in the session.
  passport.serializeUser((user, done) => {
    done(null, user.id); // store user ID in session
  });
  // This gives 
  // req.session = {
  //   passport: {
  //     user: "661f1c1234abc5678def" // stored ID
  //   }
  // }


  // Gets user id stored in session by serialUser, fetches full user from DB and sets it as req.user. This req.user is used by app.js, to make user available in all pug views.
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id); // async/await, no callback - (check for real DB user id) >> If same ID that was stored by serializeUser
      done(null, user); // attaches full user to req.user >> to be used in app.js (res.locals.user = req.user || null;)
    } catch (err) {
      done(err);
    }
  });
  

};
