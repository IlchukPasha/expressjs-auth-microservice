const HttpError = require('../core/errors/httpError');
const { comparePassword } = require('../core/services/Bcrypt');
const { generateToken } = require('../core/services/Jwt');
const { User } = require('../models');

class UserService {
  static async signup(user) {
    const { email } = user;

    const [{ count: userCount }] = await User.query().where({ email }).count();

    if (+userCount) {
      throw new HttpError('Email already exists', 400);
    }

    return User.query().insert(user);
  }

  static async signin(data) {
    const { email, password } = data;

    const user = await User.query().where({ email }).first();
    // const user = await User.query().findOne('email', email);

    if (!user) {
      throw new HttpError('Email not exists.', 401);
    }

    if (!(await comparePassword(password, user.password))) {
      throw new HttpError('Invalid password.', 401);
    }

    const accessToken = await generateToken(user);

    // TODO add oauth token response
    // TODO add swagger spec 3.0, try swagger hub and swagger ui in module
    // TODO add logger
    // TODO how to debug
    // TODO unit testing
    // TODO add mask and maybe select columns to queries

    return {
      user,
      token: {
        accessToken
      }
    };
  }
}

module.exports = UserService;
