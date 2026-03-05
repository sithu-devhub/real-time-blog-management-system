const express = require('express');
const router = express.Router();
const isAdmin = require('../middleware/isAdmin');

const {
  showAdminDashboard,
  viewAllUsers,
  viewAllPosts,
  deletePostByAdmin
} = require('../controllers/adminController');

// Admin Dashboard
router.get('/', isAdmin, showAdminDashboard);

// View all users
router.get('/users', isAdmin, viewAllUsers);

// View all posts
router.get('/posts', isAdmin, viewAllPosts);

// Delete a post
router.delete('/posts/:id', isAdmin, deletePostByAdmin);

module.exports = router;
