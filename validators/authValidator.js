const { body } = require('express-validator');

exports.validate = method => {
  switch (method) {
    case 'signup': {
      return [
        body('email', 'Invalid email')
          .exists()
          .isEmail(),
        // .custom(async value => {
        //   const [{ count: userCount }] = await knex('users').where({ email: value }).count();

        //   if (+userCount) {
        //     throw new Error('Email already exists');
        //   }

        //   return true;
        // }),
        body('password')
          .exists().withMessage('password is required')
          .isLength({ min: 6 }).withMessage('password must be at least 6 chars long'),
        body('confirmPassword')
          .exists().withMessage('confirm password is required')
          .custom((value, { req }) => {
            if (value !== req.body.password) {
              throw new Error('Password confirmation does not match password');
            }

            return true;
          }),
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
        body('email', 'Invalid email')
          .exists()
          .isEmail(),
        body('password')
          .exists().withMessage('password is required')
          .isLength({ min: 6 }).withMessage('password must be at least 6 chars long')
      ];
    }
    case 'getNewAccessToken': {
      return [
        body('userId')
          .exists().withMessage('User id is required')
          .isInt({ min: 1 }).withMessage('User id must be integer and at least 1'),
        body('refreshToken')
          .exists().withMessage('Refresh token is required')
          .isLength({ min: 40, max: 40 }).withMessage('Refresh token must be 40 chars long')
      ];
    }
    default: return [];
  }
};
