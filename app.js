// Load environment variables
require('dotenv').config();

// Core modules
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const methodOverride = require('method-override');
const csrf = require('csurf');
const connectDB = require('./db');

// Passport config
require('./config/passport')(passport);

// Express app instance
const app = express();

// Connect to MongoDB
connectDB();

// Middleware to parse URL-encoded bodies and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Method override middleware
app.use(methodOverride('_method'));

// Static files
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));


// Session middleware (required for csurf)
app.use(session({
  secret: 'your_secret',
  resave: false,
  saveUninitialized: false
}));


// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Flash messages
app.use(flash());

// CSRF protection only for HTML forms (not API requests)
const csrfProtection = csrf();


app.use((req, res, next) => {
  const isApiRequest = req.headers.accept && req.headers.accept.includes('application/json'); 
  const isHtmlForm = req.headers.accept && req.headers.accept.includes('text/html');
  const isSafeMethod = ['GET', 'HEAD', 'OPTIONS'].includes(req.method);

  // Skip CSRF for JSON API requests
  if (isApiRequest && !isHtmlForm) {
    return next();
  }
  
  // Otherwise, enforce CSRF
  return csrfProtection(req, res, next);
});


app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken?.() || ''; //Make csrfToken and other globals available to all views

  // Flash messages
  res.locals.success_msg = req.flash('success_msg')[0] || null;
  res.locals.error_msg = req.flash('error_msg')[0] || null;
  res.locals.error = req.flash('error')[0] || null;
  res.locals.error_msgs = req.flash('error_msgs') || []; // Display error messages in Create Post Page

  // User and form info
  res.locals.user = req.user || null;
  res.locals.email = req.flash('email')[0] || '';
  res.locals.name = req.flash('name')[0] || '';
  res.locals.formTitle = req.flash('formTitle')[0] || '';
  res.locals.formContent = req.flash('formContent')[0] || '';
  res.locals.formTags = req.flash('formTags')[0] || '';

  next();
});

// View engine setup
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Routes
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');

app.use('/', authRoutes);
app.use('/posts', postRoutes);

// Home route
app.get('/', (req, res) => {
  res.render('index', { posts: [], isIndex: true, currentPage: 'index', user: req.user });
});

// Admin Routes
const adminRoutes = require('./routes/adminRoutes');
app.use('/admin', adminRoutes);

// Log all incoming requests to help debug
app.use((req, res, next) => {
  // console.log('--- Incoming Request ---');
  // console.log('Method:', req.method);
  // console.log('URL:', req.originalUrl);
  // console.log('Body:', req.body);
  // console.log('Query:', req.query);
  next();
});


// Example error-generating route
app.get('/error-test', (req, res) => {
  throw new Error('Intentional test error'); // This should trigger your 500 error handler
});

// 404 Error - Not Found
app.use((req, res) => {
  res.status(404).render('errors/404');
});

// 500 Error - Server Error
app.use((err, req, res, next) => {
  console.error('🔥 Internal Server Error:', err.stack);
  res.status(500).render('errors/500');
});



// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);
});
