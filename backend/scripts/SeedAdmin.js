require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');


async function seed() {
await mongoose.connect(process.env.MONGO_URI);
const email = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
const existing = await User.findOne({ email });
if (existing) {
console.log('Admin exists:', email);
process.exit(0);
}
const hashed = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD || 'AdminPass123!', 10);
const admin = new User({ name: 'Super Admin', email, password: hashed, role: 'superadmin' });
await admin.save();
console.log('Admin created:', admin.email);
process.exit(0);
}


seed().catch(err => { console.error(err); process.exit(1); });