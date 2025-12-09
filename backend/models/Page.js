const mongoose = require('mongoose');

const VersionSchema = new mongoose.Schema({
  contentDelta: { type: Object },  // Quill delta
  contentHtml: { type: String },
  editedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  editedAt: { type: Date, default: Date.now }
});

const PageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, index: true },
  space: { type: mongoose.Schema.Types.ObjectId, ref: 'Space' },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Page', default: null },
  contentDelta: { type: Object, default: {} },  // Quill delta
  contentHtml: { type: String, default: '' },
  tags: [{ type: String }],
  versions: [VersionSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Text index for search
PageSchema.index({ title: 'text', contentHtml: 'text', tags: 'text' });

module.exports = mongoose.model('Page', PageSchema);
