const {UnauthenticatedError, UnauthorisedError} = require('../errors');
const {isTokenValid} = require('../utils');

const authenticateUser = (req, res, next) =>{
    const token = req.signedCookies.token;

    if(!token){
        throw new UnauthenticatedError('Authentication failed. Please login');
    }

    try {
        const {name, email, userId, role} = isTokenValid(token);
        req.user = {name, email, userId, role};
        next();
    } catch (error) {
        throw new UnauthenticatedError(`Authentication failed. Error: ${error}`);
    }
};

const authorisePermission = (...roles) =>{
    return (req, res, next) =>{
        if(!roles.includes(req.user.role)){
            throw new UnauthorisedError("You are not authorised to access this route");
        };
        next();
    }
};

const checkAdminOrAuthorisedUser = (requestUser, resourceUserId) =>{
    if(requestUser.role === "admin") return;
    if(requestUser.userId === resourceUserId.toString()) return;
    throw new UnauthorisedError('You are not permitted to access this route.');
}

module.exports = {authenticateUser, authorisePermission, checkAdminOrAuthorisedUser};