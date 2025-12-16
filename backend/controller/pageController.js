const Page = require('../models/Page');
const Content = require('../models/Content');
const Space = require('../models/Space');

const isAdmin = (role) => role === 'admin' || role === 'superadmin';
const isMember = (space, userId) =>
  space.members.map((m) => String(m)).includes(String(userId));

exports.createPage = async (req, res) => {
  try {
    const { title, content, space, parent } = req.body;

    const sp = await Space.findById(space);
    if (!sp) return res.status(404).json({ message: 'Space not found' });

    if (!isAdmin(req.user.role) && !isMember(sp, req.user.id)) {
      return res.status(403).json({ message: 'Not a space member' });
    }

    const page = await Page.create({
      title,
      space,
      parent: parent || null,
      createdBy: req.user.id,
      lastEditedBy: req.user.id,
    });

    await Content.create({
      pageId: page._id,
      content,
      version: 1,
      isLatest: true,
      editedBy: req.user.id,
    });

    res.json(page);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.listPages = async (req, res) => {
  try {
    const pages = await Page.find({ space: req.params.spaceId }).sort({ updatedAt: -1 });
    res.json(pages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPage = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id).populate('createdBy', 'name email');
    if (!page) return res.status(404).json({ message: 'Page not found' });

    const content = await Content.findOne({ pageId: page._id, isLatest: true });

    res.json({ ...page.toObject(), content: content?.content || '' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updatePage = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) return res.status(404).json({ message: 'Page not found' });

    const space = await Space.findById(page.space);
    if (!space) return res.status(404).json({ message: 'Space not found' });

    if (!isAdmin(req.user.role) && !isMember(space, req.user.id)) {
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
    res.status(500).json({ message: err.message || 'Failed to update page' });
  }
};

exports.listVersions = async (req, res) => {
  try {
    const versions = await Content.find({ pageId: req.params.id })
      .sort({ version: -1 })
      .populate('editedBy', 'name email');

    res.json(versions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.revertPage = async (req, res) => {
  try {
    const { version } = req.body;
    const page = await Page.findById(req.params.id);
    if (!page) return res.status(404).json({ message: 'Page not found' });

    const target = await Content.findOne({ pageId: page._id, version });
    if (!target) return res.status(404).json({ message: 'Version not found' });

    await Content.updateMany({ pageId: page._id }, { $set: { isLatest: false } });

    const newVersion = Number(page.currentVersion || 1) + 1;

    await Content.create({
      pageId: page._id,
      content: target.content,
      version: newVersion,
      isLatest: true,
      editedBy: req.user.id,
    });

    page.currentVersion = newVersion;
    page.totalVersions = Number(page.totalVersions || 1) + 1;
    page.lastEditedBy = req.user.id;
    page.updatedAt = Date.now();

    await page.save();
    res.json({ message: 'Reverted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.deletePage = async (req, res) => {
  try {
    await Content.deleteMany({ pageId: req.params.id });
    await Page.findByIdAndDelete(req.params.id);
    res.json({ message: 'Page deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
