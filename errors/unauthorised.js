const {StatusCodes} = require('http-status-codes');
const CustomAPIError = require('./custom');

class UnauthorisedError extends CustomAPIError{
    constructor(message){
        super(message);
        this.statusCode = StatusCodes.FORBIDDEN;
    }
};

module.exports = UnauthorisedError;