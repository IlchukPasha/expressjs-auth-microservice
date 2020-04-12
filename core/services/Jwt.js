const jsonwebtoken = require('jsonwebtoken');

const HttpError = require('../errors/httpError');
const { app: { jwtExpire } } = require('../config');

class Jwt {
  static generateToken(user) {
    const payload = { data: { id: user.id } };

    const expiresIn = Math.floor(Date.now() / 1000) + jwtExpire;

    return new Promise((resolve, reject) => {
      jsonwebtoken.sign(payload, process.env.JWT_SECRET, { expiresIn }, (err, token) => {
        if (err) {
          reject(new HttpError('You cannot be logged at the moment.', 401));
        } else {
          resolve({ token, expiresIn });
        }
      });
    });
  }

  static verifyToken(token) {
    return new Promise((resolve, reject) => {
      jsonwebtoken.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          reject(new HttpError('Your authorization cannot be verified at the moment.', 401));
        } else {
          resolve(decoded);
        }
      });
    });
  }
}

module.exports = Jwt;
