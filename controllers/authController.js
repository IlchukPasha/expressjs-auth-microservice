const { pick } = require('lodash');

const { UserService } = require('./../services');


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

exports.signup = signup;