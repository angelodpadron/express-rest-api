const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// db mapper
const Product = require('../models/product');

router.get('/', (req, res, next) => {
    Product.find()
        .select('name price _id')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + doc._id
                        }
                    }
                }
                )
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.post('/', (req, res, next) => {

    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });

    product.save().then(result => {
        res.status(200).json({
            message: 'Product created',
            createdProduct: {
                name: result.name,
                price: result.price,
                _id: result.id,
                requests: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + result._id
                }
            }
        });
    })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });


});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('name price _id')
        .exec()
        .then(doc => {
            if (doc) {
                const response = {
                    name: doc.name,
                    price: doc.price,
                    _id: doc.id,
                    requests: {
                        type: ['PATCH', 'DELETE', 'GET'],
                        url: 'http://localhost:3000/products/' + doc.id
                    }
                }
                res.status(200).json(response);
            } else {
                res.status(404).json({
                    message: `No product with the id of ${id} where found`
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findByIdAndUpdate(id, { $set: req.body }, { new: true })
        .then(result => {
            res.status(200).json({
                message: 'Product updated',
                requests: {
                    type: ['PATCH', 'DELETE', 'GET'],
                    url: 'http://localhost:3000/products/' + id
                },
                updated_product: {
                    name: result.name,
                    price: result.price
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.remove({ _id: id })
        .exec()
        .then(() => {
            res.status(200).json({
                message: 'Product deleted'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});





module.exports = router;