const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/usersController');
const validateUser = require('../middlewares/validateUser');

// Middleware to parse request body
router.use(express.urlencoded({ extended: true }));

router.get('/new', UsersController.showCreateForm);

router.post('/', validateUser, UsersController.createUser);
router.get('/', UsersController.getAllUsers);
router.get('/:id', UsersController.getUserById);
router.get('/edit/:id', UsersController.getUserByIdForEdit);
router.post('/edit', UsersController.updateUser);
router.post('/delete/:id', UsersController.deleteUser);

module.exports = router;
