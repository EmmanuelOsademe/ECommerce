const User = require('../models/User');
const {UnauthenticatedError, NotFoundError, BadRequestError} = require('../errors');
const {StatusCodes} = require('http-status-codes');
const {tokeniseUser, attachCookiesToResponse} = require('../utils');
const {checkAdminOrAuthorisedUser} = require('../middlewares/authentication');

const getAllUsers = async (req, res) =>{
    const users = await User.find({});
    res.status(StatusCodes.OK).json({users, count: users.length});
};

const updateUser = async (req, res) =>{
    const {email, name} = req.body;

    if(!(email || name)){
        throw new BadRequestError('Please provide email or name for update');
    };

    const user = await User.findOne({_id: req.user.userId});
    if(!user){
        throw new NotFoundError(`User with ID: ${req.user.userId} not found`);
    };

    if(email){
        user.email = email;
    };

    if(name){
        user.name = name;
    };

    await user.save();
    const tokenisedUser = tokeniseUser(user);
    attachCookiesToResponse({res, user:tokenisedUser});
    res.status(StatusCodes.OK).json({user: tokenisedUser});
};

const updatePassword = async (req, res) =>{
    const {currentPassword, newPassword} = req.body;

    if(!currentPassword || !newPassword){
        throw new BadRequestError("Please provide current password and new password");
    }

    const user = await User.findOne({_id: req.user.userId});
    if(!user){
        throw new NotFoundError(`User with ID: ${req.user.userId} not found`);
    }

    const isPasswordCorrect = user.comparePassword(currentPassword);
    if(!isPasswordCorrect){
        throw new UnauthenticatedError(`Authentication failed. Current password Incorrect`);
    }
    user.password = newPassword;
    user.save();
    res.status(StatusCodes.OK).json({msg: `Success. Password updated!`});
};

const getSingleUser = async (req, res) =>{
    const {id: userId} = req.params;
    if(!userId){
        throw new BadRequestError(`Please provide userId`);
    };

    const user = await User.findOne({_id: userId});

    if(!user){
        throw new NotFoundError(`User with ID: ${userId} not found`);
    };

    const tokenisedUser = tokeniseUser(user);

    checkAdminOrAuthorisedUser(req.user, userId);
    res.status(StatusCodes.OK).json({user: tokenisedUser});
};

const showCurrentUser = async (req, res) =>{
    res.status(StatusCodes.OK).json({user: req.user});
};

const deleteUser = async (req, res) =>{
    const user = await User.findOne({_id: req.params.id});
    if(!user){
        throw new NotFoundError(`User with ID: ${req.params.id} not found`);
    }
    checkAdminOrAuthorisedUser(req.user, req.params.id);
    await user.remove();
    res.status(StatusCodes.OK).json({msg: 'Success! User removed.'});
}

module.exports = {getAllUsers, updateUser, getSingleUser, showCurrentUser, deleteUser, updatePassword};