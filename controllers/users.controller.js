const User = require('../models/user.model');

exports.getUsers = async (req, res) => {
  const users = await User.find().select('-password');
  res.render('users-list', { users, currentUserId: req.user.id });
};

exports.deleteUser = async (req, res) => {
  if (req.params.id === req.user.id) {
    return res.redirect('/users-list');
  }
  await User.findByIdAndDelete(req.params.id);
  res.redirect('/users-list');
};

exports.changeRole = async (req, res) => {
  if (req.params.id === req.user.id) {
    return res.redirect('/users-list');
  }
  const user = await User.findById(req.params.id).select('role');
  if (user) {
    await User.findByIdAndUpdate(req.params.id, { role: user.role === 'admin' ? 'user' : 'admin' });
  }
  res.redirect('/users-list');
};
