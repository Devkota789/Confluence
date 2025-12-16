const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
  pageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Page',
    required: true
  },

  content: {
    type: String,
    default: '',
    required: false,
    trim: true,
  },

  version: {
    type: Number,
    required: true,
    immutable: true
  },

  isLatest: {
    type: Boolean,
    default: false,
    index: true
  },

  editedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  editedAt: {
    type: Date,
    default: Date.now
  }
});

/* Only one latest per page */
ContentSchema.index(
  { pageId: 1 },
  { unique: true, partialFilterExpression: { isLatest: true } }
);

module.exports = mongoose.model('Content', ContentSchema);
