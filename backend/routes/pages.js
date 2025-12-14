const express = require('express');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/role');
const pageController = require('../controller/pageController');

const router = express.Router();

/* CREATE PAGE */
router.post('/', auth, requireRole(['editor', 'admin']), pageController.createPage);

/* LIST PAGES */
router.get('/space/:spaceId', auth, pageController.listPages);

/* GET PAGE */
router.get('/:id', auth, pageController.getPage);

/* UPDATE PAGE */
router.put('/:id', auth, requireRole(['editor', 'admin']), pageController.updatePage);

/* VERSIONS */
router.get('/:id/versions', auth, pageController.listVersions);

/* REVERT */
router.post('/:id/revert', auth, requireRole(['editor', 'admin']), pageController.revertPage);

/* DELETE PAGE */
router.delete('/:id', auth, requireRole('admin'), pageController.deletePage);

module.exports = router;
