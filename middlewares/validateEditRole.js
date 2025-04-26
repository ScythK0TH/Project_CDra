const { body, validationResult } = require('express-validator');
const UserModel = require('../models/userModel'); // Import UserModel

const validateEditRole = [
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
    // role object should be passed from controller for repopulation
    const role = req.role || {};
    if (!errors.isEmpty()) {
      return res.render('users/editrole', {
        errors: errors.array(),
        oldInput: req.body,
        role
      });
    }
    
    // check if role name already exists
    const roleExists = await UserModel.getRolesByName(req.body.role);
    if (roleExists.length > 0 && String(roleExists[0].role_id) !== String(req.body.role_id)) {
      return res.render('users/editrole', {
        errors: [{ msg: 'Role name already exists' }],
        oldInput: req.body,
        role: roleExists[0]
      });
    }
    // check if role id already exists
    const roleIdExists = await UserModel.getRolesById(req.body.role_id);
    if (roleIdExists.length > 0 && String(roleIdExists[0].role_id) !== String(req.body.role_id)) {
      return res.render('users/editrole', {
        errors: [{ msg: 'Role ID already exists' }],
        oldInput: req.body,
        role: roleIdExists[0]
      });
    }
    next();
  }
];

module.exports = validateEditRole;