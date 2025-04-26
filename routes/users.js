const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/usersController');
const validateUser = require('../middlewares/validateUser');
const validateEditUser = require('../middlewares/validateEditUser');

// Middleware to parse request body
router.use(express.urlencoded({ extended: true }));

router.get('/', (req, res) => {
    res.redirect('/');
});

// Admin page
router.post('/', validateUser, UsersController.createUser);
router.get('/new', UsersController.showCreateForm);
router.get('/:id', UsersController.getUserById);
router.get('/edit/:id', UsersController.getUserByIdForEdit);
router.post('/edit/:id', validateEditUser, UsersController.updateUser);
router.post('/delete/:id', UsersController.deleteUser);

module.exports = router;
