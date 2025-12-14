const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const requireRole = require('../middleware/role');
const {
	createSpace,
	listSpaces,
	addMemberToSpace,
} = require('../controller/spaceController');


// Create space - ADMIN only
router.post('/', auth, requireRole('admin'), createSpace);


// List spaces - admin sees all, others see their memberships
router.get('/', auth, listSpaces);


// Add a member - admin only
router.put('/:id/add-member', auth, requireRole('admin'), addMemberToSpace);


module.exports = router;