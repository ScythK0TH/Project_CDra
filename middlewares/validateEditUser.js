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

    body('password')
        .optional({ checkFalsy: true }) // Skip if empty or not present
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters'),
    
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
        if (emailExists.length > 0 && String(emailExists[0].user_id) !== String(req.body.userid)) {
            return res.render('users/edit', {
            errors: [{ msg: 'Email already exists' }],
            oldInput: {
                email: req.body.email || '',
                userid: req.body.userid || '',
                username: req.body.username || '',
                password: req.body.password || '',
                role_id: req.body.role_id || ''
            },
            roles: roles,
            actionUrl: `/users/edit/${req.body.userid}`,
            });
        }

        // If username is already exists
        const usernameExists = await UserModel.findByUsername(req.body.username);
        if (usernameExists.length > 0 && String(usernameExists[0].user_id) !== String(req.body.userid)) {
            return res.render('users/edit', {
            errors: [{ msg: 'Username already exists' }],
            oldInput: {
                email: req.body.email || '',
                userid: req.body.userid || '',
                username: req.body.username || '',
                password: req.body.password || '',
                role_id: req.body.role_id || ''
            },
            roles: roles,
            actionUrl: `/users/edit/${req.body.userid}`,
            });
        }

        // Check if the role exists
        try {
            const roleExists = await UserModel.getRolesById(req.body.role_id);
            console.log('Role exists:', roleExists);
            console.log('Role Length:', roleExists.length);
            
            if (roleExists.length === 0) {
            return res.render('users/edit', {
                errors: [{ msg: 'Role does not exist' }],
                oldInput: {
                    email: req.body.email || '',
                    userid: req.body.userid || '',
                    username: req.body.username || '',
                    password: req.body.password || '',
                    role_id: req.body.role_id || ''
                },
                roles: roles,
                actionUrl: `/users/edit/${req.body.userid}`,
            });
            }
        } catch (err) {
            // console.error('Error checking role existence:', err.message);
            return res.status(500).send('Internal Server Error');
        }


        // Log validation errors for debugging
        // console.log('Validation errors:', validationResult(req).array());

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('users/edit', { 
                oldInput: {
                    email: req.body.email || '',
                    userid: req.body.userid || '',
                    username: req.body.username || '',
                    password: req.body.password || '',
                    role_id: req.body.role_id || ''
                },
                roles: roles,
                errors: errors.array(),
                actionUrl: `/users/edit/${req.body.userid}`,
            });
        }
        
        next();
    }
];

module.exports = validateEditUser;