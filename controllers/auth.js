const User = require('../models/User');
const {BadRequestError, NotFoundError, UnauthenticatedError} = require('../errors');
const {StatusCodes} = require('http-status-codes');
const {tokeniseUser, attachCookiesToResponse} = require('../utils');

const registerUser = async (req, res) =>{
    const {name, email, password} = req.body;
    if(!(name || email || password)){
        throw new BadRequestError('Missing required field(s)')
    }

    const emailAlreadyExists = await User.findOne({email});
    if(emailAlreadyExists){
        throw new BadRequestError(`${email} already exists. Please enter a different email address`);
    }

    const role = (await User.countDocuments({})) === 0 ? 'admin' : 'user';

    const user = await User.create({name, email, password, role});

    const tokenisedUser = tokeniseUser(user);

    attachCookiesToResponse({res, user: tokenisedUser});
    res.status(StatusCodes.OK).json({tokenisedUser});
};

const loginUser = async (req, res) =>{
    const {email, password} = req.body;
    
    if(!email || !password){
        throw new BadRequestError('Please provide email and password');
    }

    const user = await User.findOne({email});

    if(!user){
        throw new NotFoundError(`User with email: ${email} does not exist`);
    };
    
    const isPasswordValid = await user.comparePassword(password);

    if(!isPasswordValid){
        throw new UnauthenticatedError(`Password is incorrect. Please try again`);
    }

    const tokenisedUser = tokeniseUser(user);
    attachCookiesToResponse({res, user: tokenisedUser});
    res.status(StatusCodes.OK).json({tokenisedUser});
};

const logoutUser = async (req, res) =>{
    res.cookie('token', "logout", {
        httpOnly: true,
        expiresIn: new Date(Date.now() + 1000)
    });
    res.status(StatusCodes.OK).json({msg: `User logged out successfully`});
}

module.exports = {registerUser, loginUser, logoutUser};