const {authenticateUser, authorisePermission} = require('../middlewares/authentication');
const {getAllUsers, updateUser, getSingleUser, showCurrentUser, deleteUser, updatePassword} = require('../controllers/user');

const router = require('express').Router();

router.route('/').get([authenticateUser, authorisePermission("admin")], getAllUsers);
router.patch('/', authenticateUser, updateUser);
router.patch('/updatePassword', authenticateUser, updatePassword)
router.get('/:id', authenticateUser, getSingleUser);
router.delete('/:id', authenticateUser, deleteUser);
router.get('/singleUser/showUser', authenticateUser, showCurrentUser);

module.exports = router;