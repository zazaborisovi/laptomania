const AppError = require('../utils/appError');

const allowedTo = (...roles) =>{
  return (req, res, next) => {
    if (!roles.includes(req.user.role)){
      return next(new AppError('You are not allowed to perform this action', 403));
    }
    next();
  }
}

module.exports = allowedTo