const mongoose = require('mongoose');
const { isValidObjectId } = mongoose;
const Post = require('../models/Post');
const getSearchFilter = require('../utils/searchFilter');
const Joi = require('joi');

// Joi validation schema
const postSchema = Joi.object({
  title: Joi.string().required().messages({
    'string.empty': 'Title is required',
    'string.max': 'Title must be 2000 characters or less'
  }),
  content: Joi.string().required().messages({
    'string.empty': 'Content is required',
    'string.max': 'Content must be 20000 characters or less'
  }),
  tags: Joi.string().allow('').optional().messages({
    'string.max': 'Tags must be under 2000 characters'
  })
});

// ========== Controller functions ==========

// GET /
const getAllPosts = async (req, res) => {
  try {
    const searchTerm = req.query.search || '';
    const filter = searchTerm ? getSearchFilter(searchTerm) : {};

    const posts = await Post.find(filter)
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
          createdBy: post.createdBy?.name || 'Anonymous',
          createdAt: post.createdAt
        }))
      });
    }

    res.render('posts', { posts, currentPage: 'posts', searchTerm, redirectTo: '/posts' });
  } catch (err) {
    console.error(err);
    if (req.is('application/json')) {
      return res.status(500).json({ error: 'Failed to retrieve posts' });
    }
    req.flash('error_msg', 'Could not load posts');
    res.render('posts', { posts: [], searchTerm: '', redirectTo: '/posts'});
  }
};

// GET /myposts
const getMyPosts = async (req, res) => {
  try {
    const searchTerm = req.query.search || '';
    const filter = searchTerm ? getSearchFilter(searchTerm, req.user._id) : { createdBy: req.user._id };

    const posts = await Post.find(filter).sort({ createdAt: -1 });

    if (req.accepts(['html', 'json']) === 'json') {
      return res.status(200).json({
        message: 'Your posts retrieved successfully',
        posts: posts.map(post => ({
          id: post._id,
          title: post.title,
          content: post.content,
          tags: post.tags,
          createdAt: post.createdAt
        }))
      });
    }

    req.session.tempFormTitle = null;
    req.session.tempFormContent = null;
    req.session.tempFormTags = null;

    res.render('my_posts', { posts, currentPage: 'myposts', searchTerm, redirectTo: '/posts/myposts' });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Could not load your posts');
    res.redirect('/posts');
  }
};

// GET /new
const showCreatePostForm = (req, res) => {
  const formTitle = req.session.tempFormTitle || '';
  const formContent = req.session.tempFormContent || '';
  const formTags = req.session.tempFormTags || '';

  req.session.tempFormTitle = null;
  req.session.tempFormContent = null;
  req.session.tempFormTags = null;

  res.render('create_post', {
    headingTitle: 'Create Blog Post',
    action: '/posts',
    post: {},
    currentPage: 'myposts',
    formTags,
    formTitle,
    formContent,
  });
};

// POST /
const createPost = async (req, res) => {
  try {
    const normalizedTitle = req.body.title.replace(/\r\n/g, '\n');
    const normalizedContent = req.body.content.replace(/\r\n/g, '\n');
    const normalizedTags = req.body.tags || '';

    req.session.tempFormTitle = normalizedTitle;
    req.session.tempFormContent = normalizedContent;
    req.session.tempFormTags = normalizedTags;

    if (normalizedTitle.length > 2000 || normalizedContent.length > 20000) {
      if (req.is('application/json')) {
        return res.status(400).json({ error: 'Title or Content exceeds allowed character limit.' });
      }
      req.flash('error_msg', 'Title or Content exceeds allowed character limit.');
      return res.redirect('/posts/new');
    }

    const { error } = postSchema.validate({
      title: normalizedTitle,
      content: normalizedContent,
      tags: normalizedTags
    }, { abortEarly: false });

    if (error) {
      const errorMessages = error.details.map(e => e.message);

      if (req.is('application/json')) {
        return res.status(400).json({ errors: errorMessages });
      }

      req.flash('error_msgs', errorMessages);
      return res.redirect('/posts/new');
    }

    const newPost = new Post({
      title: normalizedTitle,
      content: normalizedContent,
      tags: normalizedTags
        ? normalizedTags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        : [],
      createdBy: req.user._id
    });

    await newPost.save();

    delete req.session.tempFormTitle;
    delete req.session.tempFormContent;
    delete req.session.tempFormTags;

    if (req.is('application/json')) {
      return res.status(201).json({
        message: 'Post created successfully',
        post: {
          id: newPost._id,
          title: newPost.title,
          content: newPost.content,
          tags: newPost.tags,
          createdBy: req.user.name,
        }
      });
    }

    req.flash('success_msg', 'Post created successfully');
    res.redirect('/posts/myposts');
  } catch (err) {
    console.error(err);
    if (req.is('application/json')) {
      return res.status(500).json({ error: 'Failed to create post' });
    }
    req.flash('error_msg', 'Failed to create post');
    res.redirect('/posts/new');
  }
};

