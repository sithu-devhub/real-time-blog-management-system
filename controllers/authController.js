const passport = require('passport');
const User = require('../models/User');
const Joi = require('joi');

// Joi schemas
const registerSchema = Joi.object({
  name: Joi.string().max(100).required(),
  email: Joi.string().max(300).email().required(),
  password: Joi.string().max(50).min(6).required()
});

const loginSchema = Joi.object({
  email: Joi.string().max(300).email().required(),
  password: Joi.string().max(50).min(6).required()
});

// Show login page
const showLoginForm = (req, res) => {
  res.render('login', { currentPage: 'login', user: req.user });
};

// Show registration page
const showRegisterForm = (req, res) => {
  res.render('register', { currentPage: 'register', user: req.user });
};

// Handle login
const handleLogin = (req, res, next) => {
  const { email, password } = req.body;

  const { error } = loginSchema.validate({ email, password });
  if (error) {
    if (req.is('application/json')) {
      return res.status(400).json({ error: error.details[0].message });
    }
    req.flash('error_msg', error.details[0].message);
    req.flash('email', req.body.email);
    return res.redirect('/login');
  }

  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      if (req.is('application/json')) {
        return res.status(401).json({ error: info?.message || 'Login failed' });
      }
      req.flash('error_msg', info?.message || 'Login failed');
      req.flash('email', req.body.email);
      return res.redirect('/login');
    }

    req.logIn(user, (err) => {
      if (err) {
        if (req.is('application/json')) {
          return res.status(500).json({ error: 'Error logging in' });
        }
        return next(err);
      }

      if (req.is('application/json')) {
        return res.status(200).json({ message: 'Successfully logged in', user: { name: user.name, email: user.email } });
      }

      req.flash('success_msg', 'Successfully logged in');
      req.session.save(() => {
        if (user.isAdmin) {
          return res.redirect('/admin');
        }
        return res.redirect('/');
      });
    });
  })(req, res, next);
};

// Handle registration
const handleRegister = async (req, res) => {
  const { name, email, password } = req.body;

  const { error } = registerSchema.validate({ name, email, password });
  if (error) {
    if (req.is('application/json')) {
      return res.status(400).json({ error: error.details[0].message });
    }
    req.flash('error_msg', error.details[0].message);
    req.flash('name', req.body.name);
    req.flash('email', req.body.email);
    return res.redirect('/register');
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      if (req.is('application/json')) {
        return res.status(409).json({ error: 'This email is already registered. Please log in or use a different email.' });
      }
      req.flash('error_msg', 'This email is already registered. Please log in or use a different email.');
      req.flash('name', req.body.name);
      req.flash('email', req.body.email);
      return res.redirect('/register');
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    req.login(newUser, (err) => {
      if (err) throw err;

      if (req.is('application/json')) {
        return res.status(201).json({ message: 'Registered and logged in!', user: { name: newUser.name, email: newUser.email } });
      }

      req.flash('success_msg', 'Registered and logged in!');
      res.redirect('/');
    });
  } catch (err) {
    console.error(err);
    if (req.is('application/json')) {
      return res.status(500).json({ error: 'Internal server error during registration' });
    }
    req.flash('error_msg', 'Error during registration');
    res.redirect('/register');
  }
};

// Handle logout
const handleLogout = (req, res) => {
  req.logout(() => {
    req.flash('success_msg', 'You are logged out');
    res.redirect('/');
  });
};

module.exports = {
  showLoginForm,
  showRegisterForm,
  handleLogin,
  handleRegister,
  handleLogout
};
