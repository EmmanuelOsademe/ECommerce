const {createCart, getSingleCart, getAllCarts, updateCart, deleteCart} = require('../controllers/cart');
const {authenticateUser, authorisePermission} = require('../middlewares/authentication');

const router = require('express').Router();

router.post('/', authenticateUser, createCart);
router.get('/:id', authenticateUser, getSingleCart);
router.get('/', [authenticateUser, authorisePermission('admin')], getAllCarts);
router.patch('/:id', authenticateUser, updateCart);
router.delete('/:id', authenticateUser, deleteCart);

module.exports = router;