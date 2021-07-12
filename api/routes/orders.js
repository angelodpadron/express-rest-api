const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

router.get('/', (req, res, next) => {
    Order.find()
        .select('quantity product _id')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                    _id: doc.id,
                    product: doc.product,
                    quantity: doc.quantity,
                    requests:{
                        type: ['GET', 'DELETE'],
                        url: 'http://localhost:3000/orders/' + doc.id
                    }
                }            
                })
            });
        })
    .catch(err => res.status(500).json(err));
    
});

router.post('/', (req, res, next) => {
    Product.findById(req.body.productId)
        .then(product => {

            if (!product) {
                return res.status(404).json({
                    message: `No product with the id of ${req.body.productId} where found`
                })
            }

            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            });

            return order.save()
        })
        .then(result => {
            res.status(200).json({
                message: 'Order created',
                order: {
                    _id: result._id,
                    quantity: result.quantity,
                    product: result.product,
                    requests:{
                        type: ['GET', 'DELETE'],
                        url: 'http://localhost:3000/orders/' + result._id
                    }
               }
           })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    
});

router.get('/:orderId', (req, res, next) => {
    Order.findById(req.params.orderId)
        .select('_id product quantity')
        .exec()
        .then(doc => {

            if(!doc) {
                return res.status(404).json({
                    message: `Order with the id of ${req.params.orderId} where not found`
                })
            }

            res.status(200).json({
                _id: doc._id,
                product: doc.product,
                quantity: doc.quantity,
                requests:{
                    type: ['GET', 'DELETE'],
                    url: 'http://localhost:3000/orders/' + doc._id
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });

});

router.delete('/:orderId', (req, res, next) => {
    Order.remove({_id: req.params.orderId})
        .exec()
        .then(result => {

            if (!result.deletedCount){
                return res.status(404).json({
                    message: `Order with the id of ${req.params.orderId} where not found`
                });
            }

            res.status(200).json({
                message: 'Order deleted'
                });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});


module.exports = router;