const { body, validationResult } = require('express-validator');
const UserModel = require('../models/userModel'); // Import UserModel

const validateEditUser = [
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username is required')
        .bail() // Stop further validation if this fails
        .isLength({ min: 5 })
        .withMessage('Username must be at least 5 characters'),
    
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .bail() // Stop further validation if this fails
        .isEmail()
        .withMessage('Invalid email format'),
    
    body('role_id')
        .trim()
        .notEmpty()
        .withMessage('Role is required')
        .bail(), // Stop further validation if this fails
    
    async (req, res, next) => {
        // Ensure req.body is always an object to avoid crashes
        req.body = req.body || {};

        let roles = [];
        try {
            roles = (await UserModel.getRoles()).sort((a, b) => a.role_id - b.role_id);
        } catch (err) {
            // console.error('Error fetching roles:', err.message);
            return res.status(500).send('Internal Server Error');
        }

        // If email is already exists
        const emailExists = await UserModel.findByEmail(req.body.email);
        if (emailExists.length > 0 && emailExists[0].username !== req.body.username) {
            return res.render('users/edit', {
            errors: [{ msg: 'Email already exists' }],
            oldInput: {
                email: req.body.email || '',
                userid: req.body.userid || '',
                username: req.body.username || ''
            },
            roles: roles,
            });
        }

        // If username is already exists
        const usernameExists = await UserModel.findByUsername(req.body.username);
        if (usernameExists.length > 0 && usernameExists[0].email !== req.body.email) {
            return res.render('users/edit', {
            errors: [{ msg: 'Username already exists' }],
            oldInput: {
                email: req.body.email || '',
                userid: req.body.userid || '',
                username: req.body.username || ''
            },
            roles: roles,
            });
        }

        // Log validation errors for debugging
        // console.log('Validation errors:', validationResult(req).array());

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('users/edit', { user: req.body, roles, errors: errors.array() });
        }
        
        next();
    }
];

module.exports = validateEditUser;