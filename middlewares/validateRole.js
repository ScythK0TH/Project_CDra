const { body, validationResult } = require('express-validator');
const UserModel = require('../models/userModel'); // Import UserModel

const validateRole = [
  body('role_id')
    .notEmpty().withMessage('Role ID is required')
    .bail()
    .isInt({ min: 1 }).withMessage('Role ID must be a number greater than or equal to 1'),

  body('role')
    .trim()
    .notEmpty().withMessage('Role Name is required'),

  body('description')
    .trim()
    .optional(),

  async (req, res, next) => {
    const errors = validationResult(req);
    let roles = [];
    try {
        roles = (await UserModel.getRoles()).sort((a, b) => a.role_id - b.role_id);
    } catch (err) {
        // console.error('Error fetching roles:', err.message);
        return res.status(500).send('Internal Server Error');
    }
    if (!errors.isEmpty()) {
      // Pass old input and errors back to the form
      // You may want to fetch roles if you use the reorder section
      return res.render('users/role', {
        errors: errors.array(),
        oldInput: req.body,
        roles: roles
      });
    }

    // check if role name already exists
    const roleExists = await UserModel.getRolesByName(req.body.role);
    if (roleExists.length > 0) {
      return res.render('users/role', {
        errors: [{ msg: 'Role name already exists' }],
        oldInput: req.body,
        roles: roles
      });
    }
    
    next();
  }
];

module.exports = validateRole;