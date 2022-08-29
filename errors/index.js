const BadRequestError = require('./badRequest');
const NotFoundError = require('./notFound');
const UnauthenticatedError = require('./unauthenticated');
const UnauthorisedError = require('./unauthorised');
const CustomAPIError = require('./custom');

module.exports = {BadRequestError, NotFoundError, UnauthenticatedError, UnauthorisedError, CustomAPIError};