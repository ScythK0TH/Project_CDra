const UserModel = require('../models/userModel');

const UsersController = {
  createUser: async (req, res) => {
    const { username, email } = req.body;

    try {
      await UserModel.create(username, email);
      res.redirect('/users'); // หรือจะส่ง JSON ก็ได้
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  showCreateForm: (req, res) => {
    res.render('users/form');
  },

  getAllUsers: async (req, res) => {
    try {
      const result = await UserModel.findAll();
      console.log('All Users:', result.rows);
      res.render('users/list', { users: result.rows });
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  getUserById: async (req, res) => {
    try {
      const result = await UserModel.findById(req.params.id);
      const user = result.rows[0];
      if (user) {
        res.render('users/show', { user });
      } else {
        res.status(404).send('User not found');
      }
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  getUserByIdForEdit: async (req, res) => {
    try {
      const result = await UserModel.findById(req.params.id);
      const user = result.rows[0];
      if (user) {
        res.render('users/edit', { user });
      } else {
        res.status(404).send('User not found');
      }
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  updateUser: async (req, res) => {
    const { email, userid } = req.body;
    // console.log('Update User:', userid, username, email);
    try {
      // ตรวจสอบว่า email ถูกใช้ไปหรือยัง
      const emailExists = await UserModel.findByEmail(email);
      if (emailExists.rowLength > 0) {
        return res.render('users/edit', {
          errors: [{ msg: 'Email already exists' }],
          oldInput: {
            email: req.body.email || '',
            userid: req.body.userid || '',
            username: req.body.username || ''
          },
        });
      }
      await UserModel.update(userid, email);
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
