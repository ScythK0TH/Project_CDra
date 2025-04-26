const UserModel = require('../models/userModel');

const UsersController = {
  createUser: async (req, res) => {
    const { username, email, password, role_id } = req.body;

    try {
      await UserModel.create(username, email, password, role_id);
      res.redirect('/users'); // หรือจะส่ง JSON ก็ได้
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  showCreateForm: async (req, res) => {
    try {
      const roles = (await UserModel.getRoles()).sort((a, b) => a.role_id - b.role_id);
      res.render('users/form', { roles });
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const users = await UserModel.findAll();
      // console.log('All Users:', users);
      res.render('users/list', { users });
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  getUserById: async (req, res) => {
    try {
      const user = await UserModel.findById(req.params.id);
      const user_role = await UserModel.getRolesById(user[0].role_id);

      if (user) {
        res.render('users/show', { user: user[0], user_role: user_role[0] });
      } else {
        res.status(404).send('User not found');
      }
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  getUserByIdForEdit: async (req, res) => {
    try {
      const user = await UserModel.findById(req.params.id);
      const roles = (await UserModel.getRoles()).sort((a, b) => a.role_id - b.role_id);

      if (user && user.length > 0) {
        res.render('users/edit', { user: user[0], roles });
      } else {
        res.status(404).send('User not found');
      }
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  updateUser: async (req, res) => {
    const { email, username, password, userid, role_id } = req.body;
    // console.log('Update User:', userid, username, email);
    try {
      if (password) {
        await UserModel.update(userid, email, username, password, role_id);
      } else {
        await UserModel.updateWithoutPassword(userid, email, username, role_id);
      }
      //res.json({ id: userid, username, email });
      res.redirect('/users'); // หรือจะส่ง JSON ก็ได้
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  deleteUser: async (req, res) => {
    try {
      await UserModel.delete(req.params.id);
      //res.json({ message: 'User deleted' });
      res.redirect('/users'); // หรือจะส่ง JSON ก็ได้
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = UsersController;
