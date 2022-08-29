const {StatusCodes} = require('http-status-codes');

const errorHandler = (err, req, res, next) =>{
    console.log(err);

    //Set default custom error
    let customError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || 'Something went wrong. Try again later'
    };

    if(err.name === "CastError"){
        customError.statusCode = 404;
        customError.msg = `No item found with ID: ${err.value}`;
    }

    if(err.name === "ValidationError"){
        customError.statusCode = 400;
        customError.msg = Object.values(err.errors).map((item) =>item.message).join(', ');
    }

    res.status(customError.statusCode).json({msg: customError.msg});
};

module.exports = {errorHandler};