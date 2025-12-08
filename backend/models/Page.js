// models/Page.js
const mongoose = require('mongoose');

const PageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, default: '' }, // can store HTML or Delta
  space: { type: mongoose.Schema.Types.ObjectId, ref: 'Space' },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Page', default: null },
  versions: [{
    content: String,
    editedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    editedAt: { type: Date, default: Date.now }
  }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Page', PageSchema);
