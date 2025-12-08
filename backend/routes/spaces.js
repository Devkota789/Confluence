// routes/spaces.js
const express = require('express');
const router = express.Router();
const Space = require('../models/Space');
const authMiddleware = require('../middleware/auth');

// Create space
router.post('/', authMiddleware, async (req, res) => {
  const { title, description } = req.body;
  try {
    const space = new Space({ title, description, members: [req.user.id] });
    await space.save();
    res.json(space);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Get spaces (for logged-in user)
router.get('/', authMiddleware, async (req, res) => {
  const spaces = await Space.find({ members: req.user.id });
  res.json(spaces);
});

// Add a member
router.put('/:id/add-member', authMiddleware, async (req, res) => {
  const { userId } = req.body;
  const space = await Space.findById(req.params.id);
  if (!space.members.includes(userId)) {
    space.members.push(userId);
    await space.save();
  }
  res.json(space);
});

module.exports = router;
