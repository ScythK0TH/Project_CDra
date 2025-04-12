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

  async (req, res, next) => {
    // Ensure req.body is always an object to avoid crashes
    req.body = req.body || {};

    // Log validation errors for debugging
    console.log('Validation errors:', validationResult(req).array());

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('users/form', {
        errors: errors.array(),
        oldInput: {
          username: req.body.username || '',
          email: req.body.email || '',
        },
      });
    }

    // ตรวจสอบว่า username/email ถูกใช้ไปหรือยัง
    try {
      const usernameExists = await UserModel.findByUsername(req.body.username);
      const emailExists = await UserModel.findByEmail(req.body.email);

      if (usernameExists.rowLength > 0) {
        return res.render('users/form', {
          errors: [{ msg: 'Username already exists' }],
          oldInput: {
            username: req.body.username || '',
            email: req.body.email || '',
          },
        });
      }

      if (emailExists.rowLength > 0) {
        return res.render('users/form', {
          errors: [{ msg: 'Email already exists' }],
          oldInput: {
            username: req.body.username || '',
            email: req.body.email || '',
          },
        });
      }
    } catch (err) {
    //   console.error('Error checking username/email existence:', err.message);
      return res.status(500).send('Internal Server Error');
    }

    next();
  },
];

module.exports = validateUser;
