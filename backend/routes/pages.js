// routes/pages.js
const express = require('express');
const router = express.Router();
const Page = require('../models/Page');
const authMiddleware = require('../middleware/auth');

// Create page
router.post('/', authMiddleware, async (req, res) => {
  const { title, content, space, parent } = req.body;
  try {
    const page = new Page({ title, content, space, parent, createdBy: req.user.id });
    await page.save();
    res.json(page);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Get page
router.get('/:id', authMiddleware, async (req, res) => {
  const page = await Page.findById(req.params.id)
    .populate('createdBy', 'name')
    .populate('space', 'title')
    .populate('parent', 'title');
  res.json(page);
});

// Update page (with versioning)
router.put('/:id', authMiddleware, async (req, res) => {
  const { content } = req.body;
  const page = await Page.findById(req.params.id);
  // push old content to versions
  page.versions.push({ content: page.content, editedBy: req.user.id });
  page.content = content;
  page.updatedAt = Date.now();
  await page.save();
  res.json(page);
});

// Delete page
router.delete('/:id', authMiddleware, async (req, res) => {
  await Page.findByIdAndDelete(req.params.id);
  res.json({ message: 'Page deleted' });
});

// Search & list with pagination
router.get('/space/:spaceId', authMiddleware, async (req, res) => {
  const { page = 1, limit = 10, query = '' } = req.query;
  const skip = (page - 1) * limit;
  const pages = await Page.find({
    space: req.params.spaceId,
    title: { $regex: query, $options: 'i' }
  }).skip(skip).limit(parseInt(limit));
  res.json(pages);
});

module.exports = router;
