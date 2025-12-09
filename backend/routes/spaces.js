const express = require('express');
const Space = require('../models/Space');
const auth = require('../middleware/auth');
const router = express.Router();

// Create space
router.post('/', auth, async (req, res) => {
  const { title, description } = req.body;
  try {
    const space = new Space({
      title, description, createdBy: req.user.id
    });
    await space.save();
    res.json(space);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// List spaces
router.get('/', auth, async (req, res) => {
  try {
    const spaces = await Space.find().sort({ createdAt: -1 });
    res.json(spaces);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
