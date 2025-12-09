const express = require('express');
const Page = require('../models/Page');
const Space = require('../models/Space');
const auth = require('../middleware/auth');
const slugify = require('slugify');
const router = express.Router();

// Create page
router.post('/', auth, async (req, res) => {
  const { title, space, parent, contentDelta, contentHtml, tags } = req.body;
  try {
    const slug = slugify(title, { lower: true, strict: true });
    const page = new Page({
      title, slug, space, parent: parent || null,
      contentDelta, contentHtml, tags: tags || [],
      createdBy: req.user.id
    });
    await page.save();
    res.json(page);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get a page by id
router.get('/:id', auth, async (req, res) => {
  try {
    const page = await Page.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('parent', 'title');
    if (!page) return res.status(404).json({ msg: 'Page not found' });
    res.json(page);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update page (saves previous content into versions)
router.put('/:id', auth, async (req, res) => {
  const { title, contentDelta, contentHtml, tags, parent } = req.body;
  try {
    const page = await Page.findById(req.params.id);
    if (!page) return res.status(404).json({ msg: 'Page not found' });

    // push current content to versions
    page.versions.push({
      contentDelta: page.contentDelta,
      contentHtml: page.contentHtml,
      editedBy: req.user.id,
      editedAt: new Date()
    });

    page.title = title ?? page.title;
    page.slug = slugify(page.title, { lower: true, strict: true });
    page.contentDelta = contentDelta ?? page.contentDelta;
    page.contentHtml = contentHtml ?? page.contentHtml;
    page.tags = tags ?? page.tags;
    page.parent = parent ?? page.parent;
    page.updatedAt = new Date();

    await page.save();
    res.json(page);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete page
router.delete('/:id', auth, async (req, res) => {
  try {
    await Page.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get versions
router.get('/:id/versions', auth, async (req, res) => {
  try {
    const page = await Page.findById(req.params.id).populate('versions.editedBy', 'name email');
    if (!page) return res.status(404).json({ msg: 'Page not found' });
    res.json(page.versions);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Revert to a version (by version index)
router.post('/:id/revert', auth, async (req, res) => {
  // body: { versionIndex: number }
  const { versionIndex } = req.body;
  try {
    const page = await Page.findById(req.params.id);
    if (!page) return res.status(404).json({ msg: 'Page not found' });
    const ver = page.versions[versionIndex];
    if (!ver) return res.status(400).json({ msg: 'Version not found' });

    // push current to versions
    page.versions.push({
      contentDelta: page.contentDelta,
      contentHtml: page.contentHtml,
      editedBy: req.user.id,
      editedAt: new Date()
    });

    page.contentDelta = ver.contentDelta;
    page.contentHtml = ver.contentHtml;
    page.updatedAt = new Date();

    await page.save();
    res.json(page);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// List pages by space (tree-friendly)
router.get('/space/:spaceId', auth, async (req, res) => {
  try {
    const pages = await Page.find({ space: req.params.spaceId }).sort({ createdAt: 1 });
    res.json(pages);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Search
router.get('/', auth, async (req, res) => {
  const { q, space } = req.query;
  try {
    let filter = {};
    if (space) filter.space = space;
    if (q) {
      filter.$text = { $search: q };
    }
    const pages = await Page.find(filter).limit(200).sort({ updatedAt: -1 });
    res.json(pages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
