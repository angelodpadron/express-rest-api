const mongoose = require('mongoose');
const Product = require('../models/product');

exports.product_get_all = (req, res, next) => {
    Product.find()
        .select('name price productImage _id')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        productImage: doc.productImage,
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
}

exports.product_create_one = (req, res, next) => {

    console.log(req);

    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path.replace(/\\/g, '/')
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
}

exports.product_get_one = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('name price productImage _id')
        .exec()
        .then(doc => {
            if (doc) {
                const response = {
                    name: doc.name,
                    price: doc.price,
                    _id: doc.id,
                    productImage: doc.productImage,
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
}

exports.product_update_one = (req, res, next) => {
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
}

exports.product_delete_one = (req, res, next) => {
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
}