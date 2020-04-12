const mask = require('json-mask');
const { pick } = require('lodash');

const { UserService } = require('../services');

// const ValidationError = require('../core/errors/validationError');
// const { signinSchema, signupSchema } = require('../validators/joiAuthValidator');

/**
 * @swagger
 * paths:
 *  /api/signup:
 *    post:
 *      tags:
 *        - Registration
 *      summary: Sign up
 *      description: Sign up
 *      parameters:
 *        - $ref: "#/parameters/qFields"
 *        - in: body
 *          name: body
 *          schema:
 *            $ref: "#/definitions/SignUp"
 *      responses:
 *        200:
 *          $ref: "#/responses/200"
 *        400:
 *          $ref: "#/responses/400"
 */
const signup = async (req, res, next) => {
  const reqUser = pick(req.body, [
    'email',
    'password',
    'firstName',
    'lastName'
  ]);

  // await body('confirmPassword')
  //   .equals(req.body.password).withMessage('passwords do not match')
  //   .run(req);
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return next(new ValidationError(errors.array()));
  // }

  let user;

  try {
    user = await UserService.signup(reqUser);
  } catch (error) {
    return next(error);
  }

  // instead of explicit mask can be used https://github.com/nemtsov/express-partial-response
  res.json(mask(user, 'id,email,firstName,lastName'));
  // res.json(user); // when converting form object to kson User model viseble is applied
};

/**
 * @swagger
 * paths:
 *  /api/signin:
 *    post:
 *      tags:
 *        - Authorization
 *      summary: Sign in
 *      description: Sign in via email & password
 *      parameters:
 *        - $ref: "#/parameters/qFields"
 *        - in: body
 *          name: body
 *          schema:
 *            $ref: "#/definitions/SignIn"
 *      responses:
 *        200:
 *          $ref: "#/responses/200"
 *        400:
 *          $ref: "#/responses/400"
 */
const signin = async (req, res, next) => {
  // const resValidate = signinSchema.validate(req.body, { abortEarly: false });
  // if (resValidate.error) {
  //   return next(new ValidationError(resValidate.error.details));
  // }
  // try {
  //   await signinSchema.validateAsync(req.body, { abortEarly: false });
  // } catch (e) {
  //   return next(new ValidationError(e.details));
  // }

  const reqData = pick(req.body, [
    'email',
    'password'
  ]);

  let data;

  try {
    data = await UserService.signin(reqData);
  } catch (error) {
    return next(error);
  }

  res.json(mask(data, 'user(id,email,firstName,lastName),token(accessToken)'));
};

/**
 * @swagger
 * paths:
 *  /api/oauth/token:
 *    post:
 *      tags:
 *        - Authorization
 *      summary: Get new access token
 *      description: Get new access token
 *      parameters:
 *        - in: body
 *          name: body
 *          schema:
 *            $ref: "#/definitions/getNewAccessToken"
 *      responses:
 *        200:
 *          $ref: "#/responses/200"
 *        400:
 *          $ref: "#/responses/400"
 */
const getNewAccessToken = async (req, res, next) => {
  const reqData = pick(req.body, [
    'userId',
    'refreshToken'
  ]);

  let data;

  try {
    data = await UserService.getNewAccessToken(reqData);
  } catch (error) {
    return next(error);
  }

  res.json(data);
};

exports.signup = signup;
exports.signin = signin;
exports.getNewAccessToken = getNewAccessToken;
