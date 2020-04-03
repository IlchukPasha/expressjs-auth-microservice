const { validationResult } = require('express-validator');

const ValidationError = require('./../core/errors/validationError');

module.exports = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new ValidationError(errors.array());
  }

  return next();
};