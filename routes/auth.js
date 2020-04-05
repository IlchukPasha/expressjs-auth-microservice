const express = require('express');

const { signup, signin } = require('./../controllers/authController');
const { validate } = require('./../validators/authValidator');
const { checkValidation } = require('./../middlewares');

const router = express.Router();

router.post('/signup', validate('signup'), checkValidation, signup);
router.post('/signin', validate('signin'), checkValidation, signin);

module.exports = router;