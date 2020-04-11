const Joi = require('@hapi/joi');

const signupSchema = Joi.object({
  email: Joi
    .string()
    .required()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),

  password: Joi
    .string()
    .required()
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

  confirmPassword: Joi.ref('password'),

  firstName: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),

  lastName: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
});

const signinSchema = Joi.object({
  email: Joi
    .string()
    .required()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),

  password: Joi
    .string()
    .required()
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
});

exports.signupSchema = signupSchema;
exports.signinSchema = signinSchema;
