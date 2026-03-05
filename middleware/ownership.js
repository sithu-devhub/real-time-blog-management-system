const Post = require('../models/Post');

// Middleware to load only the logged-in user's posts
const loadUserPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    res.locals.userPosts = posts; // store in locals
    next(); // pass control to route handler
  } catch (err) {
    console.error(err);

    if (req.accepts('json')) {
      return res.status(500).json({ error: 'Failed to retrieve your posts' });
    }

    req.flash('error_msg', 'Could not load your posts');
    res.redirect('/posts');
  }
};

// Middleware to verify post ownership
const checkPostOwnership = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      if (req.accepts('json')) return res.status(404).json({ error: 'Post not found' });
      req.flash('error_msg', 'Post not found');
      return res.redirect('/posts');
    }

    if (!req.user._id.equals(post.createdBy)) {
      if (req.accepts('json')) return res.status(403).json({ error: 'Not authorized to perform this action' });
      req.flash('error_msg', 'Not authorized');
      return res.redirect('/posts');
    }

    req.post = post; // attach post to request for use in route
    next();
  } catch (err) {
    console.error(err);
    if (req.accepts('json')) return res.status(500).json({ error: 'Server error while checking ownership' });
    req.flash('error_msg', 'Server error');
    res.redirect('/posts');
  }
};

module.exports = {
  loadUserPosts,
  checkPostOwnership
};
