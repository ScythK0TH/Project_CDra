const { body, validationResult } = require('express-validator');
const UserModel = require('../models/userModel'); // Import UserModel

const validateUser = [
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
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .bail() // Stop further validation if this fails
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),

  body('cpassword')
    .trim()
    .notEmpty()
    .withMessage('Confirm Password is required')
    .bail() // Stop further validation if this fails
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),

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

    // Log validation errors for debugging
    // console.log('Validation errors:', validationResult(req).array());

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('users/form', {
        errors: errors.array(),
        oldInput: {
          username: req.body.username || '',
          email: req.body.email || '',
          password: req.body.password || '',
          cpassword: req.body.cpassword || '',
          role: req.body.role_id || '',
        },
        roles: roles,
      });
    }

    // ตรวจสอบว่า username/email ถูกใช้ไปหรือยัง
    try {
      const usernameExists = await UserModel.findByUsername(req.body.username);
      const emailExists = await UserModel.findByEmail(req.body.email);

      if (usernameExists.length > 0) {
        return res.render('users/form', {
          errors: [{ msg: 'Username already exists' }],
          oldInput: {
            username: req.body.username || '',
            email: req.body.email || '',
            password: req.body.password || '',
            cpassword: req.body.cpassword || '',
            role: req.body.role_id || '',
          },
          roles: roles,
        });
      }

      if (emailExists.length > 0) {
        return res.render('users/form', {
          errors: [{ msg: 'Email already exists' }],
          oldInput: {
            username: req.body.username || '',
            email: req.body.email || '',
            password: req.body.password || '',
            cpassword: req.body.cpassword || '',
            role: req.body.role_id || '',
          },
          roles: roles,
        });
      }
    } catch (err) {
    //   console.error('Error checking username/email existence:', err.message);
      return res.status(500).send('Internal Server Error');
    }

    // Check if the role exists
    try {
      const roleExists = await UserModel.getRolesById(req.body.role_id);
      console.log('Role exists:', roleExists);
      console.log('Role Length:', roleExists.length);
      
      if (roleExists.length === 0) {
        return res.render('users/form', {
          errors: [{ msg: 'Role does not exist' }],
          oldInput: {
            username: req.body.username || '',
            email: req.body.email || '',
            password: req.body.password || '',
            cpassword: req.body.cpassword || '',
            role: req.body.role_id || '',
          },
          roles: roles,
        });
      }
    } catch (err) {
      // console.error('Error checking role existence:', err.message);
      return res.status(500).send('Internal Server Error');
    }

    next();
  },
];

module.exports = validateUser;
