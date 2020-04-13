const crypto = require('crypto');

const HttpError = require('../core/errors/httpError');

const { compareData } = require('../core/services/Bcrypt');
const { generateToken } = require('../core/services/Jwt');
const { hashData } = require('../core/services/Bcrypt');
const { User } = require('../models');
const {
  app: {
    refreshTokenExpireSeconds,
    millisecondsInSecond
  }
} = require('../core/config');

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

    // https://github.com/ai/nanoid
    // https://stackoverflow.com/questions/8855687/secure-random-token-in-node-js
    const refreshToken = await new Promise(
      resolve => crypto.randomBytes(20, (__, buffer) => resolve(buffer.toString('hex')))
    );

    const hashedRefreshToken = await hashData(refreshToken);
    const refreshTokenExpires = Math.floor(Date.now() / millisecondsInSecond) + refreshTokenExpireSeconds;

    await User.query()
      .where({ id: user.id })
      .patch({
        refreshToken: hashedRefreshToken,
        refreshTokenExpires
      });

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
    const nowInSeconds = Math.floor(Date.now() / millisecondsInSecond);

    const user = await User.query().findOne('id', userId);

    if (!user) {
      throw new HttpError('Invalid user.', 401);
    }

    if (!(await compareData(refreshToken, user.refreshToken))) {
      throw new HttpError('Invalid refresh token.', 401);
    }

    if (nowInSeconds > user.refreshTokenExpires) {
      throw new HttpError('Refresh token is expired.', 401);
    }

    const { token: accessToken, expiresIn } = await generateToken(user);

    const newRefreshToken = await new Promise(
      resolve => crypto.randomBytes(20, (__, buffer) => resolve(buffer.toString('hex')))
    );

    const hashedNewRefreshToken = await hashData(newRefreshToken);
    const newRefreshTokenExpires = Math.floor(Date.now() / millisecondsInSecond) + refreshTokenExpireSeconds;

    await User.query()
      .where({ id: user.id })
      .patch({
        refreshToken: hashedNewRefreshToken,
        refreshTokenExpires: newRefreshTokenExpires
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
