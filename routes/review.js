const {createReview, updateReview, getAllReviews, getSingleReview, deleteReview} = require('../controllers/review');
const {authenticateUser, authorisePermission} = require('../middlewares/authentication');

const router = require('express').Router();

router.post('/', authenticateUser, createReview);
router.patch('/:id', authenticateUser, updateReview);
router.get('/', [authenticateUser, authorisePermission('admin')], getAllReviews);
router.get('/:id', authenticateUser, getSingleReview);
router.delete('/:id', authenticateUser, deleteReview);

module.exports = router;