const express = require('express');
const router = express.Router();

const { ensureAuthenticated } = require('../middleware/authMiddleware');
const { loadUserPosts, checkPostOwnership } = require('../middleware/ownership');
const {
  getAllPosts,
  getMyPosts,
  showCreatePostForm,
  createPost,
  getPostById,
  showEditPostForm,
  updatePost,
  deletePost
} = require('../controllers/postController');

// Display all posts (with optional search)
router.get('/', getAllPosts);

// Display My Posts Page (only user's posts)
router.get('/myposts', ensureAuthenticated, loadUserPosts, getMyPosts);

// Show Create Post Form
router.get('/new', ensureAuthenticated, showCreatePostForm);

// Create New Post
router.post('/', ensureAuthenticated, createPost);

// View Single Post
router.get('/:id', getPostById);

// Show Edit Post Form
router.get('/:id/edit', ensureAuthenticated, checkPostOwnership, showEditPostForm);

// Update Post
router.put('/:id', ensureAuthenticated, checkPostOwnership, updatePost);

// Delete Post
router.delete('/:id', ensureAuthenticated, checkPostOwnership, deletePost);

module.exports = router;
