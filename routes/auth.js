const express = require('express');

const { signup } = require('./../controllers/authController');
const { validate } = require('./../validators/authValidator');
const { checkValidation } = require('./../middlewares');

const router = express.Router();

router.post('/signup', validate('signup'), checkValidation, signup);

module.exports = router;