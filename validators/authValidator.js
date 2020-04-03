const { body } = require('express-validator');

exports.validate = method => {
  switch (method) {
    case 'signup': {
      return [ 
        body('email', 'Invalid email').exists().isEmail(),
        body('password')
          .exists().withMessage('is required')
          .isLength({ min: 6 }).withMessage('must be at least 6 chars long'),
        body('firstName')
          .exists().withMessage('is required')
          .isLength({ min: 6 }).withMessage('must be at least 6 chars long'),
        body('lastName')
          .exists().withMessage('is required')
          .isLength({ min: 6 }).withMessage('must be at least 6 chars long')
      ]; 
    }
  }
}