const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/usersController');
const validateUser = require('../middlewares/validateUser');
const validateEditUser = require('../middlewares/validateEditUser');
const validateEditRole = require('../middlewares/validateEditRole');
const validateRole = require('../middlewares/validateRole');

// Middleware to parse request body
router.use(express.urlencoded({ extended: true }));

router.get('/', (req, res) => {
    res.redirect('/');
});

// Admin page
router.get('/new', UsersController.showCreateForm);
router.get('/search', UsersController.searchUser);
router.get('/filter', UsersController.filterUserByRole);
router.get('/roles', UsersController.showRoleForm);
router.get('/roles/edit/:id', UsersController.showEditRoleForm);
router.get('/:id', UsersController.getUserById);
router.get('/edit/:id', UsersController.getUserByIdForEdit);
router.post('/', validateUser, UsersController.createUser);
router.post('/roles', validateRole, UsersController.createRole);
router.post('/roles/edit', validateEditRole, UsersController.updateRole);
router.post('/roles/delete/:id', UsersController.deleteRole);
router.post('/edit/:id', validateEditUser, UsersController.updateUser);
router.post('/delete/:id', UsersController.deleteUser);

module.exports = router;
