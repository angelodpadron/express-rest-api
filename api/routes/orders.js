const express = require('express');
const router = express.Router();

// auth checker
const checkAut = require('../middleware/check-auth');

// controller
const OrderController = require('../controllers/orders');

// routes
router.get('/', checkAut, OrderController.orders_get_all);
router.post('/', checkAut, OrderController.orders_create_one);
router.get('/:orderId', checkAut, OrderController.orders_get_one);
router.delete('/:orderId', checkAut, OrderController.orders_delete_one);

module.exports = router;