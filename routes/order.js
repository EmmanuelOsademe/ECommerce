const {createOrder, getCurrentUserOrder, getSingleOrder, getAllOrders, updateOrder, getMonthlyIncome} = require('../controllers/order');
const {authenticateUser, authorisePermission} = require('../middlewares/authentication');
const router = require('express').Router();

router.post('/', authenticateUser, createOrder);
router.get('/user/order', authenticateUser, getCurrentUserOrder);
router.get('/:id', authenticateUser, getSingleOrder);
router.get('/', [authenticateUser, authorisePermission('admin')], getAllOrders);
router.patch('/:id', authenticateUser, updateOrder);
router.get('/order/income', [authenticateUser, authorisePermission('admin')], getMonthlyIncome)

module.exports = router;