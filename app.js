// Dependencies
require('dotenv').config();
require('express-async-errors');

// Express app
const express = require('express');
const app = express();

// DB
const connectDB = require('./db/connect');

// Rest of the packages
const cookieParser = require('cookie-parser');

const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const productRouter = require('./routes/product');
const cartRouter = require('./routes/cart');
const orderRouter = require('./routes/order');
const reviewRouter = require('./routes/review');
const {errorHandler} = require('./middlewares/errorHandler');

// Middlewares
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/product', productRouter);
app.use('/api/v1/cart', cartRouter);
app.use('/api/v1/order', orderRouter);
app.use('/api/v1/review', reviewRouter);

app.use(errorHandler);

const port = process.env.PORT || 4000;

const start = async () =>{
    try {
        await connectDB(process.env.MONGO_URI);
        console.log(`Database is up and running`);
        app.listen(port, ()=>{
            console.log(`Backend server is listening on Port: ${port}`);
        })
    } catch (error) {
        console.log(`Error starting database: ${error}`);
    }
};

start();