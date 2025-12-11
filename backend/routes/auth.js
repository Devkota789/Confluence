const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();


function createToken(user) {
const payload = { id: user._id, role: user.role };
return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });
}


// REGISTER
router.post('/register', async (req, res) => {
try {
const { name, email, password } = req.body;
if (!name || !email || !password) return res.status(400).json({ message: 'Name, email, password required' });
if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });


const existing = await User.findOne({ email });
if (existing) return res.status(400).json({ message: 'Email already registered' });


const salt = await bcrypt.genSalt(10);
const hashed = await bcrypt.hash(password, salt);
const user = new User({ name, email, password: hashed });
await user.save();
const token = createToken(user);
res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
} catch (err) {
console.error(err);
res.status(500).json({ message: 'Server error' });
}
});


// LOGIN
router.post('/login', async (req, res) => {
try {
const { email, password } = req.body;
if (!email || !password) return res.status(400).json({ message: 'Email and password required' });


const user = await User.findOne({ email });
if (!user) return res.status(401).json({ message: 'Invalid credentials' });


const match = await bcrypt.compare(password, user.password);
if (!match) return res.status(401).json({ message: 'Invalid credentials' });


const token = createToken(user);
res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
} catch (err) {
console.error(err);
res.status(500).json({ message: 'Server error' });
}
});


// GET current user
const auth = require('../middleware/auth');
router.get('/me', auth, async (req, res) => {
const u = await User.findById(req.user.id).select('-password');
res.json(u);
});


module.exports = router;