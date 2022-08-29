const {registerUser, loginUser, logoutUser} = require('../controllers/auth');

const router = require('express').Router();

router.route('/register').post(registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);

module.exports = router;