const mongoose = require('mongoose');

const SpaceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Space', SpaceSchema);
