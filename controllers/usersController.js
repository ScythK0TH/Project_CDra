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

  createRole: async (req, res) => {
    const { role, description } = req.body;
    try {
      await UserModel.createRole(role, description);
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

  showLoginForm: (req, res) => {
    res.render('auth/login', { errors: [] });
  },

  showAdminPage: async (req, res) => {
    try {
      const users = await UserModel.findAll();
      const roles = (await UserModel.getRoles()).sort((a, b) => a.role_id - b.role_id);
      // console.log('All Users:', users);
      res.render('index', { users, roles });
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  showRoleForm: async (req, res) => {
    try {
      const roles = (await UserModel.getRoles()).sort((a, b) => a.role_id - b.role_id);
      res.render('users/role', { roles });
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  showEditRoleForm: async (req, res) => {
    try {
      const role = await UserModel.getRolesById(req.params.id);
      const roles = (await UserModel.getRoles()).sort((a, b) => a.role_id - b.role_id);
      if (role && role.length > 0) {
        res.render('users/editRole', { role: role[0], roles });
      } else {
        res.status(404).send('Role not found');
      }
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  searchUser: async (req, res) => {
    const { search } = req.query;
    // console.log('Search query:', search);
    try {
      const users = await UserModel.findAll();
      const roles = (await UserModel.getRoles()).sort((a, b) => a.role_id - b.role_id);
      const filteredUsers = users.filter(user => user.username.includes(search) || user.email.includes(search));
      res.render('index', { users: filteredUsers, roles });
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  filterUserByRole: async (req, res) => {
    const { role_id } = req.query;
    // console.log('Filter by role ID:', role_id);
    try {
      const users = await UserModel.findAll();
      const roles = (await UserModel.getRoles()).sort((a, b) => a.role_id - b.role_id);
      if (!role_id) {
        return res.render('index', { users, roles, selectedRoleId: role_id });
      }
      const filteredUsers = users.filter(user => user.role_id === parseInt(role_id));
      res.render('index', { users: filteredUsers, roles, selectedRoleId: role_id });
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
        await UserModel.update(userid, username, password, email, role_id);
      } else {
        await UserModel.updateWithoutPassword(userid, email, username, role_id);
      }
      //res.json({ id: userid, username, email });
      res.redirect('/users'); // หรือจะส่ง JSON ก็ได้
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  updateRole: async (req, res) => {
    const { role_id, role, description } = req.body;
    // console.log('Update Role:', role_id, role);
    try {
      await UserModel.updateRole(role_id, role, description);
      //res.json({ id: role_id, role });
      res.redirect('/users'); // หรือจะส่ง JSON ก็ได้
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  deleteRole: async (req, res) => {
    try {
      await UserModel.deleteRole(req.params.id);
      //res.json({ message: 'Role deleted' });
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
