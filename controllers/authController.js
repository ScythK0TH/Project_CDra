const UserModel = require('../models/userModel');
const bcrypt = require('bcrypt');

const authController = {
    login: async (req, res) => {
        const { username, password } = req.body;
        console.log('Login attempt with username:', username);
    
        try {
            const user = await UserModel.getUserByUsername(username);
            if (user.length > 0) {
                const isPasswordValid = await bcrypt.compare(password, user[0].password);
                if (isPasswordValid) {
                    req.session.user = user[0]; // Store user info in session
                    console.log('Login successful for user:', username);
                    return res.redirect('/'); // Redirect to home page or dashboard
                } else {
                    console.log('Invalid password for user:', username);
                    return res.render('auth/login', { errors: [{ msg: 'Invalid password' }] });
                }
            } else {
                console.log('User not found:', username);
                return res.render('auth/login', { errors: [{ msg: 'User not found' }] });
            }
        } catch (err) {
            console.error('Error during login:', err.message);
            res.status(500).send('Internal Server Error');
        }
    },
}

module.exports = authController;