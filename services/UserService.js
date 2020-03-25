const HttpError = require('./../core/errors/httpError');

const { User } = require('./../models');

class UserService {
  static async signup(user) {
    const { email } = user;

    const [{ count: userCount }] = await User.query().where({ email }).count();

    if (+userCount) {
      throw new HttpError('Email already exists', 400);
    }

    return User.query().insert(user);
  }
}

module.exports = UserService;