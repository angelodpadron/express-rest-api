const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

const app = express();

const productRouter = require('./api/routes/products');
const orderRouter = require('./api/routes/orders');

// mongo db
mongoose.connect(
    'mongodb+srv://padron891:' +
    process.env.MONGO_ATLAS_PW +
    '@node-rest-shop.haj7x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

// middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Header', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

// routes
app.use('/products', productRouter);
app.use('/orders', orderRouter);

// error handling
app.use((req, res, next) => {
    const error = new Error('Resource not found');
    error.status = 404;
    next(error);
});
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;