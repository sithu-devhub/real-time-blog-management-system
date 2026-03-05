const mongoose = require('mongoose');

// schema for blog posts
const postSchema = new mongoose.Schema({
  title: {type: String, required: true},
  content: {type: String, required: true},
  tags: {type: [String], default: []}, // Example tags in format ['nodejs', 'express']
  createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}, // Acts as the foreign key
  createdAt: {type: Date, default: Date.now} 
});

// Create and export the model
module.exports = mongoose.model('Post', postSchema);
