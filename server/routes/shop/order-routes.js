const express = require('express');
const router = express.Router();
const { createOrder, capturePayment, getAllOrdersByUser, getOrderDetails } = require('../../controllers/shop/order-controller');

router.post('/create', createOrder);
router.post('/capture', capturePayment);
router.get('/user/:userId/orders', getAllOrdersByUser);
router.get('/:id', getOrderDetails);

module.exports = router;
