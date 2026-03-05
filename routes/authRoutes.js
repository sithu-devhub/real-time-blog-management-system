const express = require('express');
const router = express.Router();
const {
  showLoginForm,
  showRegisterForm,
  handleLogin,
  handleRegister,
  handleLogout
} = require('../controllers/authController');

// Show login/register pages
router.get('/login', showLoginForm);
router.get('/register', showRegisterForm);

// Handle login/register
router.post('/login', handleLogin);
router.post('/register', handleRegister);

// Handle logout
router.get('/logout', handleLogout);

module.exports = router;
