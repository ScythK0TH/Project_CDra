const { v4: uuidv4 } = require('uuid');
const client = require('../db');
const bcrypt = require('bcrypt');

const UserModel = {
  create: async (username, email, password, role_id) => {
    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const query = `
                INSERT INTO user_profiles.users (user_id, username, password, email, role_id, created_at)
                VALUES (?, ?, ?, ?, ?, toTimestamp(now()));
            `;

      const params = [userId, username, hashedPassword, email, role_id];

      await client.execute(query, params, { prepare: true });
      return { userId, username, hashedPassword, email, role_id };
    } catch (err) {
      console.error('Error creating user:', err.message);
      throw err;
    }
  },

  createRole: async (role, description, role_id) => {
    try {
      let newRoleId = null;

      // If role_id is provided, check if it already exists
      if (role_id) {
        const checkQuery = 'SELECT role_id FROM user_profiles.roles WHERE role_id = ?';
        const checkResult = await client.execute(checkQuery, [role_id], { prepare: true });
        if (checkResult.rows.length === 0) {
          newRoleId = role_id; // Not taken, use it
        }
      }

      // If not provided or already taken, auto-increment
      if (!newRoleId) {
        const getMaxIdQuery = 'SELECT MAX(role_id) as max_id FROM user_profiles.roles';
        const result = await client.execute(getMaxIdQuery);
        newRoleId = 1;
        if (result.rows.length > 0 && result.rows[0].max_id !== null) {
          newRoleId = result.rows[0].max_id + 1;
        }
      }

      const insertQuery = `
        INSERT INTO user_profiles.roles (role_id, role, description)
        VALUES (?, ?, ?)
      `;
      await client.execute(insertQuery, [newRoleId, role, description], { prepare: true });
      return { role_id: newRoleId, role, description };
    } catch (err) {
      console.error('Error creating role:', err.message);
      throw err;
    }
  },

  getRoles: async () => {
    try {
      const query = 'SELECT * FROM user_profiles.roles';
      const result = await client.execute(query);
      return result.rows;
    } catch (err) {
      console.error('Error fetching roles:', err.message);
      throw err;
    }
  },

  getRolesById: async roleId => {
    try {
      const query = 'SELECT * FROM user_profiles.roles WHERE role_id = ?';
      const result = await client.execute(query, [roleId], { prepare: true });
      return result.rows;
    } catch (err) {
      console.error('Error fetching role by ID:', err.message);
      throw err;
    }
  },

  getRolesByName: async roleName => {
    try {
      const query = 'SELECT * FROM user_profiles.roles WHERE role = ?';
      const result = await client.execute(query, [roleName], { prepare: true });
      return result.rows;
    } catch (err) {
      console.error('Error fetching role by name:', err.message);
      throw err;
    }
  },

  findAll: async () => {
    try {
      const result = await client.execute('SELECT * FROM user_profiles.users');
      return result.rows;
    } catch (err) {
      console.error('Error fetching all users:', err.message);
      throw err;
    }
  },

  findById: async id => {
    try {
      const result = await client.execute('SELECT * FROM user_profiles.users WHERE user_id = ?', [id], {
        prepare: true,
      });
      return result.rows;
    } catch (err) {
      console.error('Error fetching user by ID:', err.message);
      throw err;
    }
  },

  findByUsername: async username => {
    try {
      const result = await client.execute(
        'SELECT user_id, username FROM user_profiles.users WHERE username = ?',
        [username],
        {
          prepare: true,
        }
      );
      return result.rows;
    } catch (err) {
      console.error('Error fetching user by username:', err.message);
      throw err;
    }
  },

  findByEmail: async email => {
    try {
      const result = await client.execute(
        'SELECT user_id, email FROM user_profiles.users WHERE email = ?',
        [email],
        {
          prepare: true,
        }
      );
      return result.rows;
    } catch (err) {
      console.error('Error fetching user by email:', err.message);
      throw err;
    }
  },

  getUserByUsername: async username => {
    try {
      const result = await client.execute(
        'SELECT username, password FROM user_profiles.users WHERE username = ?',
        [username],
        {
          prepare: true,
        }
      );
      return result.rows;
    } catch (err) {
      console.error('Error fetching user by username:', err.message);
      throw err;
    }
  },

  update: async (userId, username, password, newEmail, role_id) => {
    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const query = `
                UPDATE user_profiles.users
                SET email = ?, role_id = ?, username = ?, password = ?
                WHERE user_id = ?;
            `;

      const params = [newEmail, role_id, username, hashedPassword, userId];

      await client.execute(query, params, { prepare: true });

      return { userId, newEmail, username, hashedPassword, role_id };
    } catch (err) {
      console.error('Failed to update:', err.message);
      throw err;
    }
  },

  updateRole: async (roleId, role, description) => {
    try {
      const query = `
                UPDATE user_profiles.roles
                SET role = ?, description = ?
                WHERE role_id = ?;
            `;

      const params = [role, description, roleId];

      await client.execute(query, params, { prepare: true });

      return { roleId, role, description };
    } catch (err) {
      console.error('Failed to update role:', err.message);
      throw err;
    }
  },

  updateWithoutPassword: async (userId, newEmail, username, role_id) => {
    try {
      const query = `
                UPDATE user_profiles.users
                SET email = ?, role_id = ?, username = ?
                WHERE user_id = ?;
            `;

      const params = [newEmail, role_id, username, userId];

      await client.execute(query, params, { prepare: true });

      return { userId, newEmail, username, role_id };
    } catch (err) {
      console.error('Failed to update without password:', err.message);
      throw err;
    }
  },

  delete: async userId => {
    try {
      const query = `
                DELETE FROM user_profiles.users
                WHERE user_id = ?;
            `;

      const params = [userId];

      await client.execute(query, params, { prepare: true });
      return { deleted: true };
    } catch (err) {
      console.error('Error deleting user:', err.message);
      throw err;
    }
  },

  deleteRole: async roleId => {
    try {
      const query = `
                DELETE FROM user_profiles.roles
                WHERE role_id = ?;
            `;

      const params = [roleId];

      await client.execute(query, params, { prepare: true });
      return { deleted: true };
    } catch (err) {
      console.error('Error deleting role:', err.message);
      throw err;
    }
  },
};

module.exports = UserModel;
