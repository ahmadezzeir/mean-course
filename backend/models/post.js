const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  title: {type: String, required: true},
  content: { type: String, required: true},
  imagePath: {type: String, required: true},
  createdBy: {type: mongoose.Schema.Types.ObjectId, ref:"User", required:true},
  created: {type: Date, required:true},

  updatedBy: {type: mongoose.Schema.Types.ObjectId, ref:"User",},
  updated: {type: Date, },
});

module.exports = mongoose.model('Post', postSchema);
