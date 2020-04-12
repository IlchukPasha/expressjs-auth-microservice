const crypto = require('crypto');

const HttpError = require('../core/errors/httpError');

const { compareData } = require('../core/services/Bcrypt');
const { generateToken } = require('../core/services/Jwt');
const { hashData } = require('../core/services/Bcrypt');
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

    if (!user) {
      throw new HttpError('Email not exists.', 401);
    }

    if (!(await compareData(password, user.password))) {
      throw new HttpError('Invalid password.', 401);
    }

    const { token: accessToken, expiresIn } = await generateToken(user);

    const refreshToken = crypto
      .createHash('md5')
      .update(crypto.randomBytes(40))
      .digest('hex');

    const hashedRefreshToken = await hashData(refreshToken);

    await User.query()
      .where({ id: user.id }) // TODO try patch and see the diff
      .update({
        refreshToken: hashedRefreshToken,
        refreshTokenExpires: Math.floor(Date.now() / 1000) + 2592000 // 30 days in seconds
      });

    // TODO unit testing

    return {
      user,
      token: {
        tokenType: 'bearer',
        accessToken,
        expiresIn,
        refreshToken
      }
    };
  }

  static async getNewAccessToken(data) {
    const { userId, refreshToken } = data;

    const user = await User.query().findOne('id', userId);

    if (!user) {
      throw new HttpError('Invalid user.', 401);
    }

    if (!(await compareData(refreshToken, user.refreshToken))) {
      throw new HttpError('Invalid refresh token.', 401);
    }

    const { token: accessToken, expiresIn } = await generateToken(user);

    // TODO if refreshToken will expire soon then generate new
    const newRefreshToken = crypto
      .createHash('md5')
      .update(crypto.randomBytes(40))
      .digest('hex');

    const hashedNewRefreshToken = await hashData(newRefreshToken);

    await User.query()
      .where({ id: user.id }) // TODO try patch and see the diff
      .update({
        refreshToken: hashedNewRefreshToken,
        refreshTokenExpires: Math.floor(Date.now() / 1000) + 2592000 // 30 days in seconds
      });

    return {
      tokenType: 'bearer',
      accessToken,
      expiresIn,
      refreshToken: newRefreshToken
    };
  }
}

module.exports = UserService;
