const { body } = require('express-validator');

exports.validate = method => {
  switch (method) {
    case 'signup': {
      return [ 
        body('email', 'Invalid email').exists().isEmail(),
        body('password')
          .exists().withMessage('password is required')
          .isLength({ min: 6 }).withMessage('password must be at least 6 chars long'),
        body('firstName')
          .exists().withMessage('First name is required')
          .isLength({ min: 6 }).withMessage('First name must be at least 6 chars long'),
        body('lastName')
          .exists().withMessage('Last name is required')
          .isLength({ min: 6 }).withMessage('Last name must be at least 6 chars long')
      ]; 
    }
    case 'signin': {
      return [ 
        body('email', 'Invalid email').exists().isEmail(),
        body('password')
          .exists().withMessage('password is required')
          .isLength({ min: 6 }).withMessage('password must be at least 6 chars long'),
      ]; 
    }
  }
}