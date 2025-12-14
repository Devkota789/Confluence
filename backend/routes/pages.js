const express = require('express');
const Page = require('../models/Page');
const Content = require('../models/Content');
const Space = require('../models/Space');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/role');

const router = express.Router();

/* CREATE PAGE */
router.post('/', auth, requireRole(['editor', 'admin']), async (req, res) => {
  try {
    const { title, content, space, parent } = req.body;

    const sp = await Space.findById(space);
    if (!sp) return res.status(404).json({ message: 'Space not found' });

    if (req.user.role !== 'admin' &&
        !sp.members.map(m => String(m)).includes(String(req.user.id))) {
      return res.status(403).json({ message: 'Not a space member' });
    }

    const page = await Page.create({
      title,
      space,
      parent: parent || null,
      createdBy: req.user.id,
      lastEditedBy: req.user.id
    });

    await Content.create({
      pageId: page._id,
      content,
      version: 1,
      isLatest: true,
      editedBy: req.user.id
    });

    res.json(page);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* LIST PAGES */
router.get('/space/:spaceId', auth, async (req, res) => {
  const pages = await Page.find({ space: req.params.spaceId })
    .sort({ updatedAt: -1 });
  res.json(pages);
});

/* GET PAGE */
router.get('/:id', auth, async (req, res) => {
  const page = await Page.findById(req.params.id)
    .populate('createdBy', 'name email');

  if (!page) return res.status(404).json({ message: 'Page not found' });

  const content = await Content.findOne({
    pageId: page._id,
    isLatest: true
  });

  res.json({ ...page.toObject(), content: content?.content || '' });
});

/* UPDATE PAGE */
router.put('/:id', auth, requireRole(['editor', 'admin']), async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) return res.status(404).json({ message: 'Page not found' });

    const space = await Space.findById(page.space);
    if (!space) return res.status(404).json({ message: 'Space not found' });

    // Guard: only members or admins can edit
    const isMember = space.members.map((m) => String(m)).includes(String(req.user.id));
    if (req.user.role !== 'admin' && !isMember) {
      return res.status(403).json({ message: 'Not a space member' });
    }

    const currentVersion = Number(page.currentVersion || 1);
    const newVersion = currentVersion + 1;

    await Content.updateMany({ pageId: page._id }, { $set: { isLatest: false } });

    await Content.create({
      pageId: page._id,
      content: req.body.content || '',
      version: newVersion,
      isLatest: true,
      editedBy: req.user.id,
    });

    if (req.body.title) page.title = req.body.title;
    if ('parent' in req.body) page.parent = req.body.parent || null;

    page.currentVersion = newVersion;
    page.totalVersions = Number(page.totalVersions || 1) + 1;
    page.lastEditedBy = req.user.id;
    page.updatedAt = Date.now();

    await page.save();
    res.json(page);
  } catch (err) {
    console.error('Page update failed', err);
    res.status(500).json({ message: err.message || 'Failed to update page' });
  }
});

/* VERSIONS */
router.get('/:id/versions', auth, async (req, res) => {
  const versions = await Content.find({ pageId: req.params.id })
    .sort({ version: -1 })
    .populate('editedBy', 'name email');

  res.json(versions);
});

/* REVERT */
router.post('/:id/revert', auth, requireRole(['editor', 'admin']), async (req, res) => {
  const { version } = req.body;

  const page = await Page.findById(req.params.id);
  const target = await Content.findOne({ pageId: page._id, version });

  if (!target) return res.status(404).json({ message: 'Version not found' });

  await Content.updateMany(
    { pageId: page._id },
    { $set: { isLatest: false } }
  );

  const newVersion = page.currentVersion + 1;

  await Content.create({
    pageId: page._id,
    content: target.content,
    version: Number.isFinite(newVersion) ? newVersion : 1,
    isLatest: true,
    editedBy: req.user.id
  });

  page.currentVersion = Number.isFinite(newVersion) ? newVersion : 1;
  page.totalVersions = Number(page.totalVersions || 1) + 1;
  page.lastEditedBy = req.user.id;
  page.updatedAt = Date.now();

  await page.save();
  res.json({ message: 'Reverted successfully' });
});

/* DELETE PAGE */
router.delete('/:id', auth, requireRole('admin'), async (req, res) => {
  await Content.deleteMany({ pageId: req.params.id });
  await Page.findByIdAndDelete(req.params.id);
  res.json({ message: 'Page deleted' });
});

module.exports = router;