// GET /:id
const getPostById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      console.error('Invalid ObjectId format:', req.params.id);
      if (req.accepts(['html', 'json']) === 'json') {
        return res.status(404).json({ error: 'Invalid Post ID' });
      }
      return res.status(404).render('errors/404', { message: 'Invalid Post ID' });
    }

    const post = await Post.findById(req.params.id).populate('createdBy');

    if (!post) {
      if (req.accepts(['html', 'json']) === 'json') {
        return res.status(404).json({ error: 'Post not found' });
      }
      req.flash('error_msg', 'Post not found');
      return res.redirect('/posts');
    }

    if (req.accepts(['html', 'json']) === 'json') {
      return res.status(200).json({
        id: post._id,
        title: post.title,
        content: post.content,
        tags: post.tags,
        createdBy: post.createdBy?.name || 'Anonymous',
        createdAt: post.createdAt,
      });
    }

    const sourcePage = req.query.from === 'myposts' ? 'myposts' : 'posts';
    res.render('view_post', { post, user: req.user, currentPage: sourcePage });
  } catch (err) {
    console.error(err);
    if (req.accepts(['html', 'json']) === 'json') {
      return res.status(404).json({ error: 'Failed to load post' });
    }
    req.flash('error_msg', 'Error loading post');
  }
};

// GET /:id/edit
const showEditPostForm = async (req, res) => {
  try {
    const post = req.post;

    if (req.get('Accept') === 'application/json') {
      return res.status(200).json({
        message: 'Post ready for editing',
        post: {
          id: post._id,
          title: post.title,
          content: post.content,
          tags: post.tags,
        }
      });
    }

    const sourcePage = req.query.from === 'myposts' ? 'myposts' : 'posts';
    const redirectTo = req.query.redirectTo || '/posts/myposts';

    const formTitle = req.flash('formTitle')[0] || req.session.tempFormTitle || post.title;
    const formContent = req.flash('formContent')[0] || req.session.tempFormContent || post.content;
    const formTags = req.flash('formTags')[0] || req.session.tempFormTags || post.tags.join(' ');
    const tagListArray = formTags.trim().length ? formTags.split(/\s+/) : [];

    res.render('create_post', {
      headingTitle: 'Edit Post',
      action: `/posts/${post._id}?_method=PUT`,
      method: 'PUT',
      post,
      formTitle,
      formContent,
      formTags,
      tagListArray,
      redirectTo,
      currentPage: sourcePage
    });
  } catch (err) {
    console.error(err);
    if (req.get('Accept') === 'application/json') {
      return res.status(500).json({ error: 'Failed to load post for editing' });
    }
    req.flash('error_msg', 'Error loading post for editing');
    res.redirect('/posts/myposts');
  }
};

// PUT /:id
const updatePost = async (req, res) => {
  const { title, content, tags, redirectTo } = req.body;
  const backTo = redirectTo || '/posts/myposts';

  const { error } = postSchema.validate({ title, content, tags }, { abortEarly: false });

  req.session.tempFormTitle = title;
  req.session.tempFormContent = content;
  req.session.tempFormTags = tags ? tags.split(',').join(' ') : '';

  if (error) {
    const errorMessages = error.details.map(e => e.message);

    if (req.is('application/json')) {
      return res.status(400).json({ error: errorMessages });
    }

    req.flash('error_msgs', errorMessages);
    return res.redirect(`/posts/${req.params.id}/edit?from=myposts&redirectTo=${backTo}`);
  }

  try {
    const post = req.post;
    post.title = title;
    post.content = content;
    post.tags = tags ? tags.split(',').map(t => t.trim()) : [];

    await post.save();

    delete req.session.tempFormTitle;
    delete req.session.tempFormContent;
    delete req.session.tempFormTags;

    if (req.is('application/json')) {
      return res.status(200).json({ message: 'Post updated successfully', post });
    }

    req.flash('success_msg', 'Post updated successfully');
    return res.redirect(backTo);
  } catch (err) {
    console.error(err);
    if (req.is('application/json')) {
      return res.status(500).json({ error: 'Failed to update post' });
    }
    req.flash('error_msg', 'Failed to update post');
    res.redirect(backTo);
  }
};

// DELETE /:id
const deletePost = async (req, res) => {
  const backTo = (req.body && req.body.redirectTo) || '/posts/myposts';

  try {
    const post = req.post;
    await post.deleteOne();

    if (req.accepts('json', 'html') === 'json') {
      return res.status(200).json({ message: 'Post deleted successfully' });
    }

    req.flash('success_msg', 'Post deleted successfully');
    return res.redirect(backTo);
  } catch (err) {
    console.error(err);

    if (req.accepts('json', 'html') === 'json') {
      return res.status(500).json({ error: 'Failed to delete post' });
    }

    req.flash('error_msg', 'Something went wrong');
    return res.redirect('/errorpage');
  }
};

// Export all controller functions
module.exports = {
  getAllPosts,
  getMyPosts,
  showCreatePostForm,
  createPost,
  getPostById,
  showEditPostForm,
  updatePost,
  deletePost
};
