const express = require('express');
const Space = require('../models/Space');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/role');
const Page = require('../models/Page');
const router = express.Router();



// Create page - editor or admin; must be member of the space unless admin
router.post('/', auth, requireRole(['editor','admin']), async (req, res) => {
  try {
    const { title, content, space, parent } = req.body;
    const sp = await Space.findById(space);
    if (!sp) return res.status(404).json({ message: 'Space not found' });

    if (req.user.role !== 'admin' && !sp.members.map((m) => String(m)).includes(String(req.user.id))) {
      return res.status(403).json({ message: 'You are not a member of this space' });
    }

    const page = new Page({ title, content, space, parent: parent || null, createdBy: req.user.id });
    await page.save();
    res.json(page);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// List pages by space with optional search/pagination
router.get('/space/:spaceId', auth, async (req, res) => {
  const { page = 1, limit = 20, query = '' } = req.query;
  const skip = (page - 1) * limit;
  const pages = await Page.find({ space: req.params.spaceId, title: { $regex: query, $options: 'i' } })
    .skip(skip)
    .limit(parseInt(limit, 10))
    .sort({ updatedAt: -1 });
  res.json(pages);
});

// Page versions
router.get('/:id/versions', auth, async (req, res) => {
  try {
    const page = await Page.findById(req.params.id).populate('versions.editedBy', 'name email');
    if (!page) return res.status(404).json({ message: 'Page not found' });
    res.json(page.versions || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/:id/revert', auth, requireRole(['editor','admin']), async (req, res) => {
  try {
    const { versionIndex } = req.body;
    const page = await Page.findById(req.params.id);
    if (!page) return res.status(404).json({ message: 'Page not found' });

    const sp = await Space.findById(page.space);
    if (!sp) return res.status(404).json({ message: 'Space not found' });

    if (req.user.role !== 'admin' && !sp.members.map((m) => String(m)).includes(String(req.user.id))) {
      return res.status(403).json({ message: 'You are not a member of this space' });
    }

    if (versionIndex === undefined || versionIndex < 0 || versionIndex >= page.versions.length) {
      return res.status(400).json({ message: 'Invalid version selected' });
    }

    const targetVersion = page.versions[versionIndex];
    page.versions.push({ content: page.content, editedBy: req.user.id });
    page.content = targetVersion.content;
    page.updatedAt = Date.now();
    await page.save();

    res.json(page);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id/move', auth, requireRole(['editor','admin']), async (req, res) => {
  try {
    const { parent } = req.body;
    const page = await Page.findById(req.params.id);
    if (!page) return res.status(404).json({ message: 'Page not found' });

    const sp = await Space.findById(page.space);
    if (!sp) return res.status(404).json({ message: 'Space not found' });

    if (req.user.role !== 'admin' && !sp.members.map((m) => String(m)).includes(String(req.user.id))) {
      return res.status(403).json({ message: 'You are not a member of this space' });
    }

    let newParent = null;
    if (parent) {
      newParent = await Page.findById(parent);
      if (!newParent) return res.status(404).json({ message: 'Parent page not found' });
      if (String(newParent.space) !== String(page.space)) {
        return res.status(400).json({ message: 'Parent must belong to the same space' });
      }

      let cursor = newParent;
      while (cursor) {
        if (String(cursor._id) === String(page._id)) {
          return res.status(400).json({ message: 'Cannot move a page inside itself' });
        }
        if (!cursor.parent) break;
        cursor = await Page.findById(cursor.parent);
      }
    }

    page.parent = parent || null;
    await page.save();
    res.json(page);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get page
router.get('/:id', auth, async (req, res) => {
  const page = await Page.findById(req.params.id).populate('createdBy', 'name email');
  if (!page) return res.status(404).json({ message: 'Page not found' });
  res.json(page);
});

// Update page - editor or admin; must be member or admin
router.put('/:id', auth, requireRole(['editor','admin']), async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) return res.status(404).json({ message: 'Page not found' });

    const sp = await Space.findById(page.space);
    if (!sp) return res.status(404).json({ message: 'Space not found' });

    if (req.user.role !== 'admin' && !sp.members.map((m) => String(m)).includes(String(req.user.id))) {
      return res.status(403).json({ message: 'You are not a member of this space' });
    }

    // push old content to versions when content changes
    const shouldUpdateContent = typeof req.body.content === 'string';
    if (shouldUpdateContent && typeof page.content === 'string') {
      page.versions.push({ content: page.content, editedBy: req.user.id });
    }
    if (typeof req.body.title === 'string') {
      page.title = req.body.title;
    }
    if (Object.prototype.hasOwnProperty.call(req.body, 'parent')) {
      page.parent = req.body.parent || null;
    }
    if (shouldUpdateContent) {
      page.content = req.body.content;
    }
    page.updatedAt = Date.now();
    await page.save();
    res.json(page);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete page - admin only
router.delete('/:id', auth, requireRole('admin'), async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) return res.status(404).json({ message: 'Page not found' });

    await page.deleteOne();
    res.json({ message: 'Page deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;