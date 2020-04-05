const bcrypt = require('bcryptjs');

const HttpError = require('./../core/errors/httpError');
const { User } = require('./../models');

class UserService {
  static async signup(user) {
    const { email } = user;

    const [{ count: userCount }] = await User.query().where({ email }).count();

    if (+userCount) {
      throw new HttpError('Email already exists', 400);
    }

    const salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(user.password, salt);

    return User.query().insert(user);
  }

  static async signin(data) {
    const { email, password } = data;

    const user = await User.query().where({ email });

    if (!user) {
      throw new HttpError('Email not exists.', 401);
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new HttpError('Invalid password.', 401);
    }

    // TODO generate token

    return user;
  }
}

module.exports = UserService;