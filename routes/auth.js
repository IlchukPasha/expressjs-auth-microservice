const express = require('express');

const { validate } = require('../validators/authValidator');
const { checkValidation } = require('../middlewares');
const { signup, signin, getNewAccessToken } = require('../controllers/authController');

const router = express.Router();

router.post('/signup', validate('signup'), checkValidation, signup);
router.post('/signin', validate('signin'), checkValidation, signin);
router.post('/oauth/token', validate('getNewAccessToken'), checkValidation, getNewAccessToken);

module.exports = router;
