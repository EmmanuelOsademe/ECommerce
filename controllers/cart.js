const {StatusCodes} = require('http-status-codes');
const Cart = require('../models/Cart');
const {checkAdminOrAuthorisedUser} = require('../middlewares/authentication');
const {BadRequestError, UnauthenticatedError, UnauthorisedError, NotFoundError} = require('../errors');

const createCart = async (req, res) =>{
    const products = req.body;
    if(!products){
        throw new BadRequestError('Please provide products');
    }
    req.body.user = req.user.userId;

    const cart = await Cart.create({...req.body});
    res.status(StatusCodes.CREATED).json({cart});
};

const getSingleCart = async (req, res) =>{
    const {id: cartId} = req.params;

    if(!cartId){
        throw new BadRequestError('Please provide cart ID');
    }

    const cart = await Cart.findOne({_id: cartId});

    if(!cart){
        throw new NotFoundError(`No cart with ID: ${cartId}`);
    }
    checkAdminOrAuthorisedUser(req.user, cart.user);
    res.status(StatusCodes.OK).json({cart})
};

const getAllCarts = async (req, res) =>{
    const carts = await Cart.find({});
    res.status(StatusCodes.OK).json({carts, count: carts.length});
};

const updateCart = async (req, res) =>{
    const {products} = req.body;
    
    if(!products){
        throw new BadRequestError('Please provide products for update');
    };

    const {id: cartId} = req.params;
    if(!cartId){
        throw new BadRequestError('Please provide cart ID');
    }
    
    const cart = await Cart.findOne({_id: cartId});
    if(!cart){
        throw new NotFoundError(`No cart with ID: ${cartId}`);
    };

    if(req.user.userId !== cart.user.toString()){
        throw new UnauthenticatedError('You are not authorised to update this cart');
    }
    
    cart.products = products;
    await cart.save();
    res.status(StatusCodes.OK).json({cart});
};

const deleteCart = async (req, res) =>{
    const {id: cartId} = req.params;
    if(!cartId){
        throw new BadRequestError('Please provide Cart ID');
    };

    const cart = await Cart.findOne({_id: cartId});
    if(!cart){
        throw new NotFoundError(`No cart with ID: ${cartId}`);
    };

    if(req.user.userId !== cart.user.toString()){
        throw new UnauthenticatedError('You are not authorised to delete this cart');
    }
    await cart.remove();
    res.status(StatusCodes.OK).json({msg: `Success! Cart has been removed.`});
}
module.exports = {createCart, getSingleCart, getAllCarts, updateCart, deleteCart};