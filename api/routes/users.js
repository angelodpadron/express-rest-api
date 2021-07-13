const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const router = express.Router();

const User = require('../models/user');

router.post('/signup', (req, res, next) => {

    User.findOne({ email: req.body.email })
        .exec()
        .then(user => {
            if (user) {
                return res.status(409).json({
                    message: `${req.body.email} has already been taken`
                });
            }
            bcrypt.hash(req.body.password, 10, (err, hash) => {

                if (err) {
                    return res.status(500).json({ error: err })
                }

                const user = new User({
                    _id: new mongoose.Types.ObjectId(),
                    email: req.body.email,
                    password: hash
                });

                user
                    .save()
                    .then(result => {
                        console.log(result);
                        res.status(201).json({
                            message: 'User created',
                            details: result
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        })
                    });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err })
        });

});

router.delete('/:userId', (req, res, next) => {
    User.deleteOne({ _id: req.params.userId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'User deleted',
                details: result
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
})

module.exports = router;