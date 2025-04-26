const { v4: uuidv4 } = require('uuid');
const client = require('../db');

const UserModel = {
  create: async (username, email) => {
    const userId = uuidv4();

    try {
      const query = `
                INSERT INTO user_profiles.users (user_id, username, email, created_at)
                VALUES (?, ?, ?, toTimestamp(now()));
            `;

      const params = [userId, username, email];

      await client.execute(query, params, { prepare: true });
      return { userId, username, email };
    } catch (err) {
      console.error('Error creating user:', err.message);
      throw err;
    }
  },

  findAll: () => {
    return client.execute('SELECT * FROM user_profiles.users');
  },

  findById: id => {
    return client.execute('SELECT * FROM user_profiles.users WHERE user_id = ?', [id], {
      prepare: true,
    });
  },

  findByUsername: username => {
    return client.execute(
      'SELECT username FROM user_profiles.users WHERE username = ?',
      [username],
      {
        prepare: true,
      }
    );
  },

  findByEmail: email => {
    return client.execute(
      'SELECT email FROM user_profiles.users WHERE email = ?',
      [email],
      {
        prepare: true,
      }
    );
  },

  update: async (userId, newEmail) => {
    try {
      const query = `
                UPDATE user_profiles.users
                SET email = ?
                WHERE user_id = ?;
            `;

      const params = [newEmail, userId];

      await client.execute(query, params, { prepare: true });

      return { userId, newEmail };
    } catch (err) {
      console.error('Failed to update email:', err.message);
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
};

module.exports = UserModel;
