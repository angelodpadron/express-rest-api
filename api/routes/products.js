const express = require('express');
const router = express.Router();
const checkAut = require('../middleware/check-auth');
const upload = require('../middleware/upload')

// controller
const ProductController = require('../controllers/products');

// routes
router.get('/', ProductController.product_get_all);
router.post('/', checkAut, upload.single('productImage'), ProductController.product_create_one);
router.get('/:productId', ProductController.product_get_one);
router.patch('/:productId', checkAut, ProductController.product_update_one);
router.delete('/:productId', checkAut, ProductController.product_delete_one);

module.exports = router;