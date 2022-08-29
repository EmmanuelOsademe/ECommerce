const {authenticateUser, authorisePermission} = require('../middlewares/authentication');
const {createProduct, getAllProducts, getSingleProduct, updateProduct, deleteProduct, uploadImage, updateImage} = require('../controllers/product');

const router = require('express').Router();

router.post('/', [authenticateUser, authorisePermission("admin")], createProduct);
router.get('/', getAllProducts),
router.get('/:id', getSingleProduct);
router.patch('/:id', [authenticateUser, authorisePermission("admin")], updateProduct);
router.delete('/:id', [authenticateUser, authorisePermission("admin")], deleteProduct);
router.post('/uploadProductImage/:id', [authenticateUser, authorisePermission("admin")], uploadImage);
router.post('/updateProductImage/:id', [authenticateUser, authorisePermission("admin")], updateImage);

module.exports = router;