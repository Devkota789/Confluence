const express = require('express');
const Space = require('../models/Space');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/role');
const Page = require('../models/Page');
const router =express.Router();



// Create page - editor or admin; must be member of the space unless admin
router.post('/', auth, requireRole('editor','admin'), async (req, res) => {
try {
const { title, content, space, parent } = req.body;
const sp = await Space.findById(space);
if (!sp) return res.status(404).json({ message: 'Space not found' });


if (req.user.role !== 'admin' && !sp.members.map(m => String(m)).includes(String(req.user.id))) {
return res.status(403).json({ message: 'You are not a member of this space' });
}


const page = new Page({ title, content, space, parent: parent || null, createdBy: req.user.id });
await page.save();
res.json(page);
} catch (err) { res.status(500).json({ message: err.message }); }
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


if (req.user.role !== 'admin' && !sp.members.map(m => String(m)).includes(String(req.user.id))) {
return res.status(403).json({ message: 'You are not a member of this space' });
}


// push old content to versions
page.versions.push({ content: page.content, editedBy: req.user.id });
page.content = req.body.content;
page.updatedAt = Date.now();
await page.save();
res.json(page);
} catch (err) { res.status(500).json({ message: err.message }); }
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

// List pages by space with optional search/pagination
router.get('/space/:spaceId', auth, async (req, res) => {
const { page = 1, limit = 20, query = '' } = req.query;
const skip = (page - 1) * limit;
const pages = await Page.find({ space: req.params.spaceId, title: { $regex: query, $options: 'i' } })
.skip(skip).limit(parseInt(limit)).sort({ updatedAt: -1 });
res.json(pages);
});


module.exports = router;