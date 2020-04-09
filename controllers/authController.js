const { pick } = require('lodash');

const { UserService } = require('./../services');

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
 *        - in: body
 *          name: body
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                default: mail@mail.com
 *              password:
 *                type: string
 *                default: "123456"
 *              firstName:
 *                type: string
 *                default: "First Name"
 *              lastName:
 *                type: string
 *                default: "Last Name"
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

  let user;

  try {
    user = await UserService.signup(reqUser);
  } catch (error) {
    return next(error);
  }

  res.json(user);
}

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
 *        - in: body
 *          name: body
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                default: mail@mail.com
 *              password:
 *                type: string
 *                default: "123456"
 *      responses:
 *        200:
 *          $ref: "#/responses/200"
 *        400:
 *          $ref: "#/responses/400"
 */
const signin = async (req, res, next) => {
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

  res.json(data);
}

exports.signup = signup;
exports.signin = signin;