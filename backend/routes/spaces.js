const express = require('express');
const router = express.Router();
const Space = require('../models/Space');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/role');


// Create space - ADMIN only
router.post('/', auth, requireRole('admin'), async (req, res) => {
try {
const { title, description } = req.body;
const space = new Space({ title, description, members: [req.user.id] });
await space.save();
res.json(space);
} catch (err) {
res.status(500).json({ error: err.message });
}
});


// List spaces - admin sees all, others see their memberships
router.get('/', auth, async (req, res) => {
if (req.user.role === 'admin') {
const spaces = await Space.find();
return res.json(spaces);
}
const spaces = await Space.find({ members: req.user.id });
res.json(spaces);
});


// Add a member - admin only
router.put('/:id/add-member', auth, requireRole('admin'), async (req, res) => {
const { userId } = req.body;
const space = await Space.findById(req.params.id);
if (!space) return res.status(404).json({ message: 'Space not found' });
if (!space.members.includes(userId)) {
space.members.push(userId);
await space.save();
}
res.json(space);
});


module.exports = router;