const Space = require('../models/Space');
const User = require('../models/User');

const isAdmin = (role) => role === 'admin' || role === 'superadmin';

exports.createSpace = async (req, res) => {
  try {
    const { title, description } = req.body;
    const collaborators = await User.find(
      { role: { $in: ['editor', 'viewer'] } },
      '_id'
    );

    const memberSet = new Set([req.user.id]);
    collaborators.forEach((user) => memberSet.add(String(user._id)));

    const space = await Space.create({
      title,
      description,
      members: Array.from(memberSet),
    });

    res.json(space);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listSpaces = async (req, res) => {
  try {
    if (isAdmin(req.user.role)) {
      const spaces = await Space.find();
      return res.json(spaces);
    }

    await Space.updateMany({}, { $addToSet: { members: req.user.id } });
    const spaces = await Space.find({ members: req.user.id });
    res.json(spaces);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addMemberToSpace = async (req, res) => {
  try {
    const { userId } = req.body;
    const space = await Space.findById(req.params.id);
    if (!space) return res.status(404).json({ message: 'Space not found' });

    if (!space.members.includes(userId)) {
      space.members.push(userId);
      await space.save();
    }

    res.json(space);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
