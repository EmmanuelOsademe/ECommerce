const jwt = require('jsonwebtoken');

const tokeniseUser = (user) =>{
    return({name: user.name, email: user.email, role: user.role, userId: user._id});
}

const createJWT = ({payload}) =>{
    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: process.env.JWT_LIFETIME})
    return token;
};

const isTokenValid = (token) =>{
    return jwt.verify(token, process.env.JWT_SECRET);
};

const attachCookiesToResponse = ({res, user}) =>{
    const token = createJWT({payload: user});

    const cookieDuration = Number(process.env.COOKIE_DURATION);

    res.cookie('token', token, {
        httpOnly: true,
        expiresIn: new Date(Date.now() + cookieDuration),
        secure: process.env.NODE_ENV === "production",
        signed: true
    });
};

module.exports = {tokeniseUser, createJWT, isTokenValid, attachCookiesToResponse};