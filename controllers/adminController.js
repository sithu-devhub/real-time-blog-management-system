const User = require('../models/User');
const Post = require('../models/Post');

// Show admin dashboard
const showAdminDashboard = (req, res) => {
  res.render('admin/admin_dashboard', {
    user: req.user,
    currentPage: 'admin_dashboard'
  });
};

// View all users
// const viewAllUsers = async (req, res) => {
//   try {
//     const users = await User.find().sort({ createdAt: -1 });
//     res.render('admin/users', {
//       users,
//       currentPage: 'admin_users_page',
//       user: req.user
//     });
//   } catch (err) {
//     console.error('Error loading users:', err);
//     res.status(500).render('errors/500');
//   }
// };

// View all users
const viewAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    if (req.accepts(['html', 'json']) === 'json') {
      // Send JSON response if client expects JSON
      return res.status(200).json({
        message: 'Users retrieved successfully',
        users: users.map(user => ({
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt
        }))
      });
    }

    // Otherwise, render HTML page
    res.render('admin/users', {
      users,
      currentPage: 'admin_users_page',
      user: req.user
    });
  } catch (err) {
    console.error('Error loading users:', err);

    if (req.accepts(['html', 'json']) === 'json') {
      return res.status(500).json({ error: 'Failed to load users' });
    }

    res.status(500).render('errors/500');
  }
};



// View all blog posts
// const viewAllPosts = async (req, res) => {
//   try {
//     const posts = await Post.find()
//       .populate('createdBy')
//       .sort({ createdAt: -1 });

//     res.render('admin/admin_posts', {
//       posts,
//       currentPage: 'admin_posts_page',
//       user: req.user
//     });
//   } catch (err) {
//     console.error('Error loading admin posts:', err);
//     res.status(500).render('errors/500');
//   }
// };
// View all blog posts
const viewAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('createdBy')
      .sort({ createdAt: -1 });

    if (req.accepts(['html', 'json']) === 'json') {
      return res.status(200).json({
        message: 'Posts retrieved successfully',
        posts: posts.map(post => ({
          id: post._id,
          title: post.title,
          content: post.content,
          tags: post.tags,
          createdBy: post.createdBy ? post.createdBy.name : 'Unknown',
          createdAt: post.createdAt
        }))
      });
    }

    res.render('admin/admin_posts', {
      posts,
      currentPage: 'admin_posts_page',
      user: req.user
    });
  } catch (err) {
    console.error('Error loading admin posts:', err);

    if (req.accepts(['html', 'json']) === 'json') {
      return res.status(500).json({ error: 'Failed to load posts' });
    }

    res.status(500).render('errors/500');
  }
};




// Delete a post (admin)
// const deletePostByAdmin = async (req, res) => {
//   try {
//     await Post.findByIdAndDelete(req.params.id);
//     req.flash('success_msg', 'Post deleted successfully');
//   } catch (err) {
//     console.error(err);
//     req.flash('error_msg', 'Failed to delete post');
//   }
//   res.redirect('/admin/posts');
// };
const deletePostByAdmin = async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);

    if (req.accepts(['html', 'json']) === 'json') {
      return res.status(200).json({ message: 'Post deleted successfully' });
    }

    req.flash('success_msg', 'Post deleted successfully');
    res.redirect('/admin/posts');
  } catch (err) {
    console.error(err);

    if (req.accepts(['html', 'json']) === 'json') {
      return res.status(500).json({ error: 'Failed to delete post' });
    }

    req.flash('error_msg', 'Failed to delete post');
    res.redirect('/admin/posts');
  }
};


module.exports = {
  showAdminDashboard,
  viewAllUsers,
  viewAllPosts,
  deletePostByAdmin
};
